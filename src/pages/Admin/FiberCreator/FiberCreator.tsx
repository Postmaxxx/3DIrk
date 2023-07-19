import { IColorsState, IFiberParam, IFibersState, IFullState, ISendFiber, TLang } from '../../../interfaces';
import './fiber-creator.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import Selector from '../../../components/tiny/Selector/Selector';
import { fibersProperties } from '../../../assets/data/fibersProperties';
import Preloader from '../../../components/Preloaders/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { fiberEmpty, inputsProps, navList, resetFetch, selector, timeModalClosing } from '../../../assets/js/consts';
import { checkAndLoad, deepCopy, errorsChecker, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import inputChecker from '../../../../src/assets/js/inputChecker';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    colorsState: IColorsState
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}


interface IProps extends IPropsState, IPropsActions {}


const FiberCreator: FC<IProps> = ({lang, fibersState, setState, colorsState}): JSX.Element => {
    const navigate = useNavigate()
    const paramFiberId = useParams().fiberId || ''
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const colorPickerRef = useRef<IPickerFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const _spec = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const prosRef = useRef<IFeaturerFunctions>(null)
    const consRef = useRef<IFeaturerFunctions>(null)
    const [fiber, setFiber] = useState<ISendFiber>(deepCopy(fiberEmpty))
    const focuserDescr = useMemo(() => focusMover(), [lang])
    const focuserSpec = useMemo(() => focusMover(), [lang])
    const focuserPros = useMemo(() => focusMover(), [lang])
    const focuserCons = useMemo(() => focusMover(), [lang])

    const data10 = useMemo(() => selector["10"], [])
    const data5 = useMemo(() => selector["5"], [])
    const data3 = useMemo(() => selector["3"], [])
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const [submit, setSubmit] = useState<boolean>(false)
    const [changeImages, setChangeImages] = useState<boolean>(true)


    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear() 
        if (modalRef.current?.getOwner() === 'fiber') {
            setState.fibers.setSendFibers(resetFetch)// clear fetch status
            if (fibersState.send.status === 'success') {
                setState.fibers.loadFibers()
                navigate(navList.fibers.to, { replace: true })
                window.location.reload()
            }
        }
        if (modalRef.current?.getOwner() === 'color') {
            if (colorsState.send.status === 'success') {
                setState.colors.loadColors()
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
        if (modalRef.current?.getOwner() === 'missedId') {
            navigate(navList.fibers.to, { replace: true })
            window.location.reload()
        }
	}, [fibersState.send.status, colorsState.send.status, errChecker])


    
    useEffect(() => {
        if (fibersState.send.status === 'idle' || fibersState.send.status === 'fetching')  return
        messageRef.current?.update(modalMessageCreator(fibersState.send, lang))
        modalRef.current?.openModal('fiber')
    }, [fibersState.send.status])


    useEffect(() => { //for delete color
        if (colorsState.send.status === 'idle' || colorsState.send.status === 'fetching')  return
        messageRef.current?.update(modalMessageCreator(colorsState.send, lang))
        modalRef.current?.openModal('color')
    }, [colorsState.send.status])




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!prosRef.current|| !consRef.current || !_spec.current || !_descr.current || !_pros.current || !_cons.current 
            || !colorPickerRef.current) return
        //check DESCRIPTION
        focuserDescr.focusAll(); //run over all elements to get all errors
        const errorDescrFields = _descr.current.querySelectorAll('.incorrect-value')
        if (errorDescrFields && errorDescrFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in description are filled incorrectly' : 'Некоторые поля в описании заполнены неправильно')
        }  
        //check Specifications
        focuserSpec.focusAll(); //run over all elements to get all errors
        const errorSpecFields = _spec.current.querySelectorAll('.incorrect-value')
        if (errorSpecFields && errorSpecFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in specifications are filled incorrectly' : 'Некоторые поля в параметрах заполнены неправильно')
        }  
        const allSpec = {} as IFiberParam; //create {} with all specs
        _spec.current.querySelectorAll('input, select').forEach(item => {     
            allSpec[item.id] = (item as HTMLInputElement | HTMLSelectElement).value 
        })
        //check Pros
        focuserPros.focusAll(); //run over all elements to get all errors
        const errorProsFields = _pros.current.querySelectorAll('.incorrect-value')
        if (errorProsFields && errorProsFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in pros are filled incorrectly' : 'Некоторые поля в плюсах заполнены неправильно')
        }  
        //check Cons
        focuserCons.focusAll(); //run over all elements to get all errors
        const errorConsFields = _cons.current.querySelectorAll('.incorrect-value')
        if (errorConsFields && errorConsFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields in cons are filled incorrectly' : 'Некоторые поля в минусах заполнены неправильно')
        }  
        //check Images
        if (addFilesRef.current && addFilesRef.current.getFiles().length === 0 && changeImages) {//check images
            errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }
        //check Colors
        if (colorPickerRef.current.getSelected().length === 0) { //at least 1 color must be selected
            errChecker.add(lang === 'en' ? 'No colors selected' : 'Цвета не выбраны')
        }
        
        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal('submit')
            return
        }

        setFiber(prev => ({ 
                ...prev,
                _id: paramFiberId,
                params: allSpec,
                colors: (colorPickerRef.current as IPickerFunctions).getSelected(),
                files: addFilesRef.current?.getFiles() || [],
                proscons : {
                    pros: (prosRef.current as IFeaturerFunctions).getFeatures().map(item => ({en: item.name.en, ru: item.name.ru})),
                    cons: (consRef.current as IFeaturerFunctions).getFeatures().map(item => ({en: item.name.en, ru: item.name.ru}))
                }
            })
        )
        // to backend 
        setSubmit(true)     
    }

    useEffect(() => {
        if (!submit) return
        paramFiberId ? setState.fibers.editFiber(fiber) : setState.fibers.sendFiber(fiber)
        setSubmit(false)
    }, [submit])


    const onDeleteColor = useCallback((_id: string) => {
        setState.colors.deleteColor(_id)
    }, [])


    const onEditColor = useCallback((_id: string) => {
        navigate(`${navList.account.admin.color.to}/${_id}`)
    }, [])


    const fillValues = (sourceFiber : ISendFiber) => {      
        if (!_spec.current || !prosRef.current || !consRef.current) return
        setFiber(sourceFiber) //for descr part
        //specifications
        _spec.current.querySelectorAll('input, select').forEach(item => {
            (item as HTMLInputElement | HTMLSelectElement).value = String(sourceFiber.params[item.id] || '')
        })
        //proscons
        prosRef.current.setFeatures(sourceFiber.proscons.pros.map(item => ({name: item, _id: ''}))) //Ids doesn't matter for fiber, pros/cons are just arrays
        consRef.current.setFeatures(sourceFiber.proscons.cons.map(item => ({name: item, _id: ''}))) //Ids doesn't matter for fiber, pros/cons are just arrays
        //colors 
        colorPickerRef.current?.setSelected(sourceFiber.colors)
        //files
        addFilesRef.current?.clearAttachedFiles()
    }



    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }


    useEffect(() => { //if edit
        checkAndLoad(colorsState.load.status, setState.colors.loadColors)
        if (fibersState.load.status !== 'success' || colorsState.load.status !== 'success') return
        if (paramFiberId) {
            const sourceFiber = fibersState.fibersList.find(item => item._id === paramFiberId)
            if (!sourceFiber) {
                messageRef.current?.update({header: lang === 'en' ? 'Error' : 'Ошибка', status: 'error', text: lang === 'en' ? ['Editing fiber was not found, return to all fibers...'] : ['Материал для редактирования не найден, переход к списку материалов']})
                modalRef.current?.openModal('missedId')
                return
            }            
            setChangeImages(false)
            fillValues({...sourceFiber, files: []})
        } else {
            fillValues(deepCopy(fiberEmpty))
        }
    }, [fibersState.load.status, colorsState.load.status, paramFiberId])


    const onChangeInputs = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.id === "name_en" && setFiber(prev => ({...prev, name: {...prev.name, en: e.target.value}}))
        e.target.id === "name_ru" && setFiber(prev => ({...prev, name: {...prev.name, ru: e.target.value}}))
        e.target.id === "text_en" && setFiber(prev => ({...prev, text: {...prev.text, en: e.target.value}}))
        e.target.id === "text_ru" && setFiber(prev => ({...prev, text: {...prev.text, ru: e.target.value}}))
        e.target.id === "name-short_en" && setFiber(prev => ({...prev, short: {...prev.short, name: {...prev.short.name, en: e.target.value}}}))
        e.target.id === "name-short_ru" && setFiber(prev => ({...prev, short: {...prev.short, name: {...prev.short.name, ru: e.target.value}}}))
        e.target.id === "text-short_en" && setFiber(prev => ({...prev, short: {...prev.short, text: {...prev.short.text, en: e.target.value}}}))
        e.target.id === "text-short_ru" && setFiber(prev => ({...prev, short: {...prev.short, text: {...prev.short.text, ru: e.target.value}}}))
    }, [])



    const renderSpec = useMemo(() => {
        return (
            fibersProperties.map((item, i) => {
                return (
                    <Fragment key={item._id}>
                        {item.type !== 'string' ? 
                            <div className="input__wrapper no-info" key={item._id}>
                                <Selector 
                                    lang={lang} 
                                    id={item._id} 
                                    label={item.name}
                                    defaultData={{value: '', name: {en: 'Select', ru: 'Выберете'}}}
                                    data={item.type === '10' ? data10 : item.type === '5' ? data5 : data3 }
                                    onBlur={(e) => inputChecker({lang, notExact: '', el: e.target})}/>
                            </div>
                        :
                            <div className="input__wrapper no-info" key={item._id} data-selector="input-block">
                                <label htmlFor={item._id}>{item.name[lang]}, ({item.unit[lang]}):</label>
                                <input 
                                    data-selector="input"
                                    type="text" 
                                    id={item._id} 
                                    data-ru={item.name.ru} 
                                    data-en={item.name.en}
                                    onKeyDown={focuserSpec.next}
                                    onBlur={(e) => inputChecker({lang, min:1, max:50, el: e.target})}/>
                            </div>
                        }
                    </Fragment>
                )
            })
        )
    }, [fibersProperties, lang])





    const renderImages = useMemo(() => {
        return (
            changeImages ? 
                <>
                    <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                    <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
                    {paramFiberId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                </>
            :
                <>{paramFiberId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
        )
    }, [changeImages, lang, paramFiberId])
    


    useEffect(() => {
        if (!_spec.current || !_descr.current) return
        focuserDescr.create({container: _descr.current})
        focuserSpec.create({container: _spec.current, itemsSelector: '[data-selector="select"], [data-selector="input"]'})
        onChangeFeaturesAmount()
    }, [lang])


    const onChangeFeaturesAmount = useCallback(() => {  //select all inputs if new pro/con was added/ old one was removed  
        if (!_pros.current || !_cons.current) return
        focuserPros.create({container: _pros.current})
        const allInputsPros = _pros.current.querySelectorAll('[data-selector="input"]')
        allInputsPros?.forEach(input => {
            (input as HTMLInputElement).onblur = (e) => inputChecker({lang, min: inputsProps.fiber.proscons.min, max: inputsProps.fiber.proscons.max, el: e.target as HTMLInputElement});
        })
        focuserCons.create({container: _cons.current})
        const allInputsCons = _cons.current.querySelectorAll('[data-selector="input"]')
        allInputsCons?.forEach(input => {
            (input as HTMLInputElement).onblur = (e) => inputChecker({lang, min: inputsProps.fiber.proscons.min, max: inputsProps.fiber.proscons.max, el: e.target as HTMLInputElement});
        })
    }, [])



    const onChangeFeature = useCallback((target: HTMLInputElement) => {       
        target.parentElement?.classList.remove('incorrect-value') 
    }, [])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                    <h1>{paramFiberId ? lang === 'en' ? 'Edit fiber' : 'Редактирование материала' : lang === 'en' ? 'Add new fiber' : 'Добавление нового материала'}</h1>
                    <form>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'DESCRIPTION' : 'ОПИСАНИЕ'}</h2>           
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="descr__container" ref={_descr}>
                            <div className="input-block">
                                <label htmlFor="name-short_en">{lang === 'en' ? 'Name short' : 'Назв. кратко'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        data-selector="input"
                                        type="text" 
                                        id="name-short_en" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.short.name.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.nameShort.min, max:inputsProps.fiber.nameShort.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        data-selector="input"
                                        type="text" 
                                        id="name-short_ru" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.short.name.ru}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.nameShort.min, max:inputsProps.fiber.nameShort.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="namer_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        data-selector="input"
                                        type="text" 
                                        id="name_en" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.name.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.nameFull.min, max:inputsProps.fiber.nameFull.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <input 
                                        data-selector="input"
                                        type="text" 
                                        id="name_ru" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.name.ru}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.nameFull.min, max:inputsProps.fiber.nameFull.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text-short_en" 
                                        onChange={onChangeInputs}
                                        onKeyDown={(e) => focuserDescr.next(e)} 
                                        value={fiber.short.text.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.textShort.min, max:inputsProps.fiber.textShort.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text-short_ru" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.short.text.ru}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.textShort.min, max:inputsProps.fiber.textShort.max, el: e.target})}/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_en" 
                                        onChange={onChangeInputs} 
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.text.en}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.textFull.min, max:inputsProps.fiber.textFull.max, el: e.target})}/>
                                </div>
                                <div className="input__wrapper" data-selector="input-block">
                                    <textarea 
                                        data-selector="input"
                                        id="text_ru"
                                        onChange={onChangeInputs}
                                        onKeyDown={(e) => focuserDescr.next(e)}
                                        value={fiber.text.ru}
                                        onBlur={(e) => inputChecker({lang, min:inputsProps.fiber.textFull.min, max:inputsProps.fiber.textFull.max, el: e.target})}/>
                                </div>
                            </div>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'SPECIFICATIONS' : 'ПАРАМЕТРЫ'}</h2>           
                        <div className="input-block multi" ref={_spec}>
                            {renderSpec}
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'PROS' : 'ПЛЮСЫ'}</h2>           
                        <div className="proscons pros" ref={_pros}>
                            <Featurer 
                                lang={lang} 
                                ref={prosRef}
                                amountChanged={onChangeFeaturesAmount}
                                valueChanged={onChangeFeature}
                                onEnter={focuserPros.next}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'CONS' : 'МИНУСЫ'}</h2>                   
                        <div className="proscons cons" ref={_cons}>
                            <Featurer 
                                lang={lang} 
                                ref={consRef}
                                amountChanged={onChangeFeaturesAmount}
                                valueChanged={onChangeFeature}
                                onEnter={focuserCons.next}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'PICK COLORS' : 'ВЫБЕРЕТЕ ЦВЕТА'}</h2>           
                        <div className="colors-picker">
                            {colorsState.load.status === 'success' ? 
                                <Picker ref={colorPickerRef} items={colorsState.colors} lang={lang} onEditClick={onEditColor} onDeleteClick={onDeleteColor}/>
                            :
                                <Preloader />}
                        </div>


                        {renderImages}

                        <button className='button_blue post' disabled={fibersState.send.status === 'fetching'} onClick={onSubmit}>
                            {fibersState.send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramFiberId ? 'Save fiber' : 'Post fiber' : paramFiberId ? "Сохранить материал" : "Отправить материал"}</>
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
    fibersState: state.fibers,
    colorsState : state.colors
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(FiberCreator)