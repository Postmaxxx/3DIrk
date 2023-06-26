import { ICatalog,  ICatalogItem,  ICatalogTypes,  IFullState, TLang, TLangText } from 'src/interfaces';
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
import { errorsChecker, prevent } from 'src/assets/js/processors';
import Delete from 'src/components/Delete/Delete';


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
    catalogState: ICatalog
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
    const _addCategory = useRef<HTMLButtonElement>(null)
    const _catalog = useRef<HTMLDivElement>(null)

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])


    const closeModal = useCallback(() => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear() 
        if (catalogState.send.status === 'success') {
            setState.catalog.setSendCatalog(resetFetch)// clear fetch status
            setState.catalog.loadCatalog()
        }
	}, [catalogState.send.status])




    
    useEffect(() => { 
        if (catalogState.send.status === 'idle' || catalogState.send.status === 'fetching')  return
        const errors: string[] = catalogState.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[catalogState.send.status][lang],
            status: catalogState.send.status,
            text: [catalogState.send.message[lang], ...errors]
        })
        modal.current?.openModal()
    }, [catalogState.send.status])




    const onAddCategory = ({target, _id, values, e}: IOnAddCategory) => {
        if (e) {
            prevent(e)
        }
        
        const newCatalogBlock = document.createElement('div')
        newCatalogBlock.classList.add('block_category')
        newCatalogBlock.classList.add('full-width')
        newCatalogBlock.setAttribute('data-id', _id)

        const wrEn = document.createElement('div'); wrEn.classList.add('input__wrapper')
        const labelUrlEn = document.createElement('label'); labelUrlEn.innerText = lang === 'en' ? 'Value EN' : 'Значение EN'
        const inputEn = document.createElement('input'); inputEn.setAttribute('data-content','en')
        wrEn.appendChild(labelUrlEn); wrEn.appendChild(inputEn)
        inputEn.value = values.en
        inputEn.onchange = (e) => onCategoryChanged(e.target as HTMLInputElement);

        const wrRu = document.createElement('div'); wrRu.classList.add('input__wrapper')
        const labelUrlRu = document.createElement('label'); labelUrlRu.innerText = lang === 'en' ? 'Value RU' : 'Значение RU'
        const inputRu = document.createElement('input'); inputRu.setAttribute('data-content','ru')
        wrRu.appendChild(labelUrlRu); wrRu.appendChild(inputRu)
        inputRu.value = values.ru
        inputRu.onchange = (e) => onCategoryChanged(e.target as HTMLInputElement);
        

        /*const delBtn = document.createElement('button');
        delBtn.innerHTML = 'X';
        delBtn.classList.add('button_blue');
        delBtn.classList.add('del');
        delBtn.onclick = (e) => onDeleteCategory(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>)*/
        const delBtn = <Delete<string> remove={onDeleteCategory} idInstance="1" lang={lang} disabled={false}/>

        newCatalogBlock.appendChild(wrEn)
        newCatalogBlock.appendChild(wrRu)
        newCatalogBlock.appendChild(delBtn)
        if (!target) return
        target.appendChild(newCatalogBlock)
    }


    const onCategoryChanged = (e: HTMLInputElement) => {
        const parent = e.parentElement?.parentElement as HTMLDivElement
        if (parent.dataset.status !== 'new' && parent.dataset.status !== 'changed') {
            parent.dataset.status = 'changed'
        }
    }


    const onDeleteCategory = (e: any) => {
        prevent(e)
        const parent = e.currentTarget?.parentNode as HTMLElement
        parent.remove();
    }


    

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        const newCatalog = [] as ICatalogItem[]
        let errors = false
        Array.from(_catalog.current?.querySelectorAll('.block_category') || []).forEach((block) => {
            const values = {
                en: block.querySelectorAll('input')[0].value.trim(),
                ru: block.querySelectorAll('input')[1].value.trim()
            }

            if (!values.en || !values.ru) {
                errors = true
            }
            
            newCatalog.push({
                name: values,
                _id: (block as HTMLElement).dataset.id || ''
            })
        })

        if (errors) {
            errChecker.add(lang === 'en' ? 'Empty inputs exists' : 'Есть незаполненная поля')
            message.current?.update(errChecker.result())
            modal.current?.openModal()               
            return
        }

        // to backend
        setState.catalog.sendCatalog(newCatalog)        
    }






    const fillValues = () => {      
        if (!_catalog.current || !_addCategory.current) return
        _catalog.current.innerHTML = '' //clear to avoid duplicate while rerendering
       

        catalogState.list.forEach(item => { //add and fill all existing inputs
            onAddCategory({
                target: _catalog.current as HTMLElement, 
                _id: item._id,
                values: {
                    en: item.name.en,
                    ru: item.name.ru
                }
            })
        })
    }



    useEffect(() => {
        if (catalogState.load.status !== 'success' && catalogState.load.status !== 'fetching') {
            setState.catalog.loadCatalog()
        }
        if (catalogState.load.status === 'success') {
            fillValues()
        }
    }, [catalogState.load.status])

   



    return (
        <div className="page page_fiber-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change categoies' : 'Изменение категорий'}</h1>
                    <form>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'CATEGORIES' : 'КАТЕГОРИИ'}</h2>           
                        <div className="catalog" ref={_catalog}></div>
                        <button 
                            className='button_blue add' 
                            ref={_addCategory} 
                            onClick={(e) => onAddCategory({
                                target: _catalog.current as HTMLElement, 
                                _id: '', 
                                values: {en: '', ru: ''},
                                e
                                })}>
                                {lang === 'en' ? '+' : '+'}
                            </button>


                        <button className='button_blue post' disabled={catalogState.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {catalogState.send.status === 'fetching' ? 
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
    catalogState: state.catalog.catalog
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesChanger)