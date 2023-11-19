import { ICatalogState, IFibersState, IFullState, ISendProduct, TLang } from '../../../interfaces';
import './product-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import Preloader from '../../../components/Preloaders/Preloader';
import { defaultSelectItem, inputsProps, resetFetch, statuses } from '../../../assets/js/consts';
import { filesDownloader, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import BlockSelector, { ISelectorFunctions } from '../../../components/BlockSelector/BlockSelector';
import { IModalFunctions } from '../../../components/Modal/Modal';
import Message from '../../../components/Message/Message';
import Uploader from '../../../../src/components/Preloaders/Uploader';
import BlockInput, { IBlockInputFunctions } from '../../../components/BlockInput/BlockInput';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import uniqid from 'uniqid';

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
    const _features = useRef<IFeaturerFunctions>(null)
    const _category = useRef<ISelectorFunctions>(null)

    const _nameEn = useRef<IBlockInputFunctions>(null)
    const _nameRu = useRef<IBlockInputFunctions>(null)
    const _descrEn = useRef<IBlockInputFunctions>(null)
    const _descrRu = useRef<IBlockInputFunctions>(null)
    const _descrShortEn = useRef<IBlockInputFunctions>(null)
    const _descrShortRu = useRef<IBlockInputFunctions>(null)
    const _newCategory = useRef<ISelectorFunctions>(null)
    const _status = useRef<ISelectorFunctions>(null)
    
    const statusesList = useMemo(() => (Object.values(statuses)), []) 


    const closeModal = useCallback(async () => {
        if (await modal?.getName()  === 'productSend') {
            if (catalogState.category.sendProduct.status === 'success') {
                setState.catalog.loadCategory({ _id: catalogState.category._id })
                fillValues(false)
            }
            setState.catalog.setSendProduct(resetFetch)// clear fetch status
        }
        modal?.closeCurrent()
	}, [catalogState.category.sendProduct.status])

    

    
    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'success' || catalogState.category.sendProduct.status === 'error') {
            modal?.closeName('productSending');
            modal?.openModal({
                name: 'productSend',
                onClose: closeModal,
                children: <Message {...modalMessageCreator(catalogState.category.sendProduct, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (catalogState.category.sendProduct.status === 'fetching') {
            modal?.openModal({
                name: 'productSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending product, please wait..." : "Отправка товара, пожалуйста ждите..."}/>
            })
        }
    }, [catalogState.category.sendProduct.status])




    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => { 
        prevent(e)
        if (!fiberPickerRef.current) return

        //check errors
        const errors: string[] = [_nameEn, _nameRu, _descrEn, _descrRu, _descrShortEn, _descrShortRu]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]

        //check newCategory
        const newCategory = _newCategory.current?.getErrorText(lang)
        newCategory && errors.push(newCategory)

        //check status
        const errStatus = _status.current?.getErrorText(lang)
        errStatus && errors.push(errStatus)

        //check features
        if (_features.current?.getLength() === 0) {
            errors.push(lang === 'en' ? 'Modifications not specified' : 'Модификации не указаны')
        } 
        if (_features.current?.getErrors().length) {
            errors.push(lang === 'en' ? 'Errors in modifications:' : 'Ошибки в модификациях:')
            _features.current?.getErrors().forEach(err => {
                errors.push(err[lang])
            })
        }

        //check fibers  
        if (fiberPickerRef.current.getSelected().length === 0) { //at least 1 fiber must be selected
            errors.push(lang === 'en' ? 'No fiber selected' : 'Материал не выбран')
        } 
        //check images
        if (addFilesRef.current && addFilesRef.current.getFiles().length === 0) {//at least 1 image must be added
            errors.push(lang === 'en' ? 'Images missing' : 'Картинки отсутствуют')
        }
        

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

        const productId: string = productPickerRef.current?.getSelected()[0] || ''
        const product: ISendProduct = {
            _id: productId,
            name: { en: _nameEn.current?.getValue() || 'Error', ru: _nameRu.current?.getValue() || 'Error' },
            text: { en: _descrEn.current?.getValue() || 'Error', ru: _descrRu.current?.getValue() || 'Error' },
            textShort: {en: _descrShortEn.current?.getValue() || 'Error', ru: _descrShortRu.current?.getValue() || 'Error' },
            files: addFilesRef.current?.getFiles() || [],
            category: _newCategory.current?.getValue() || '',
            active: _status.current?.getValue() === 'active' ? true : false,
            mods: _features.current?.getFeatures().map(feature => ({
                _id: feature._id || uniqid(),
                name: feature.name,
                price: +(feature.value || '0')
            })) || [],
            fibers: fiberPickerRef.current.getSelected()
        }
        setState.catalog.sendProduct(product)
    }






    useEffect(() => { 
        if (catalogState.catalog.load.status !== 'success' && catalogState.catalog.load.status  !== 'fetching') {
			setState.catalog.loadCatalog()
		}
        productPickerRef.current?.setSelected()
    }, [])




    const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setState.catalog.loadCategory({ _id: e.target.value})     
        productPickerRef.current?.getSelected()[0] && productPickerRef.current?.setSelected() //change values only if product was selected, not if product "new"
        _newCategory.current?.setValue(e.target.value)
        _newCategory.current?.setChanged(true)
    }




    const onProductSelected = (_id: string): void => {
        if (_id) {
            setState.catalog.loadProduct(_id)
        } else {
            fillValues(false)
        }
    }


    const fillValues = async (fillWithProduct: boolean): Promise<void> => {
        if (fillWithProduct) {
            console.log('id: ', catalogState.category.product._id);
            _nameEn.current?.setValue(catalogState.category.product.name.en)
            _nameRu.current?.setValue(catalogState.category.product.name.ru)
            _descrEn.current?.setValue(catalogState.category.product.text.en)
            _descrRu.current?.setValue(catalogState.category.product.text.ru)
            _descrShortEn.current?.setValue(catalogState.category.product.textShort.en)
            _descrShortRu.current?.setValue(catalogState.category.product.textShort.ru)
            _status.current?.setItem({...defaultSelectItem})
            _status.current?.setValue(catalogState.category.product.active ? 'active' : 'suspended')  
            _status.current?.setChanged(true)  
            _features.current?.setFeatures(catalogState.category.product.mods.map(mod => {
                return {name: mod.name, value: String(mod.price), _id: mod._id}
            }))
            
            fiberPickerRef.current?.setSelected(catalogState.category.product.fibers)
            const files = await filesDownloader(
                catalogState.category.product.images.files.map(file => (`${catalogState.category.product.images.basePath}/${catalogState.category.product.images.sizes[catalogState.category.product.images.sizes.length - 1].subFolder}/${file}`))
            )
            addFilesRef.current?.replaceFiles(files)
        } else {
            console.log('empty');
            _nameEn.current?.setValue('')
            _nameRu.current?.setValue('')
            _descrEn.current?.setValue('')
            _descrRu.current?.setValue('')
            _descrShortEn.current?.setValue('')
            _descrShortRu.current?.setValue('')
            _status.current?.setItem({...defaultSelectItem})
            _status.current?.setValue('')  
            _status.current?.setChanged(false)  
            _features.current?.setFeatures([])
            fiberPickerRef.current?.setSelected([])
            addFilesRef.current?.replaceFiles([])
        }
    }


    useEffect(() => {
        if (catalogState.category.loadProduct.status === 'success') {
            fillValues(true)
        }
    }, [catalogState.category.product._id, catalogState.category.loadProduct.status])


    useEffect(() => {
        _category.current?.setData(catalogState.catalog.list.map(el => ({name: el.name, value: el._id})))
        _newCategory.current?.setData(catalogState.catalog.list.map(el => ({name: el.name, value: el._id})))
    }, [catalogState.catalog.list])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Edit products' : 'Редактирование товаров  '}</h1>
                    <div className='form_full form_add-fiber'>
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Select product category' : 'Выберите категорию товара'}</h3>           
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockSelector 
                                lang={lang} 
                                id='selector_category'
                                labelText={{en: 'Category', ru: 'Категория'}}
                                ref={_category}
                                data={[]}
                                saveValue={onChangeCategory} 
                            />
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Select product' : 'Выберите товар'}</h3>           
                        </div>
                        <div className="picker_product">
                            <Picker 
                                type='products'
                                ref={productPickerRef} 
                                items={_category.current?.getValue() ? catalogState.category.products : []} 
                                lang={lang} 
                                multiple={false}
                                withNew={true}
                                onItemClick={onProductSelected}
                                minSelected={1}
                                simulateClickOnSelect={true}
                                markInactive={true}/>
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Product description' : 'Описание товара'}</h3>           
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name en', ru: 'Название en'}}
                                required
                                id="name_en"
                                rules={{min: inputsProps.product.name.min, max: inputsProps.product.name.max}}
                                ref={_nameEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name ru', ru: 'Название ru'}}
                                required
                                id="name_ru"
                                rules={{min: inputsProps.product.name.min, max: inputsProps.product.name.max}}
                                ref={_nameRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Description short en', ru: 'Описание кратко en'}}
                                required
                                typeElement='textarea'
                                id="text_short_en"
                                rules={{min: inputsProps.product.textShort.min, max: inputsProps.product.textShort.max}}
                                ref={_descrShortEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Description short ru', ru: 'Описание кратко ru'}}
                                required
                                typeElement='textarea'
                                id="text_short_ru"
                                rules={{min: inputsProps.product.textShort.min, max: inputsProps.product.textShort.max}}
                                ref={_descrShortRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Description en', ru: 'Описание en'}}
                                required
                                typeElement='textarea'
                                id="text_en"
                                rules={{min: inputsProps.product.textFull.min, max: inputsProps.product.textFull.max}}
                                ref={_descrEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Description ru', ru: 'Описание ru'}}
                                required
                                typeElement='textarea'
                                id="text_ru"
                                rules={{min: inputsProps.product.textFull.min, max: inputsProps.product.textFull.max}}
                                ref={_descrRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">

                            <BlockSelector 
                                lang={lang} 
                                id='selector_new_category'
                                labelText={{en: 'Change category to', ru: 'Изменить категорию на'}}
                                ref={_newCategory}
                                data={[]}
                            />

                            <BlockSelector 
                                lang={lang} 
                                id='selector_status'
                                labelText={{en: 'Product status', ru: 'Состояние товара'}}
                                ref={_status}
                                data={statusesList}
                            />
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Modifications' : 'Модификации'}</h3>           
                        </div>
                        <div className="product_mods">
                            <Featurer
                                lang={lang} 
                                ref={_features} 
                                type='input'
                                rules={{min: inputsProps.product.mods.min, max: inputsProps.product.mods.max}}
                                rulesValue={{valueMin: inputsProps.product.price.min, valueMax: inputsProps.product.price.max, type: 'numbers', notEmpty: true}}
                                withValue
                            />
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Select applicable fibers' : 'Выберите подходящие материалы'}</h3>           
                        </div>
                        <div className="picker_fibers">
                            {fibersState.load.status === 'success' ? 
                                <Picker 
                                    type='fibers'
                                    ref={fiberPickerRef} 
                                    items={fibersState.fibersList} 
                                    lang={lang}
                                    minSelected={1}
                                    markInactive={true}/>
                            :
                                <Preloader />}
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add images' : 'Выберите изображения'}</h3>           
                        </div>
                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>

                        
                        <button className='button_blue button_post' disabled={catalogState.category.sendProduct.status === 'fetching'} onClick={onSubmit}>
                            {lang === 'en' ? 'Save changes' : "Сохранить изменения"}
                        </button>
                    </div>
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