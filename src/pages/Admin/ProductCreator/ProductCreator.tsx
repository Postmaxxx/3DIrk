import { ICatalogState, IColorsState, IFibersState, IFullState, IProduct, IProsCons, ISendProduct, TLang, TLangText } from '../../../interfaces';
import './product-creator.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
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
import { empty, headerStatus, productEmpty, resetFetch, selector, timeModalClosing } from '../../../assets/js/consts';
import { checkAndLoad, errorsChecker, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import Selector, { ISelectorFunctions } from '../../../components/tiny/Selector/Selector';

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
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const modal_missedId = useRef<IModalFunctions>(null)
    const message_missedId = useRef<IMessageFunctions>(null)
    const fiberPicker = useRef<IPickerFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)
    const mods = useRef<IFeaturerFunctions>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const selector = useRef<ISelectorFunctions>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const [product, setProduct] = useState<ISendProduct>({...productEmpty})
    const [submit, setSubmit] = useState<boolean>(false)
    const [changeImages, setChangeImages] = useState<boolean>(true)


    const closeModal = useCallback(() => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear() 
        if (catalogState.category.sendProduct.status === 'success') {
            setProduct({...productEmpty})
            setState.catalog.loadCatalog()
        }
        setState.catalog.setSendProduct(resetFetch)// clear fetch status
	}, [catalogState.category.sendProduct.status, errChecker])

    
    const closeModalAndReturn = useCallback(() => {
        modal_missedId.current?.closeModal()
        setTimeout(() => message_missedId.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        navigate('/catalog', { replace: true })
        window.location.reload()
    },[errChecker])


    
    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'idle' || catalogState.category.sendProduct.status === 'fetching')  return
        const errors: string[] = catalogState.category.sendProduct.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[catalogState.category.sendProduct.status][lang],
            status: catalogState.category.sendProduct.status,
            text: [catalogState.category.sendProduct.message[lang], ...errors]
        })
        modal.current?.openModal('product')
    }, [catalogState.category.sendProduct.status])




    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {                     
        prevent(e)
        if (!_descr.current || !fiberPicker.current) return

        //check DESCRIPTION
        errChecker.check(_descr.current.querySelector('#name_en') as HTMLInputElement, 1, 30)
        errChecker.check(_descr.current.querySelector('#name_ru') as HTMLInputElement, 1, 30)
        errChecker.check(_descr.current.querySelector('#price_en') as HTMLInputElement, 1, 10)
        errChecker.check(_descr.current.querySelector('#price_ru') as HTMLInputElement, 1, 10)
        errChecker.check(_descr.current.querySelector('#text_en') as HTMLTextAreaElement, 1, 8000)
        errChecker.check(_descr.current.querySelector('#text_ru') as HTMLTextAreaElement, 1, 8000)
        errChecker.check(_descr.current.querySelector('#text_short_en') as HTMLTextAreaElement, 1, 100)
        errChecker.check(_descr.current.querySelector('#text_short_ru') as HTMLTextAreaElement, 1, 100)
        errChecker.check(_descr.current.querySelector('#selector_category') as HTMLSelectElement, 1, 100)


        if (addFiles.current){
            if (addFiles.current.getFiles().length === 0) {//at least 1 image must be added
                errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
            } else {
                setProduct(prev=> ({...prev, files: (addFiles.current as IAddFilesFunctions).getFiles()}))
            }
        }


       
        if (fiberPicker.current.getSelected().length === 0) { //at least 1 fiber must be selected
            errChecker.add(lang === 'en' ? 'No fiber selected' : 'Материал не выбран')
        } else {                      
            setProduct(prev => ({ ...prev, fibers: (fiberPicker.current as IPickerFunctions).getSelected()}))
        }

        setProduct(prev => {
            return { //mods
                ...prev, 
                mods: (mods.current as IFeaturerFunctions).getFeatures().map(item => ({en: item.name.en, ru: item.name.ru})),
            }
        })
        
       
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal('submit')
            return
        }
        setSubmit(true)
    }

    useEffect(() => {
        if (!submit) return
        if (paramProductId) {
            setState.catalog.editProduct(product)
        } else {
            setState.catalog.sendProduct(product)
        } 
        setSubmit(false)
    }, [submit])






    const onDeleteFiber = useCallback((_id: string) => {
        setState.fibers.deleteFiber(_id)
    }, [])

    const onEditFiber = useCallback((_id: string) => {
        navigate(`/admin/fiber-create/${_id}`)
    },[])




    const fillValues = () => {      
        setProduct({
            ...catalogState.category.product,
            files: [],
        })
        setChangeImages(false)
        selector.current?.setItem(catalogState.category.product.category)
        //selector.current?.setValue({value: 'dfd', name: {en: 'dsfsd', ru: 'sdf'}})
    }


    useEffect(() => {
        fiberPicker.current?.setSelected(product.fibers)
    }, [product.fibers])

    useEffect(() => {
        mods.current?.setFeatures(product.mods.map((item, i) => ({_id: String(i), name: item})))
    }, [product.mods])

    useEffect(() => {
        if (product.files.length === 0) {
            addFiles.current?.clearAttachedFiles()
        }
    }, [product.files])

    useEffect(() => {
        selector.current?.setData(catalogState.catalog.list.map(item => ({value: item._id, name: item.name})))
    }, [catalogState.catalog.list])


    
    useEffect(() => {
        if (catalogState.category.loadProduct.status === 'success' && paramProductId) {
            fillValues()
        }
    }, [catalogState.category.loadProduct.status])




    const onChangeImages = useCallback((e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }, [])




    useEffect(() => { 
        /*if (catalogState.catalog.load.status !== 'success' && catalogState.catalog.load.status !== 'fetching') {
            setState.catalog.loadCatalog()
            return
        }*/
        checkAndLoad(catalogState.catalog.load.status, setState.catalog.loadCatalog)


        if (fibersState.load.status !== 'success' || fibersState.load.status !== 'success') return //loadFibers in App
       
        paramProductId ? setState.catalog.loadProduct(paramProductId) : setProduct({...productEmpty})

    }, [catalogState.catalog.load.status, fibersState.load.status, paramProductId])


    


    const renderImages = useMemo(() => {
        return (
            changeImages ? 
                <>
                    <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                    <AddFiles lang={lang} ref={addFiles} multiple={true} id='allImages'/>
                    {paramProductId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                </>
            :
                <>{paramProductId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
        )
    }, [changeImages, lang, paramProductId, onChangeImages])



    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        errChecker.clearError(e.target) 
        e.target.id === "name_en" && setProduct({...product, name: {...product.name, en: e.target.value}})
        e.target.id === "name_ru" && setProduct({...product, name: {...product.name, ru: e.target.value}})
        e.target.id === "price_en" && setProduct({...product, price: {...product.price, en: e.target.value}})
        e.target.id === "price_ru" && setProduct({...product, price: {...product.price, ru: e.target.value}})
        e.target.id === "text_en" && setProduct({...product, text: {...product.text, en: e.target.value}})
        e.target.id === "text_ru" && setProduct({...product, text: {...product.text, ru: e.target.value}})
        e.target.id === "text_short_en" && setProduct({...product, text_short: {...product.text_short, en: e.target.value}})
        e.target.id === "text_short_ru" && setProduct({...product, text_short: {...product.text_short, ru: e.target.value}})
        e.target.id === "selector_category" && setProduct({...product, category: e.target.value})
    }


    return (
        <div className="page page_product-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Add new product' : 'Добавление нового товара'}</h1>
                    <form>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'DESCRIPTION' : 'ОПИСАНИЕ'}</h2>           
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="descr__container" ref={_descr}>
                            <div className="input-block">
                                <label htmlFor="namer_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="name_en"  data-ru="Название EN" data-en="Name EN" onChange={onChangeInputs} value={product.name.en}/>
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name_ru" data-ru="Название RU" data-en="Name RU" onChange={onChangeInputs} value={product.name.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="price_en">{lang === 'en' ? 'Price' : 'Цена'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="price_en" data-ru="Прайс EN" data-en="Price EN" onChange={onChangeInputs} value={product.price.en} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="price_ru" data-ru="Прайс RU" data-en="Price RU"onChange={onChangeInputs} value={product.price.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text_en" data-ru="Текст EN" data-en="Text EN"  onChange={onChangeInputs} value={product.text.en} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_ru"data-ru="Текст RU" data-en="Text RU"  onChange={onChangeInputs} value={product.text.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text_short_en"data-ru="Текст кратко EN" data-en="Text short EN"onChange={onChangeInputs} value={product.text_short.en} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_short_ru" data-ru="Текст кратко RU" data-en="Text short RU" onChange={onChangeInputs} value={product.text_short.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Category' : 'Категория'}:</label>
                                <div className="input__wrapper">
                                <Selector 
                                    lang={lang} 
                                    id='selector_category' 
                                    label={{en:'', ru: ''}}
                                    defaultData={{value: '', name: {en: 'Select', ru: 'Выберете'}}}
                                    saveValue={({id, e}:{e: React.ChangeEvent<HTMLSelectElement>, id: string}) => onChangeInputs(e)}
                                    dataset={{en: 'Category', ru: 'Категория'}}
                                    ref={selector}
                                    />
                                </div>
                            </div>
                        </div>


                        <h2 className='section-header full-width'>{lang === 'en' ? 'MODIFICATIONS' : 'МОДИФИКАЦИИ'}</h2>           
                        <div className="mods">
                            <Featurer lang={lang} ref={mods}/>
                        </div>


                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT FIBERS' : 'ВЫБЕРЕТЕ МАТЕРИАЛЫ'}</h2>           
                        <div className="fibers-picker">
                            {fibersState.load.status === 'success' ? 
                                <Picker ref={fiberPicker} items={fibersState.fibersList} lang={lang} onEditClick={(_id) => onEditFiber(_id)} onDeleteClick={(_id) => onDeleteFiber(_id)}/>
                            :
                                <Preloader />}
                        </div>

                        {renderImages}
                        
                        <button className='button_blue post' disabled={catalogState.category.sendProduct.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {catalogState.category.sendProduct.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramProductId ? 'Save product' : 'Post product' : paramProductId ? "Сохранить товар" : "Отправить тован"}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modal} onClose={closeModal} >
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
                </Modal>
                <Modal escExit={true} ref={modal_missedId} onClose={closeModalAndReturn}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalAndReturn} ref={message_missedId}/>
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