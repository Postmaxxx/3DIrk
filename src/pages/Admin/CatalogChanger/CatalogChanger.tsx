import { ICatalog,  ICatalogItem,  ICatalogState,  ICatalogTypes,  IFullState, TLang, TLangText } from 'src/interfaces';
import './catalog-changer.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import Preloader from 'src/components/Preloaders/Preloader';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import { checkAndLoad, errorsChecker, prevent } from 'src/assets/js/processors';
import Delete from 'src/components/Delete/Delete';
import Featurer, { IFeaturerFunctions } from 'src/components/Featurer/Featurer';


interface IOnAddCategory {
    target: HTMLElement
    _id: string
    values: {
        en: string
        ru: string
    }
    e?: React.MouseEvent<HTMLButtonElement>
}

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
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const catalog = useRef<IFeaturerFunctions>(null)
    const _catalog = useRef<HTMLDivElement>(null)
        

    
    const closeModal = useCallback(() => {
        errChecker.clear()        
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        if (catalogState.catalog.send.status === 'success') {
            setState.catalog.setSendCatalog(resetFetch)// clear fetch status
            setState.catalog.loadCatalog()
        }
	}, [catalogState.catalog.send.status, errChecker])



    useEffect(() => { 
        if (catalogState.catalog.send.status === 'idle' || catalogState.catalog.send.status === 'fetching')  return
        const errors: string[] = catalogState.catalog.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[catalogState.catalog.send.status][lang],
            status: catalogState.catalog.send.status,
            text: [catalogState.catalog.send.message[lang], ...errors]
        })
        modal.current?.openModal()
    }, [catalogState.catalog.send.status])



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!catalog.current || !_catalog.current) return
        
        _catalog.current.querySelectorAll('input').forEach(item => {           
            errChecker.check(item, 0, 30)
        })

        if (errChecker.amount() > 0) {
            errChecker.add(lang === 'en' ? 'Empty inputs exists' : 'Есть незаполненная поля')
            message.current?.update({...errChecker.result(), text: [lang === 'en' ? 'Some fields are empty' : 'Присутствуют пустые поля']})
            modal.current?.openModal()           
            return
        }

        setState.catalog.sendCatalog(catalog.current.getFeatures())        
    }




    const fillValues = () => {      
        if (!catalog.current) return
        catalog.current.setFeatures(catalogState.catalog.list)
    }



    useEffect(() => {
       /* if (catalogState.catalog.load.status !== 'success' && catalogState.catalog.load.status !== 'fetching') {
            setState.catalog.loadCatalog()
        }*/
        checkAndLoad(catalogState.catalog.load.status, setState.catalog.loadCatalog)

        if (catalogState.catalog.load.status === 'success') {
            fillValues()
        }
    }, [catalogState.catalog.load.status])

   



    return (
        <div className="page page_catalog-changer">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change categoies' : 'Изменение категорий'}</h1>
                    <form>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'CATEGORIES' : 'КАТЕГОРИИ'}</h2>           
                        <div className="catalog" ref={_catalog}>
                            <Featurer lang={lang} ref={catalog}/>
                        </div>

                        <button className='button_blue post' disabled={catalogState.catalog.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {catalogState.catalog.send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? 'Save list' : 'Сохранить список'}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modal} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
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