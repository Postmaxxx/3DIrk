import { ICatalogState, IFibersState, IFullState, ISendProduct, TLang } from '../../../interfaces';
import './product-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import Preloader from '../../../components/Preloaders/Preloader';
import { defaultSelectItem, inputsProps, productEmpty, resetFetch, statuses } from '../../../assets/js/consts';
import { checkAndLoad, checkIfNumbers, deepCopy, errorsChecker, filesDownloader, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import Selector, { ISelectorFunctions } from '../../../components/Selector/Selector';
import inputChecker from '../../../../src/assets/js/inputChecker';
import { IModalFunctions } from '../../../../src/components/Modal/ModalNew';
import MessageNew from '../../../../src/components/Message/MessageNew';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    catalogState: ICatalogState
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        catalog: typeof allActions.catalog
    }
}

interface IProps extends IPropsState, IPropsActions {}



const ProductCreator: FC<IProps> = ({lang, fibersState, setState, modal, catalogState}): JSX.Element => {
    const fiberPickerRef = useRef<IPickerFunctions>(null)
    const productPickerRef = useRef<IPickerFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const modsRef = useRef<IFeaturerFunctions>(null)
    const selectorCategoryRef = useRef<HTMLSelectElement>(null)
    const selectorStatusRef = useRef<ISelectorFunctions>(null)
    const [product, setProduct] = useState<ISendProduct>({...productEmpty})
    const [submit, setSubmit] = useState<boolean>(false)
    const focuser = useMemo(() => focusMover(), [lang])
    const _form = useRef<HTMLFormElement>(null)
    const _mods = useRef<HTMLDivElement>(null)
    
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const statusesList = useMemo(() => (Object.values(statuses)), []) 


    const closeModal = useCallback(() => {
        if (modal?.getName()  === 'sendProduct') {
            if (catalogState.category.sendProduct.status === 'success') {
                checkAndLoad({ //force update category
                    fetchData: catalogState.category.loadCategory,
                    loadFunc: setState.catalog.loadCategory,
                    args: [{ _id: catalogState.category._id }],
                    force: true
                })
            }
            setState.catalog.setSendProduct(resetFetch)// clear fetch status
        }
        errChecker.clear() 
        modal?.closeCurrent()
	}, [catalogState.category.sendProduct.status, errChecker])

    

    
    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'idle' || catalogState.category.sendProduct.status === 'fetching')  return
        modal?.openModal({
            name: 'sendProduct',
            onClose: closeModal,
            children: <MessageNew {...modalMessageCreator(catalogState.category.sendProduct, lang)} buttonClose={{action: closeModal, text: 'Close'}}/>
        })
    }, [catalogState.category.sendProduct.status])




    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => { 
        prevent(e)
        if (!_mods.current || !fiberPickerRef.current || !_form.current) return
        //check form
        focuser.focusAll(); //run over all elements to get all errors
        const errorDescrFields = _form.current.querySelectorAll('.incorrect-value')
        if (errorDescrFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        } 
        //check fibers  
        if (fiberPickerRef.current.getSelected().length === 0) { //at least 1 fiber must be selected
            errChecker.add(lang === 'en' ? 'No fiber selected' : 'Материал не выбран')
        } 
        //check images
        if (addFilesRef.current && addFilesRef.current.getFiles().length === 0) {//at least 1 image must be added
            errChecker.add(lang === 'en' ? 'Images missing' : 'Картинки отсутствуют')
        }

        if (errChecker.amount() > 0) {
            modal?.openModal({
                name: 'errorChecker',
                onClose: closeModal,
                children: <MessageNew {...errChecker.result()} buttonClose={{action: closeModal, text: 'Close'}}/>
            })
            return
        }      

        setProduct(prev => {
            return { 
                ...prev, 
                mods: (modsRef.current as IFeaturerFunctions).getFeatures().map(item => ({en: item.name.en, ru: item.name.ru})),
                files: addFilesRef.current?.getFiles() || [], 
                fibers: (fiberPickerRef.current as IPickerFunctions).getSelected(),
                active: selectorStatusRef.current?.getValue() === 'active' ? true : false,
                category: selectorCategoryRef.current?.value || 'already checked that not empty'
            }
        })
        setSubmit(true)
    }


    useEffect(() => {
        if (!submit) return
        setState.catalog.sendProduct(product)
        setSubmit(false)
    }, [submit])




    useEffect(() => {
        modsRef.current?.setFeatures(product.mods.map((item, i) => ({_id: String(i), name: item})))
    }, [product.mods])




    useEffect(() => { 
        checkAndLoad({
            fetchData: catalogState.catalog.load,
            loadFunc: setState.catalog.loadCatalog,
        })
        productPickerRef.current?.setSelected()
    }, [])



    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.id === "name_en" && setProduct({...product, name: {...product.name, en: e.target.value}})
        e.target.id === "name_ru" && setProduct({...product, name: {...product.name, ru: e.target.value}})
        e.target.id === "price" && checkIfNumbers(e.target.value) && setProduct({...product, price: Number(e.target.value)}) //save as string, but check it while submiting
        e.target.id === "text_en" && setProduct({...product, text: {...product.text, en: e.target.value}})
        e.target.id === "text_ru" && setProduct({...product, text: {...product.text, ru: e.target.value}})
        e.target.id === "text_short_en" && setProduct({...product, text_short: {...product.text_short, en: e.target.value}})
        e.target.id === "text_short_ru" && setProduct({...product, text_short: {...product.text_short, ru: e.target.value}})
    }


    const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProduct({...product, category: e.target.value})
        checkAndLoad({
            fetchData: catalogState.category.loadCategory,
            loadFunc: setState.catalog.loadCategory,
            args: [{ _id: e.target.value}],
            force: true
        })         
        productPickerRef.current?.getSelected()[0] && productPickerRef.current?.setSelected() //change values only if product was selected, not if product "new"
    }


    useEffect(() => {
        if (!_form.current) return       
        focuser.create({container: _form.current, itemsSelector: '[data-selector="select"], [data-selector="input"]'})
        onChangeFeaturesAmount()
    }, [lang])


    const onChangeFeaturesAmount = useCallback(() => {  //select all inputs if new mod was added/ old one was removed  
        if (!_mods.current || !_form.current) return
        focuser.create({container: _form.current, itemsSelector: '[data-selector="select"], [data-selector="input"]'})
        const allInputsPros = _mods.current.querySelectorAll('[data-selector="input"]')
        allInputsPros?.forEach(input => {
            (input as HTMLInputElement).onblur = (e) => inputChecker({lang, min: inputsProps.product.mods.min, max: inputsProps.product.mods.max, el: e.target as HTMLInputElement});
        })
    }, [])


    const onChangeFeature = useCallback((target: HTMLInputElement) => {       
        target.parentElement?.classList.remove('incorrect-value') 
    }, [])



    const onProductSelected = (_id: string) => {
        if (_id) {
            checkAndLoad({
                fetchData: catalogState.category.loadProduct,
                loadFunc: setState.catalog.loadProduct,
                args: [_id],
                force: true
            })
        } else {
            setProduct(deepCopy(productEmpty))
            addFilesRef.current?.replaceFiles([])
            fiberPickerRef.current?.setSelected([])
            selectorStatusRef.current?.setValue(statuses.active.value)
        }
    }


    const fillData = async () => {
        const files = await filesDownloader(
            catalogState.category.product.images.files.map(file => (`${catalogState.category.product.images.paths.full}/${file}`))
        )
        addFilesRef.current?.replaceFiles(files)
        fiberPickerRef.current?.setSelected(catalogState.category.product.fibers)
        setProduct({...catalogState.category.product, files})
        selectorStatusRef.current?.setValue(catalogState.category.product.active ? statuses.active.value : statuses.suspended.value)
    }


    useEffect(() => {
        if (selectorCategoryRef.current?.value) {
            fillData()
        }
    }, [catalogState.category.product])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Edit products' : 'Редактирование товаров  '}</h1>
                    <form ref={_form}>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT PRODUCT TO EDIT' : 'ВЫБЕРИТЕ ТОВАР ДЛЯ РЕДАКТИРОВАНИЯ'}</h2>           
                        <div className="input-block">
                            <label htmlFor="text-short_en">{lang === 'en' ? 'Category' : 'Категория'}:</label>
                            <div className="selector" data-selector="input-block">
                                <select 
                                    data-selector="select"
                                    ref={selectorCategoryRef} 
                                    id="selector_category"
                                    defaultValue=''
                                    onChange={onChangeCategory} 
                                    onBlur={(e) => inputChecker({lang, notExact: '', el: e.target})}>
                                        <option key={-1} value='' disabled hidden>{lang === 'en' ? 'Select' : 'Выберете'}</option>
                                        {catalogState.catalog.list.map((el) => <option key={el._id} value={el._id}>{el.name[lang]}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="fiber-picker">
                            <Picker 
                                ref={productPickerRef} 
                                items={selectorCategoryRef.current?.value ? catalogState.category.products : []} 
                                lang={lang} 
                                multiple={false}
                                withNew={true}
                                onItemClick={onProductSelected}
                                minSelected={1}
                                simulateClickOnSelect={true}
                                markInactive={true}/>
                        </div>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'DESCRIPTION' : 'ОПИСАНИЕ'}</h2>           
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="descr__container">
                            <div className="input-block">
                                <label htmlFor="namer_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        type="text" 
                                        data-selector="input"
                                        id="name_en" 
                                        onKeyDown={focuser.next} 
                                        onChange={onChangeInputs} 
                                        value={product.name.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.name.min, max:inputsProps.product.name.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        type="text" 
                                        data-selector="input"
                                        id="name_ru" 
                                        onKeyDown={focuser.next}
                                        onChange={onChangeInputs} 
                                        value={product.name.ru} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.name.min, max:inputsProps.product.name.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="price">{lang === 'en' ? 'Price' : 'Цена'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        type="text" 
                                        data-selector="input"
                                        id="price" 
                                        onKeyDown={focuser.next}
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
                                        onChange={onChangeInputs} 
                                        value={product.text.en} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textFull.min, max:inputsProps.product.textFull.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_ru"
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
                                        onChange={onChangeInputs} 
                                        value={product.text_short.en} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textShort.min, max:inputsProps.product.textShort.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_short_ru" 
                                        onChange={onChangeInputs} 
                                        value={product.text_short.ru} 
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.product.textShort.min, max:inputsProps.product.textShort.max, el: e.target})}/>
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
                                onEnter={focuser.next}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT FIBERS' : 'ВЫБЕРЕТЕ МАТЕРИАЛЫ'}</h2>           
                        <div className="fibers-picker">
                            {fibersState.load.status === 'success' ? 
                                <Picker 
                                    ref={fiberPickerRef} 
                                    items={fibersState.fibersList} 
                                    lang={lang}
                                    minSelected={1}
                                    markInactive={true}/>
                            :
                                <Preloader />}
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>

                        <Selector 
                            lang={lang} 
                            id='selector_status' 
                            label={{en: 'Product status: ', ru: 'Состояние продукта: '}}
                            data={statusesList}
                            onBlur={(e) => inputChecker({lang, notExact: '', el: e.target})}
                            defaultData={{...defaultSelectItem}}
                            saveValue={onChangeInputs}
                            ref={selectorStatusRef}
                        />
                        
                        <button className='button_blue post' disabled={catalogState.category.sendProduct.status === 'fetching'} onClick={onSubmit}>
                            {catalogState.category.sendProduct.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? 'Save changes' : "Сохранить изменения"}</>
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    fibersState: state.fibers,
    catalogState: state.catalog,
    modal: state.base.modal.current
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})

    
export default connect(mapStateToProps, mapDispatchToProps)(ProductCreator)