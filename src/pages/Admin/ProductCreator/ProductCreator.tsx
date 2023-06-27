import { ICatalogState, IColorsState, IFibersState, IFullState, IProduct, IProsCons, TLang, TLangText } from 'src/interfaces';
import './product-creator.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import Preloader from 'src/components/Preloaders/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import Picker, { IPickerFunctions } from 'src/components/Picker/Picker';
import Featurer from 'src/components/Featurer/Featurer';
import Selector from 'src/components/tiny/Selector/Selector';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    colorsState: IColorsState
    catalogState: ICatalogState
    product: IProduct
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
        catalog: typeof allActions.catalog
    }
}


interface IProps extends IPropsState, IPropsActions {}


const ProductCreator: FC<IProps> = ({lang, fibersState, setState, catalogState, colorsState, product}): JSX.Element => {
    
    const navigate = useNavigate()
    const paramProductId = useParams().productId || ''
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const modal_missedId = useRef<IModalFunctions>(null)
    const message_missedId = useRef<IMessageFunctions>(null)
    const fiberPicker = useRef<IPickerFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const _price_en = useRef<HTMLInputElement>(null)
    const _price_ru = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])



    const closeModal = useCallback(() => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear() 
        if (modal.current?.getOwner() === 'fiber') {
            if (fibersState.send.status === 'success') {
                setState.fibers.loadFibers()
                navigate('/fibers', { replace: true })
                window.location.reload()
            }
            setState.fibers.setSendFibers(resetFetch)// clear fetch status
        }
	}, [fibersState.send.status, errChecker])

    
    const closeModalAndReturn = useCallback(() => {
        modal_missedId.current?.closeModal()
        setTimeout(() => message_missedId.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        navigate('/catalog', { replace: true })
        window.location.reload()
    },[errChecker])


    
    useEffect(() => {
        if (fibersState.send.status === 'idle' || fibersState.send.status === 'fetching')  return
        const errors: string[] = fibersState.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[fibersState.send.status][lang],
            status: fibersState.send.status,
            text: [fibersState.send.message[lang], ...errors]
        })
        modal.current?.openModal('fiber')
    }, [fibersState.send.status])




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!_name_en.current || !_name_ru.current || !_price_en.current || !_price_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_descr.current || !fiberPicker.current) return
           
        //check DESCRIPTION
        errChecker.check(_name_en.current, 1, 30)
        errChecker.check(_name_ru.current, 1, 30)
        errChecker.check(_price_en.current, 1, 10)
        errChecker.check(_price_ru.current, 1, 10)
        errChecker.check(_text_short_en.current, 10, 100)
        errChecker.check(_text_short_ru.current, 10, 100)
        errChecker.check(_text_en.current, 100, 8000)
        errChecker.check(_text_ru.current, 100, 8000)


        if (addFiles.current){
            if (addFiles.current.getFiles().length === 0) {//at least 1 image must be added
                errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
            } else {
                setState.catalog.setProduct({...product, files: addFiles.current.getFiles()})
            }
        }

       
        if (fiberPicker.current.getSelected().length === 0) { //at least 1 fiber must be selected
            errChecker.add(lang === 'en' ? 'No fiber selected' : 'Материал не выбран')
        } else {
            setState.catalog.setProduct({...product, fibers: fiberPicker.current.getSelected()})
        }

        
        /*const features = {} as IProsCons
        features.pros = Array.from(_mods.current?.querySelectorAll('input') || []) //convert array like [en1, ru1, en2, ru2] -> [{en: en1, ru: ru1}, {en: en2, ru: ru2}]
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])
        if (features.pros.some(item => !item.en || !item.ru)) {//proscons error check
            errChecker.add(lang === 'en' ? 'Empty pro exists' : 'Есть незаполненный плюс')
        }*/


        
       
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal('submit')
            return
        }


        //create new fiberToStore
        /*const newFiber: ISendFiber = {
            _id: paramProductId,
            name: {en: _name_en.current.value.trim(), ru: _name_ru.current.value.trim()},
            text: {en: _text_en.current.value.trim(), ru: _text_ru.current.value.trim()},
            short: {
                //name: {en: _name_short_en.current.value.trim(), ru: _name_short_ru.current.value.trim()},
                text: {en: _text_short_en.current.value.trim(), ru: _text_short_ru.current.value.trim()}
            },
            colors: Object.entries(selectedFibers).filter(item => item[1]).map(item => item[0]),
            files: addFiles.current?.getFiles() || [],
            proscons
        }

        // to backend 
        if (paramProductId) {
            setState.fibers.editFiber(newFiber, changeImages)
        } else {
            setState.fibers.sendFiber(newFiber)
        } */
    }



    const onDeleteFiber = (_id: string) => {
        setState.fibers.deleteFiber(_id)
    }

    const onEditFiber = (_id: string) => {
        navigate(`/admin/fiber-create/${_id}`)
    }




    const fillValues = (_id : string) => {      
       /* const sourceFiber = fibersState.fibersList.find(item => item._id === _id)
        if (!sourceFiber) {
            message_missedId.current?.update({header: lang === 'en' ? 'Error' : 'Ошибка', status: 'error', text: lang === 'en' ? ['Editing fiber was not found, switching to creating new fiber'] : ['Материал для редактирования не найден, переход к созданию нового материала']})
            modal_missedId.current?.openModal('filling')
            return
        }

        


        //proscons
        _mods.current.innerHTML = '' //clear to avoid duplicate while rerendering
        sourceFiber.proscons.pros.forEach(item => { //first stage - add all inputs
            if (_addMod.current) {
                _addMod.current.click()
            }
        })

        const prosInputs = _mods.current.querySelectorAll('input') //second stage - fill all inputs 
        sourceFiber.proscons.pros.forEach((item, i) => {
            prosInputs[i * 2].value = item.en
            prosInputs[i * 2 + 1].value = item.ru
        })

        //colors 
        fiberPicker.current?.setSelected(sourceFiber.colors)*/
    }






    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }



    useEffect(() => { //if edit
        if (!paramProductId || fibersState.load.status !== 'success') {
            return setChangeImages(true)
        }
        fillValues(paramProductId)
        setChangeImages(false)
    }, [fibersState.load.status, paramProductId])



    useEffect(() => {
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }
        if (catalogState.catalog.load.status !== 'success' && catalogState.catalog.load.status !== 'fetching') {
            setState.catalog.loadCatalog()
        }
    }, [])

    


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
    }, [changeImages, lang, paramProductId])



    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.id === "name_en" && 
            setState.catalog.setProduct({...product, name: {...product.name, en: e.target.value}}) &&
            errChecker.clearError(_name_en.current as HTMLInputElement)
        e.target.id === "name_ru" && 
            setState.catalog.setProduct({...product, name: {...product.name, ru: e.target.value}}) &&
            errChecker.clearError(_name_ru.current as HTMLInputElement)        
        e.target.id === "price_en" && 
            setState.catalog.setProduct({...product, price: {...product.price, en: e.target.value}}) &&
            errChecker.clearError(_price_en.current as HTMLInputElement)     
        e.target.id === "price_ru" && 
            setState.catalog.setProduct({...product, price: {...product.price, ru: e.target.value}}) &&
            errChecker.clearError(_price_ru.current as HTMLInputElement)     
        e.target.id === "text_en" && 
            setState.catalog.setProduct({...product, text: {...product.text, en: e.target.value}}) &&
            errChecker.clearError(_text_en.current as HTMLTextAreaElement)     
        e.target.id === "text_ru" && 
            setState.catalog.setProduct({...product, text: {...product.text, ru: e.target.value}}) &&
            errChecker.clearError(_text_ru.current as HTMLTextAreaElement)  
        e.target.id === "text_short_en" && 
            setState.catalog.setProduct({...product, text_short: {...product.text_short, en: e.target.value}}) &&
            errChecker.clearError(_text_short_en.current as HTMLTextAreaElement)     
        e.target.id === "text_short_ru" && 
            setState.catalog.setProduct({...product, text_short: {...product.text_short, ru: e.target.value}}) &&
            errChecker.clearError(_text_short_ru.current as HTMLTextAreaElement) 
    }


    return (
        <div className="page page_product-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Add new fiber' : 'Добавление нового материала'}</h1>
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
                                    <input type="text" id="name_en" ref={_name_en}  data-ru="Название EN" data-en="Name EN"onChange={onChangeInputs} value={product.name.en}/>
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU" onChange={onChangeInputs} value={product.name.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="price_en">{lang === 'en' ? 'Price' : 'Цена'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="price_en" ref={_price_en} data-ru="Прайс EN" data-en="Price EN" onChange={onChangeInputs} value={product.price.en} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="price_ru" ref={_price_ru}  data-ru="Прайс RU" data-en="Price RU"onChange={onChangeInputs} value={product.price.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text_en" ref={_text_en} data-ru="Текст EN" data-en="Text EN"  onChange={onChangeInputs} value={product.text.en} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_ru" ref={_text_ru} data-ru="Текст RU" data-en="Text RU"  onChange={onChangeInputs} value={product.text.ru} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text_short_en" ref={_text_short_en} data-ru="Текст кратко EN" data-en="Text short EN"onChange={onChangeInputs} value={product.text_short.en} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_short_ru" ref={_text_short_ru} data-ru="Текст кратко RU" data-en="Text short RU" onChange={onChangeInputs} value={product.text_short.ru} />
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
                                    saveValue={({id, e}:{e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, id: string}) => errChecker.clearError(e.target)}
                                    data={catalogState.catalog.list.map(item => ({value: item._id, name: item.name}))}
                                    dataset={{en: 'Category selector', ru: 'Выбор категории'}}
                                    />
                                </div>
                            </div>
                        </div>


                        <h2 className='section-header full-width'>{lang === 'en' ? 'MODIFICATIONS' : 'МОДИФИКАЦИИ'}</h2>           
                        <div className="mods">
                            <Featurer lang={lang} />
                        </div>





                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT FIBERS' : 'ВЫБЕРЕТЕ МАТЕРИАЛЫ'}</h2>           
                        <div className="fibers-picker">
                            {fibersState.load.status === 'success' ? 
                                <Picker ref={fiberPicker}  items={fibersState.fibersList} lang={lang} onEditClick={(_id) => onEditFiber(_id)} onDeleteClick={(_id) => onDeleteFiber(_id)}/>
                            :
                                <Preloader />}
                        </div>

                        {renderImages}

                        <button className='button_blue post' disabled={fibersState.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {fibersState.send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramProductId ? 'Save fiber' : 'Post fiber' : paramProductId ? "Сохранить материал" : "Отправить материал"}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modal} onClose={closeModal}>
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
    colorsState : state.colors,
    catalogState: state.catalog,
    product: state.catalog.category.product
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ProductCreator)