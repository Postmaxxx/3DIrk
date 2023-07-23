import { ICatalogState, IFibersState, IFullState, ISendProduct, TLang } from '../../../interfaces';
import './product-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import Preloader from '../../../components/Preloaders/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { inputsProps, navList, productEmpty, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import { checkAndLoad, checkIfNumbers, deepCopy, errorsChecker, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import Selector, { ISelectorFunctions } from '../../../components/Selector/Selector';
import inputChecker from '../../../../src/assets/js/inputChecker';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    catalogState: ICatalogState
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        catalog: typeof allActions.catalog
    }
}

interface IProps extends IPropsState, IPropsActions {}



const ProductCreator: FC<IProps> = ({lang, fibersState, setState, catalogState}): JSX.Element => {
    const navigate = useNavigate()
    const paramProductId = useParams().productId || ''
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const fiberPickerRef = useRef<IPickerFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const modsRef = useRef<IFeaturerFunctions>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const selectorRef = useRef<ISelectorFunctions>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const [product, setProduct] = useState<ISendProduct>({...productEmpty})
    const [submit, setSubmit] = useState<boolean>(false)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const _mods = useRef<HTMLDivElement>(null)
    const focuserDescr = useMemo(() => focusMover(), [lang])
    const focuserMods = useMemo(() => focusMover(), [lang])
    const _form = useRef<HTMLFormElement>(null)
    const _price = useRef<HTMLInputElement>(null)

    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        if (modalRef.current?.getOwner() === 'sender') {
            if (catalogState.category.sendProduct.status === 'success') {
                setProduct({...productEmpty})
                setState.catalog.loadCatalog()
                errChecker.clear() 
            }
            setState.catalog.setSendProduct(resetFetch)// clear fetch status
        }
        if (modalRef.current?.getOwner() === 'errorChecker') {
            errChecker.clear() 
        }
	}, [catalogState.category.sendProduct.status, errChecker])

    

    
    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'idle' || catalogState.category.sendProduct.status === 'fetching')  return
        messageRef.current?.update(modalMessageCreator(catalogState.category.sendProduct, lang))
        modalRef.current?.openModal('sender')
    }, [catalogState.category.sendProduct.status])




    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => { 
        prevent(e)
        if (!_descr.current || !_mods.current || !fiberPickerRef.current) return
        //check DESCRIPTION
        focuserDescr.focusAll(); //run over all elements to get all errors
        const errorDescrFields = _descr.current.querySelectorAll('.incorrect-value')
        if (errorDescrFields && errorDescrFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in description are filled incorrectly' : 'Некоторые поля в описании заполнены неправильно')
        } 
        //check Mods
        focuserMods.focusAll(); //run over all elements to get all errors
        const errorProsFields = _mods.current.querySelectorAll('.incorrect-value')
        if (errorProsFields && errorProsFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in mods are filled incorrectly' : 'Некоторые поля в модификациях заполнены неправильно')
        }
        //check fibers  
        if (fiberPickerRef.current.getSelected().length === 0) { //at least 1 fiber must be selected
            errChecker.add(lang === 'en' ? 'No fiber selected' : 'Материал не выбран')
        } 
        //check images
        if (addFilesRef.current && addFilesRef.current.getFiles().length === 0) {//at least 1 image must be added
            errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }

        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal('errorChecker')
            return
        }      

        setProduct(prev => {
            return { 
                ...prev, 
                mods: (modsRef.current as IFeaturerFunctions).getFeatures().map(item => ({en: item.name.en, ru: item.name.ru})),
                files: addFilesRef.current?.getFiles() || [], 
                fibers: (fiberPickerRef.current as IPickerFunctions).getSelected()
            }
        })
        setSubmit(true)
    }


    useEffect(() => {
        if (!submit) return
        paramProductId ? setState.catalog.editProduct(product, changeImages) : setState.catalog.sendProduct(product)
        setSubmit(false)
    }, [submit])


    const onDeleteFiber = useCallback((_id: string) => {
        setState.fibers.deleteFiber(_id)
    }, [])


    const onEditFiber = useCallback((_id: string) => {
        navigate(`${navList.account.admin.fiber.to}/${_id}`)
    },[])


    useEffect(() => {
        fiberPickerRef.current?.setSelected(product.fibers)
    }, [product.fibers])


    useEffect(() => {
        modsRef.current?.setFeatures(product.mods.map((item, i) => ({_id: String(i), name: item})))
    }, [product.mods])


    useEffect(() => {
        if (product.files?.length === 0) {
            addFilesRef.current?.clearAttachedFiles()
        }
    }, [product.files])


    useEffect(() => {
        if (catalogState.catalog.load.status === 'success') {
            selectorRef.current?.setData(catalogState.catalog.list.map(item => ({value: item._id, name: item.name})))
        }
    }, [catalogState.catalog.list])


    
    useEffect(() => {
        if (paramProductId) {// edit old product
            if (catalogState.category.loadProduct.status === 'success') { //new product or edit old one
                setProduct({
                    ...catalogState.category.product,
                    files: [],
                })
                setChangeImages(false)
                selectorRef.current?.setValue(catalogState.category.product.category)
            } 
        }
        else {
            setProduct({...productEmpty})
            setChangeImages(true)
        }
    }, [catalogState.category.loadProduct.status])


    const onChangeImages = useCallback((e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }, [])


    useEffect(() => { 
        checkAndLoad({
            fetchData: catalogState.catalog.load,
            loadFunc: setState.catalog.loadCatalog,
        })
        if (fibersState.load.status !== 'success' || fibersState.load.status !== 'success') return //loadFibers in App
        paramProductId ? setState.catalog.loadProduct(paramProductId) : setProduct({...productEmpty})
    }, [catalogState.catalog.load.status, fibersState.load.status, paramProductId])


    const renderImages = useMemo(() => {
        return (
            changeImages ? 
                <>
                    <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                    <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
                    {paramProductId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                </>
            :
                <>{paramProductId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
        )
    }, [changeImages, lang, paramProductId, onChangeImages])


    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.id === "name_en" && setProduct({...product, name: {...product.name, en: e.target.value}})
        e.target.id === "name_ru" && setProduct({...product, name: {...product.name, ru: e.target.value}})
        e.target.id === "price" && checkIfNumbers(e.target.value) && setProduct({...product, price: Number(e.target.value)}) //save as string, but check it while submiting
        e.target.id === "text_en" && setProduct({...product, text: {...product.text, en: e.target.value}})
        e.target.id === "text_ru" && setProduct({...product, text: {...product.text, ru: e.target.value}})
        e.target.id === "text_short_en" && setProduct({...product, text_short: {...product.text_short, en: e.target.value}})
        e.target.id === "text_short_ru" && setProduct({...product, text_short: {...product.text_short, ru: e.target.value}})
        e.target.id === "selector_category" && setProduct({...product, category: e.target.value})
    }


    useEffect(() => {
        if (!_descr.current) return       
        focuserDescr.create({container: _descr.current, itemsSelector: '[data-selector="select"], [data-selector="input"]'})
        onChangeFeaturesAmount()
    }, [lang])


    const onChangeFeaturesAmount = useCallback(() => {  //select all inputs if new mod was added/ old one was removed  
        if (!_mods.current) return
        focuserMods.create({container: _mods.current})
        const allInputsPros = _mods.current.querySelectorAll('[data-selector="input"]')
        allInputsPros?.forEach(input => {
            (input as HTMLInputElement).onblur = (e) => inputChecker({lang, min: inputsProps.product.mods.min, max: inputsProps.product.mods.max, el: e.target as HTMLInputElement});
        })
    }, [])


    const onChangeFeature = useCallback((target: HTMLInputElement) => {       
        target.parentElement?.classList.remove('incorrect-value') 
    }, [])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                    <h1>{paramProductId ? lang === 'en' ? 'Edit product' : 'Редактирование товара' : lang === 'en' ? 'Add new product' : 'Добавление нового товара'}</h1>
                    <form ref={_form}>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'DESCRIPTION' : 'ОПИСАНИЕ'}</h2>           
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="descr__container" ref={_descr}>
                            <div className="input-block">
                                <label htmlFor="namer_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        type="text" 
                                        data-selector="input"
                                        id="name_en" 
                                        onKeyDown={(e) => focuserDescr.next(e)} 
                                        onChange={onChangeInputs} 
                                        value={product.name.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.name.min, max:inputsProps.product.name.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        type="text" 
                                        data-selector="input"
                                        id="name_ru" 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.name.ru} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.name.min, max:inputsProps.product.name.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="price">{lang === 'en' ? 'Price' : 'Цена'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        ref={_price}
                                        type="text" 
                                        data-selector="input"
                                        id="price" 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.price} 
                                        onBlur={(e) => inputChecker({lang, type: 'numbers', el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_en" 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.text.en} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textFull.min, max:inputsProps.product.textFull.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_ru"
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.text.ru} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textFull.min, max:inputsProps.product.textFull.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_short_en"
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.text_short.en} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textShort.min, max:inputsProps.product.textShort.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_short_ru" 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        onChange={onChangeInputs} 
                                        value={product.text_short.ru} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textShort.min, max:inputsProps.product.textShort.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Category' : 'Категория'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                <Selector 
                                    lang={lang} 
                                    id='selector_category' 
                                    onBlur={(e) => inputChecker({lang, notExact: '', el: e.target})}
                                    defaultData={{value: '', name: {en: 'Select', ru: 'Выберете'}}}
                                    saveValue={onChangeInputs}
                                    ref={selectorRef}/>
                                </div>
                            </div>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'MODIFICATIONS' : 'МОДИФИКАЦИИ'}</h2>           
                        <div className="mods" ref={_mods}>
                            <Featurer 
                                lang={lang} 
                                ref={modsRef}
                                amountChanged={onChangeFeaturesAmount}
                                valueChanged={onChangeFeature}
                                onEnter={focuserMods.next}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT FIBERS' : 'ВЫБЕРЕТЕ МАТЕРИАЛЫ'}</h2>           
                        <div className="fibers-picker">
                            {fibersState.load.status === 'success' ? 
                                <Picker ref={fiberPickerRef} items={fibersState.fibersList} lang={lang} onEditClick={onEditFiber} onDeleteClick={onDeleteFiber}/>
                            :
                                <Preloader />}
                        </div>

                        {renderImages}
                        
                        <button className='button_blue post' disabled={catalogState.category.sendProduct.status === 'fetching'} onClick={onSubmit}>
                            {catalogState.category.sendProduct.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramProductId ? 'Save product' : 'Post product' : paramProductId ? "Сохранить товар" : "Отправить товар"}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modalRef} onClose={closeModal} >
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={messageRef}/>
                </Modal>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    fibersState: state.fibers,
    catalogState: state.catalog,

})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})

    
export default connect(mapStateToProps, mapDispatchToProps)(ProductCreator)