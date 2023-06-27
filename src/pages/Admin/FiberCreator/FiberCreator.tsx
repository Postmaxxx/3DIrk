import { IColorsState, IFiberParam, IFibersState, IFullState, IProsCons, ISendFiber, TLang, TLangText } from 'src/interfaces';
import './fiber-creator.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import Selector from 'src/components/tiny/Selector/Selector';
import { fibersProperties } from 'src/assets/data/fibersProperties';
import Preloader from 'src/components/Preloaders/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { headerStatus, resetFetch, selector, timeModalClosing } from 'src/assets/js/consts';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import Picker, { IPickerFunctions } from 'src/components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from 'src/components/Featurer/Featurer';

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
    const modal = useRef<IModalFunctions>(null)
    const modal_missedId = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const message_missedId = useRef<IMessageFunctions>(null)
    const colorPicker = useRef<IPickerFunctions>(null)
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const _name_short_en = useRef<HTMLInputElement>(null)
    const _name_short_ru = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const _spec = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const pros = useRef<IFeaturerFunctions>(null)
    const cons = useRef<IFeaturerFunctions>(null)

    const data10 = useMemo(() => selector["10"], [])
    const data5 = useMemo(() => selector["5"], [])
    const data3 = useMemo(() => selector["3"], [])
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

        if (modal.current?.getOwner() === 'color') {
            if (colorsState.send.status === 'success') {
                setState.colors.loadColors()
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
	}, [fibersState.send.status, colorsState.send.status, errChecker])

    
    const closeModalAndReturn = useCallback(() => {
        modal_missedId.current?.closeModal()
        setTimeout(() => message_missedId.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        navigate('/fibers', { replace: true })
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


    useEffect(() => { //for delete color
        if (colorsState.send.status === 'idle' || colorsState.send.status === 'fetching')  return
        const errors: string[] = colorsState.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[colorsState.send.status][lang],
            status: colorsState.send.status,
            text: [colorsState.send.message[lang], ...errors]
        })
        modal.current?.openModal('color')
    }, [colorsState.send.status])




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
        !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !_descr.current || 
        !colorPicker.current || !pros.current || !cons.current) return
        
        //check DESCRIPTION
        errChecker.check(_name_en.current, 1, 30)
        errChecker.check(_name_ru.current, 1, 30)
        errChecker.check(_name_short_en.current, 1, 10)
        errChecker.check(_name_short_ru.current, 1, 10)
        errChecker.check(_text_short_en.current, 10, 100)
        errChecker.check(_text_short_ru.current, 10, 100)
        errChecker.check(_text_en.current, 100, 8000)
        errChecker.check(_text_ru.current, 100, 8000)

        const allSpec: {[key: string]: string} = {};
        _spec.current.querySelectorAll('input, select').forEach(item => { //check specifications      
            errChecker.check(item as HTMLInputElement | HTMLSelectElement, 1, 10)
            allSpec[item.id] = (item as HTMLInputElement | HTMLSelectElement).value 
        })


        if (addFiles.current && addFiles.current.getFiles().length === 0 && changeImages) {//check images
            errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }


        

        if (colorPicker.current.getSelected().length === 0) { //at least 1 color must be selected
            errChecker.add(lang === 'en' ? 'No color selected' : 'Цвет не выбран')
        }
        

        _pros.current?.querySelectorAll('input').forEach(item => {           
            errChecker.check(item, 2, 100)
        })
       
        _cons.current?.querySelectorAll('input').forEach(item => {           
            errChecker.check(item, 2, 100)
        })

        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal('submit')
            return
        }


        //create new fiberToStore
        const newFiber: ISendFiber = {
            _id: paramFiberId,
            name: {en: _name_en.current.value.trim(), ru: _name_ru.current.value.trim()},
            text: {en: _text_en.current.value.trim(), ru: _text_ru.current.value.trim()},
            short: {
                name: {en: _name_short_en.current.value.trim(), ru: _name_short_ru.current.value.trim()},
                text: {en: _text_short_en.current.value.trim(), ru: _text_short_ru.current.value.trim()}
            },
            params: (allSpec as unknown) as IFiberParam,
            colors: colorPicker.current.getSelected(),
            files: addFiles.current?.getFiles() || [],
            proscons : {
                pros: pros.current.getFeatures().map(item => ({en: item.name.en, ru: item.name.ru})),
                cons: cons.current.getFeatures().map(item => ({en: item.name.en, ru: item.name.ru}))
            }
        }

        // to backend 
        if (paramFiberId) {
            setState.fibers.editFiber(newFiber, changeImages)
        } else {
            setState.fibers.sendFiber(newFiber)
        }        
    }





    const onDeleteColor = (_id: string) => {
        setState.colors.deleteColor(_id)
    }

    const onEditColor = (_id: string) => {
        navigate(`/admin/color-create/${_id}`)
    }





    const fillValues = (_id : string) => {      
        const sourceFiber = fibersState.fibersList.find(item => item._id === _id)
        if (!sourceFiber) {
            message_missedId.current?.update({header: lang === 'en' ? 'Error' : 'Ошибка', status: 'error', text: lang === 'en' ? ['Editing fiber was not found, switching to creating new fiber'] : ['Материал для редактирования не найден, переход к созданию нового материала']})
            modal_missedId.current?.openModal('filling')
            return
        }
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !pros.current || !cons.current) return
        //description
        _name_en.current.value = sourceFiber.name.en
        _name_ru.current.value = sourceFiber.name.ru
        _text_en.current.value = sourceFiber.text.en
        _text_ru.current.value = sourceFiber.text.ru
        _name_short_en.current.value = sourceFiber.short.name.en
        _name_short_ru.current.value = sourceFiber.short.name.ru
        _text_short_en.current.value = sourceFiber.short.text.en
        _text_short_ru.current.value = sourceFiber.short.text.ru
        //specifications
        _spec.current.querySelectorAll('input, select').forEach(item => {
            (item as HTMLInputElement | HTMLSelectElement).value = String(sourceFiber.params[item.id])
        })

        //proscons
        pros.current.setFeatures(sourceFiber.proscons.pros.map(item => ({name: item, _id: ''})))
        cons.current.setFeatures(sourceFiber.proscons.cons.map(item => ({name: item, _id: ''})))

        //colors 
        colorPicker.current?.setSelected(sourceFiber.colors)
    }


    const fillBlank = () => {
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current ||
            !pros.current || !cons.current) return
        //description
        _name_en.current.value = ''
        _name_ru.current.value = ''
        _text_en.current.value = ''
        _text_ru.current.value = ''
        _name_short_en.current.value = ''
        _name_short_ru.current.value = ''
        _text_short_en.current.value = ''
        _text_short_ru.current.value = ''
        //specifications
        _spec.current.querySelectorAll('input, select').forEach(item => {
            (item as HTMLInputElement | HTMLSelectElement).value = ''
        })
        //proscons
        pros.current.setFeatures([])
        cons.current.setFeatures([])

        //colors 
        colorPicker.current?.setSelected([])
    }




    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }



    useEffect(() => { //if edit
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
            return
        }
        if (fibersState.load.status !== 'success' || colorsState.load.status !== 'success') return
       
        if (paramFiberId) {
            fillValues(paramFiberId)
            setChangeImages(false)
        } else {
            fillBlank()
            setChangeImages(true)
        }

    }, [fibersState.load.status, colorsState.load.status, paramFiberId])





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
                                    saveValue={({id, e}:{e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, id: string}) => errChecker.clearError(e.target)}
                                    data={item.type === '10' ? data10 : item.type === '5' ? data5 : data3 }
                                    dataset={item.name}
                                    />
                            </div>
                        :
                            <div className="input__wrapper no-info" key={item._id}>
                                <label htmlFor={item._id}>{item.name[lang]}, ({item.unit[lang]}):</label>
                                <input type="text" id={item._id} onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => errChecker.clearError(e.target)} data-ru={item.name.ru} data-en={item.name.en}/>
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
                    <AddFiles lang={lang} ref={addFiles} multiple={true} id='allImages'/>
                    {paramFiberId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                </>
            :
                <>{paramFiberId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
            
        )
    }, [changeImages, lang, paramFiberId])
    


    return (
        <div className="page page_fiber-add">
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
                                    <input type="text" id="name_en" ref={_name_en} data-ru="Название EN" data-en="Name EN" onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="name-short_en">{lang === 'en' ? 'Name short' : 'Назв. кратко'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="name-short_en" ref={_name_short_en} data-ru="Название кратко EN" data-en="Name short EN"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name-short_ru" ref={_name_short_ru} data-ru="Название кратко RU" data-en="Name short RU" onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text_en" ref={_text_en} data-ru="Текст EN" data-en="Text EN" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_ru" ref={_text_ru} data-ru="Текст RU" data-en="Text RU" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => errChecker.clearError(e.target)} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text-short_en" ref={_text_short_en} data-ru="Текст кратко EN" data-en="Text short EN" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text-short_ru" ref={_text_short_ru} data-ru="Текст кратко RU" data-en="Text short RU" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => errChecker.clearError(e.target)} />
                                </div>
                            </div>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'SPECIFICATIONS' : 'ПАРАМЕТРЫ'}</h2>           
                        <div className="input-block multi" ref={_spec}>
                            {renderSpec}
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'PROS' : 'ПЛЮСЫ'}</h2>           
                        <div className="proscons pros" ref={_pros}>
                            <Featurer lang={lang} ref={pros}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'CONS' : 'МИНУСЫ'}</h2>                   
                        <div className="proscons cons" ref={_cons}>
                            <Featurer lang={lang} ref={cons}/>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'PICK COLORS' : 'ВЫБЕРЕТЕ ЦВЕТА'}</h2>           
                        <div className="colors-picker">
                            {colorsState.load.status === 'success' ? 
                                <Picker ref={colorPicker} items={colorsState.colors} lang={lang} onEditClick={(_id) => onEditColor(_id)} onDeleteClick={(_id) => onDeleteColor(_id)}/>
                            :
                                <Preloader />}
                        </div>


                        {renderImages}

                        <button className='button_blue post' disabled={fibersState.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {fibersState.send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramFiberId ? 'Save fiber' : 'Post fiber' : paramFiberId ? "Сохранить материал" : "Отправить материал"}</>
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
    colorsState : state.colors
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(FiberCreator)