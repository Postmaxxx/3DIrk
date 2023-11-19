import { ICatalog, IFullState, TLang } from '../../../interfaces';
import './catalog-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect,  } from "react";
import { allActions } from "../../../redux/actions/all";
import { inputsProps, resetFetch } from '../../../assets/js/consts';
import { errorsChecker, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import { IModalFunctions } from '../../../components/Modal/Modal';
import Message from '../../../components/Message/Message';
import Uploader from '../../../../src/components/Preloaders/Uploader';


interface IPropsState {
    lang: TLang
    catalog: ICatalog
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}

interface IProps extends IPropsState, IPropsActions {}


const CategoriesChanger: FC<IProps> = ({lang, setState, modal, catalog}): JSX.Element => {
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const featurerRef = useRef<IFeaturerFunctions>(null)
    const _catalog = useRef<HTMLDivElement>(null)
    
    const closeModal = useCallback(async (): Promise<void> => {
        if (await modal?.getName() === 'catalogSend') {
            if (catalog.send.status === 'success') {
                setState.catalog.loadCatalog()
                errChecker.clear()        
            }
            setState.catalog.setSendCatalog(resetFetch)
        }
        errChecker.clear()
        modal?.closeCurrent()
	}, [catalog.send.status, errChecker])



    useEffect(() => { 
        if (catalog.send.status === 'success' || catalog.send.status === 'error') {
            modal?.closeName('catalogSending');
            modal?.openModal({ //if error/success - show modal about send order
                name: 'catalogSend',
                onClose: closeModal,
                children: <Message {...modalMessageCreator(catalog.send, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (catalog.send.status === 'fetching') {
            modal?.openModal({
                name: 'catalogSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending catalog, please wait..." : "Отправка каталога, пожалуйста ждите..."}/>
            })
        }
    }, [catalog.send.status])



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {        
        prevent(e)
        if (!featurerRef.current || !_catalog.current) return
        //check errors
        const errors = featurerRef.current.getErrors().map(err => (`${lang === 'en' ? 'Field: ' : 'Поле: '}${err[lang]}`))
        if (errors.length > 0) { //show modal with error
            return modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModal,
                children: <Message 
                    header={lang === 'en' ? 'Errors was found' : 'Найдены ошибки'}
                    status={'error'}
                    text={errors}
                    buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
                />
            })
        }
        setState.catalog.sendCatalog(featurerRef.current.getFeatures()) 
    }


    const fillValues = (): void => {      
        if (!featurerRef.current) return
        featurerRef.current.setFeatures(catalog.list)
    }


    useEffect(() => {
        if (catalog.load.status !== 'success' && catalog.load.status  !== 'fetching') {
			setState.catalog.loadCatalog()
		}
        if (catalog.load.status === 'success') {
            fillValues()
        }
    }, [catalog.load.status])

    

    return (
        <div className="page page_creator_catalog">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change categoies' : 'Изменение категорий'}</h1>
                    <form className='form_full form_add-color' >
                        <div className="block_text">
                            <h3 className='full-width'>{lang === 'en' ? 'List' : 'Список'}</h3>           
                        </div>
                        <div className="catalog" ref={_catalog}>
                            <Featurer 
                                lang={lang} 
                                ref={featurerRef} 
                                type='input'
                                rules={{min: inputsProps.category.min, max: inputsProps.category.max}}
                            />
                        </div>

                        <button className='button_blue button_post' disabled={catalog.send.status === 'fetching'} onClick={onSubmit}>
                            {lang === 'en' ? 'Save list' : 'Сохранить список'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    catalog: state.catalog.catalog,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesChanger)