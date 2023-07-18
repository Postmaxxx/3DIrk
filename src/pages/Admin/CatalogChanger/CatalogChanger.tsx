import { ICatalogState,  IFullState, TLang } from '../../../interfaces';
import './catalog-changer.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { useEffect,  } from "react";
import { allActions } from "../../../redux/actions/all";
import Preloader from '../../../components/Preloaders/Preloader';
import { inputsProps, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import { checkAndLoad, errorsChecker, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import inputChecker from '../../../../src/assets/js/inputChecker';


interface IPropsState {
    lang: TLang
    catalogState: ICatalogState
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}

interface IProps extends IPropsState, IPropsActions {}


const CategoriesChanger: FC<IProps> = ({lang, setState, catalogState}): JSX.Element => {
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const featurerRef = useRef<IFeaturerFunctions>(null)
    const _catalog = useRef<HTMLDivElement>(null)
    const focuser = useMemo(() => focusMover(), [lang])
    const processedContainer = '[data-selector="catalog-features"]'
    
    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        if (modalRef.current?.getOwner() === 'sender') {
            if (catalogState.catalog.send.status === 'success') {
                setState.catalog.loadCatalog() //reload catalog
                errChecker.clear()        
            }
        }
        if (modalRef.current?.getOwner() === 'errorChecker') {
            errChecker.clear()
        }
        setState.catalog.setSendCatalog(resetFetch)// clear fetch status
	}, [catalogState.catalog.send.status, errChecker])



    useEffect(() => { 
        if (catalogState.catalog.send.status === 'idle' || catalogState.catalog.send.status === 'fetching') return
        messageRef.current?.update(modalMessageCreator(catalogState.catalog.send, lang))
        modalRef.current?.openModal("sender")
    }, [catalogState.catalog.send.status])



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!featurerRef.current || !_catalog.current) return
        focuser.focusAll();//run over all elements to get all errors
        const errorFields = document.querySelector(processedContainer)?.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Empty inputs exists' : 'Есть незаполненная поля')
        }
        if (errChecker.amount() > 0) {
            messageRef.current?.update({...errChecker.result(), text: [lang === 'en' ? 'Some fields are empty' : 'Присутствуют пустые поля']})
            modalRef.current?.openModal("errorChecker")    
            return
        }
        console.log(featurerRef.current.getFeatures());
        
        //setState.catalog.sendCatalog(featurerRef.current.getFeatures())        
    }



    const fillValues = () => {      
        if (!featurerRef.current) return
        featurerRef.current.setFeatures(catalogState.catalog.list)
    }


    useEffect(() => {
        checkAndLoad(catalogState.catalog.load.status, setState.catalog.loadCatalog)
        if (catalogState.catalog.load.status === 'success') {
            fillValues()
        }
    }, [catalogState.catalog.load.status])

   


    useEffect(() => {
        onChangeFeaturesAmount()
    }, [lang])


    const onChangeFeaturesAmount = () => {  //select all inputs if new feature was added/ old one was removed  
        focuser.create({container: processedContainer})
        const allInputs = document.querySelector(processedContainer)?.querySelectorAll('[data-selector="input"]')
        allInputs?.forEach(input => {
            (input as HTMLInputElement | HTMLTextAreaElement).onblur = (e) => inputChecker({lang, min:inputsProps.category.min, max:inputsProps.category.max, el: e.target as HTMLInputElement});
        })
    }


    const onChangeFeature = (target: HTMLInputElement) => {       
        target.parentElement?.classList.remove('incorrect-value') 
    }


    return (
        <div className="page page_catalog-changer">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change categoies' : 'Изменение категорий'}</h1>
                    <form>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'CATEGORIES' : 'КАТЕГОРИИ'}</h2>           
                        <div className="catalog" ref={_catalog} data-selector="catalog-features">
                            <Featurer 
                                lang={lang} 
                                ref={featurerRef} 
                                amountChanged={onChangeFeaturesAmount}
                                valueChanged={onChangeFeature}/>
                        </div>

                        <button className='button_blue post' disabled={catalogState.catalog.send.status === 'fetching'} onClick={onSubmit}>
                            {catalogState.catalog.send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? 'Save list' : 'Сохранить список'}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modalRef} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={messageRef}/>
                </Modal>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    catalogState: state.catalog
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesChanger)