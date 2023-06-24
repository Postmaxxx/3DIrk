import { IColorsState, IFiberParam, IFibersState, IFullState, IProsCons, ISendFiber, TLang, TLangText } from 'src/interfaces';
import './fiber-creator.scss'
import React, {  useRef, useMemo } from "react";
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


const ColorCreator: React.FC<IProps> = ({lang, fibersState, setState, colorsState}): JSX.Element => {
    
    const navigate = useNavigate()
    const paramFiberId = useParams().fiberId || ''
    const modal = useRef<IModalFunctions>(null)
    const modal_missedId = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const message_missedId = useRef<IMessageFunctions>(null)
    const _addPro = useRef<HTMLButtonElement>(null)
    const _addCon = useRef<HTMLButtonElement>(null)
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const _name_short_en = useRef<HTMLInputElement>(null)
    const _name_short_ru = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)
    const addFilesBig = useRef<IAddFilesFunctions>(null)
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const _spec = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const [selectedColors, setSelectedColors] = useState<{[key: string]: boolean}>({})
    const [changeImages, setChangeImages] = useState<boolean>(true)

    const data10 = useMemo(() => selector["10"], [])
    const data5 = useMemo(() => selector["5"], [])
    const data3 = useMemo(() => selector["3"], [])
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])



    const closeModal = () => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        if (fibersState.send.status === 'success') {
            setState.fibers.setSendFibers(resetFetch)
            setState.fibers.loadFibers()
            navigate('/fibers', { replace: true })
            window.location.reload()
        } else {
            setState.fibers.setSendFibers(resetFetch)// clear fetch status
        }
	}

    const closeModalAndReturn = () => {
        modal.current?.closeModal()
        setTimeout(() => message_missedId.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        navigate('/fibers', { replace: true })
        window.location.reload()
    }


    
    useEffect(() => {
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !_descr.current) return
        if (fibersState.send.status === 'idle' || fibersState.send.status === 'fetching')  return
        const errors: string[] = fibersState.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[fibersState.send.status][lang],
            status: fibersState.send.status,
            text: [fibersState.send.message[lang], ...errors]
        })
        modal.current?.openModal()
    }, [fibersState.send.status])



    const onAddProCon = (e: React.MouseEvent<HTMLButtonElement>, _target: React.RefObject<HTMLElement>) => {
        prevent(e)
        const newProConBlock = document.createElement('div')
        newProConBlock.classList.add('block_procon')
        newProConBlock.classList.add('full-width')

        const wrEn = document.createElement('div'); wrEn.classList.add('input__wrapper')
        const labelUrlEn = document.createElement('label'); labelUrlEn.innerText = lang === 'en' ? 'Value EN' : 'Значение EN'
        const inputEn = document.createElement('input'); inputEn.setAttribute('data-content','en')
        wrEn.appendChild(labelUrlEn); wrEn.appendChild(inputEn)

        const wrRu = document.createElement('div'); wrRu.classList.add('input__wrapper')
        const labelUrlRu = document.createElement('label'); labelUrlRu.innerText = lang === 'en' ? 'Value RU' : 'Значение RU'
        const inputEu = document.createElement('input'); inputEu.setAttribute('data-content','ru')
        wrRu.appendChild(labelUrlRu); wrRu.appendChild(inputEu)
        

        const delBtn = document.createElement('button');
        delBtn.innerHTML = 'X';
        delBtn.classList.add('button_blue');
        delBtn.classList.add('del');
        delBtn.onclick = (e) => onDeleteProCon(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>)

        newProConBlock.appendChild(wrEn)
        newProConBlock.appendChild(wrRu)
        newProConBlock.appendChild(delBtn)
        if (!_target.current) return
        _target.current.appendChild(newProConBlock)
    }


    const onDeleteProCon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        prevent(e)
        const parent = e.currentTarget?.parentNode as HTMLElement
        parent.remove();
    }


    const onColorClick = (id: string) => {
        setSelectedColors(prev => ({...prev, [id]: !prev[id]}))
    }





    

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
        !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !_descr.current) return
        
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


        if (addFilesBig.current && addFilesBig.current.getFiles().length === 0 && changeImages) {//check images
            errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }
       

        if (!Object.values(selectedColors).some(item => item)) { //at least 1 color must be selected
            errChecker.add(lang === 'en' ? 'No color selected' : 'Цвет не выбран')
        }
        

        const proscons = {} as IProsCons
        proscons.pros = Array.from(_pros.current?.querySelectorAll('input') || []) //convert array like [en1, ru1, en2, ru2] -> [{en: en1, ru: ru1}, {en: en2, ru: ru2}]
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])
        
        proscons.cons = Array.from(_cons.current?.querySelectorAll('input') || []) 
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])

        if (proscons.pros.some(item => !item.en || !item.ru)) {//proscons error check
            errChecker.add(lang === 'en' ? 'Empty pro exists' : 'Есть незаполненный плюс')
        }
        if (proscons.cons.some(item => !item.en || !item.ru)) {
            errChecker.add(lang === 'en' ? 'Empty con exists' : 'Есть незаполненный минус')
        }

       
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal()
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
            colors: Object.entries(selectedColors).filter(item => item[1]).map(item => item[0]),
            files: addFilesBig.current?.getFiles() || [],
            proscons
        }

        // to backend 
        if (paramFiberId) {
            setState.fibers.editFiber(newFiber, changeImages)
        } else {
            setState.fibers.sendFiber(newFiber)
        }        
    }






    const fillValues = (_id : string) => {      
        const sourceFiber = fibersState.fibersList.find(item => item._id === _id)
        if (!sourceFiber) {
            message_missedId.current?.update({header: lang === 'en' ? 'Error' : 'Ошибка', status: 'error', text: lang === 'en' ? ['Editing fiber was not found, switching to creating new fiber'] : ['Материал для редактирования не найден, переход к созданию нового материала']})
            modal_missedId.current?.openModal()
            return
        }
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !_descr.current || !_pros.current || !_cons.current) return
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
        _pros.current.innerHTML = '' //clear to avoid duplicate while rerendering
        _cons.current.innerHTML = ''
        sourceFiber.proscons.pros.forEach(item => { //first stage - add all inputs
            if (_addPro.current) {
                _addPro.current.click()
            }
        })
        sourceFiber.proscons.cons.forEach(item => {
            if (_addCon.current) {
                _addCon.current.click()
            }
        })


        const prosInputs = _pros.current.querySelectorAll('input') //second stage - fill all inputs 
        sourceFiber.proscons.pros.forEach((item, i) => {
            prosInputs[i * 2].value = item.en
            prosInputs[i * 2 + 1].value = item.ru
        })

        const consInputs = _cons.current.querySelectorAll('input')
        sourceFiber.proscons.cons.forEach((item, i) => {
            consInputs[i * 2].value = item.en
            consInputs[i * 2 + 1].value = item.ru
        })

        //colors 
        const initialColors = sourceFiber.colors.reduce((acc, item) => {
            return {...acc, [item]: true}
        }, {} as {[key: string]: boolean})
        setSelectedColors(initialColors)
        

    }


    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }



    useEffect(() => { //if edit
        if (!paramFiberId || fibersState.load.status !== 'success') {
            return setChangeImages(true)
        }
        fillValues(paramFiberId)
        setChangeImages(false)
    }, [fibersState.load.status, paramFiberId])


    useEffect(() => {
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }
    }, [])



    const renderSpec = useMemo(() => {
        return (
            fibersProperties.map((item, i) => {
                return (
                    <React.Fragment key={item._id}>
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
                    </React.Fragment>
                )
            })
        )
    }, [fibersProperties, lang])

    
    const renderColors = useMemo(() => {
        return (
            colorsState.load.status === 'success' ? 
            <>
                {colorsState.colors.map((color) => {
                    return (
                        <div className="color__container" key={color._id}>
                            <div className={`image__container ${selectedColors[color._id] ? 'selected' : ''}`} onClick={() => onColorClick(color._id)}>
                                <img src={color.url.small} alt={color.name[lang]} />
                            </div>
                            <span>{color.name[lang]}</span>
                        </div>
                    )
                })}
            </>
        :
            <Preloader />
        
        )
    }, [colorsState.load.status, colorsState.colors, lang, selectedColors])


    const renderImages = useMemo(() => {
        return (
            changeImages ? 
                <>
                    <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                    <AddFiles lang={lang} ref={addFilesBig} multiple={true} id='allImages'/>
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
                        <div className="proscons pros" ref={_pros}></div>
                        <button className='button_blue add' ref={_addPro} onClick={e => onAddProCon(e, _pros)}>{lang === 'en' ? '+' : '+'}</button>
                        
                        <h2 className='section-header full-width'>{lang === 'en' ? 'CONS' : 'МИНУСЫ'}</h2>           
                        <div className="proscons cons" ref={_cons}></div>
                        <button className='button_blue add' ref={_addCon} onClick={e => onAddProCon(e, _cons)}>{lang === 'en' ? '+' : '+'}</button>




                        <h2 className='section-header full-width'>{lang === 'en' ? 'PICK COLORS' : 'ВЫБЕРЕТЕ ЦВЕТА'}</h2>           
                        <div className="colors-picker">
                            {renderColors}
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
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)