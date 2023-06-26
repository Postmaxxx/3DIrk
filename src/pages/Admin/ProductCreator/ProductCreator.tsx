import { ICatalogState, IColorsState, IFiberParam, IFibersState, IFullState, IProsCons, ISendFiber, TLang, TLangText } from 'src/interfaces';
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
import { fibersProperties } from 'src/assets/data/fibersProperties';
import Preloader from 'src/components/Preloaders/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { headerStatus, resetFetch, selector, timeModalClosing } from 'src/assets/js/consts';
import { errorsChecker, prevent } from 'src/assets/js/processors';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    colorsState: IColorsState
    catalogState: ICatalogState
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
        catalog: typeof allActions.catalog
    }
}


interface IProps extends IPropsState, IPropsActions {}


const ProductCreator: FC<IProps> = ({lang, fibersState, setState, catalogState, colorsState}): JSX.Element => {
    
    const navigate = useNavigate()
    const paramProductId = useParams().productId || ''
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const modal_missedId = useRef<IModalFunctions>(null)
    const message_missedId = useRef<IMessageFunctions>(null)
    const _addMod = useRef<HTMLButtonElement>(null)
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const _price_en = useRef<HTMLInputElement>(null)
    const _price_ru = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)
    const _mods = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const [selectedFibers, setSelectedFibers] = useState<{[key: string]: boolean}>({})
    const [changeImages, setChangeImages] = useState<boolean>(true)

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
	}, [fibersState.send.status, colorsState.send.status])

    
    const closeModalAndReturn = useCallback(() => {
        modal_missedId.current?.closeModal()
        setTimeout(() => message_missedId.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal 
        errChecker.clear()     
        navigate('/fibers', { replace: true })
        window.location.reload()
    },[])


    
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


    useEffect(() => {
        if (colorsState.send.status === 'idle' || colorsState.send.status === 'fetching')  return
        const errors: string[] = colorsState.send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[colorsState.send.status][lang],
            status: colorsState.send.status,
            text: [colorsState.send.message[lang], ...errors]
        })
        modal.current?.openModal('color')
    }, [colorsState.send.status])



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
        setSelectedFibers(prev => ({...prev, [id]: !prev[id]}))
    }





    

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {        
        prevent(e)
        if (!_name_en.current || !_name_ru.current || !_price_en.current || !_price_ru.current || !_text_en.current || 
        !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_descr.current) return
        
        //check DESCRIPTION
        errChecker.check(_name_en.current, 1, 30)
        errChecker.check(_name_ru.current, 1, 30)
        errChecker.check(_price_en.current, 1, 10)
        errChecker.check(_price_ru.current, 1, 10)
        errChecker.check(_text_short_en.current, 10, 100)
        errChecker.check(_text_short_ru.current, 10, 100)
        errChecker.check(_text_en.current, 100, 8000)
        errChecker.check(_text_ru.current, 100, 8000)


        if (addFiles.current && addFiles.current.getFiles().length === 0 && changeImages) {//check images
            errChecker.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }
       

        if (!Object.values(selectedFibers).some(item => item)) { //at least 1 color must be selected
            errChecker.add(lang === 'en' ? 'No color selected' : 'Цвет не выбран')
        }
        

        const proscons = {} as IProsCons
        proscons.pros = Array.from(_mods.current?.querySelectorAll('input') || []) //convert array like [en1, ru1, en2, ru2] -> [{en: en1, ru: ru1}, {en: en2, ru: ru2}]
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])
        

        if (proscons.pros.some(item => !item.en || !item.ru)) {//proscons error check
            errChecker.add(lang === 'en' ? 'Empty pro exists' : 'Есть незаполненный плюс')
        }

       
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal('submit')
            return
        }


        //create new fiberToStore
        const newFiber: ISendFiber = {
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
        }        
    }


    const onDeleteColor = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        setState.colors.deleteColor(_id)
    }

    const onEditColor = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        navigate(`/admin/color-create/${_id}`)
    }





    const fillValues = (_id : string) => {      
        const sourceFiber = fibersState.fibersList.find(item => item._id === _id)
        if (!sourceFiber) {
            message_missedId.current?.update({header: lang === 'en' ? 'Error' : 'Ошибка', status: 'error', text: lang === 'en' ? ['Editing fiber was not found, switching to creating new fiber'] : ['Материал для редактирования не найден, переход к созданию нового материала']})
            modal_missedId.current?.openModal('filling')
            return
        }
        if (!_name_en.current || !_name_ru.current || !_price_en.current || !_price_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_descr.current || !_mods.current) return
        //description
        _name_en.current.value = sourceFiber.name.en
        _name_ru.current.value = sourceFiber.name.ru
        _text_en.current.value = sourceFiber.text.en
        _text_ru.current.value = sourceFiber.text.ru
        _price_en.current.value = sourceFiber.short.name.en
        _price_ru.current.value = sourceFiber.short.name.ru
        _text_short_en.current.value = sourceFiber.short.text.en
        _text_short_ru.current.value = sourceFiber.short.text.ru
        //specifications

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
        const initialColors = sourceFiber.colors.reduce((acc, item) => {
            return {...acc, [item]: true}
        }, {} as {[key: string]: boolean})
        setSelectedFibers(initialColors)
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
    }, [])

    
    const renderFibers = useMemo(() => {
        return (
            colorsState.load.status === 'success' ? 
            <>
                {/*colorsState.colors.map((color) => {
                    return (
                        <div className="color__container" key={color._id}>
                            <div className={`image__container ${selectedFibers[color._id] ? 'selected' : ''}`} onClick={() => onColorClick(color._id)}>
                                <img src={color.url.small} alt={color.name[lang]} />
                            </div>
                            <span>{color.name[lang]}</span>
                            <div className="buttons_control">
                                <button className="button_blue edit" onClick={(e) => onEditColor(e, color._id)}>E</button>
                                <button className="button_blue delete" onClick={(e) => onDeleteColor(e, color._id)}>X</button>
                            </div>
                        </div>
                    )
                })*/}
            </>
        :
            <Preloader />
        
        )
    }, [colorsState.load.status, colorsState.colors, lang, selectedFibers])


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
                                    <input type="text" id="name_en" ref={_name_en} data-ru="Название EN" data-en="Name EN" onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="price_en">{lang === 'en' ? 'Price' : 'Цена'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="price_en" ref={_price_en} data-ru="Цена EN" data-en="Price EN"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="price_ru" ref={_price_ru} data-ru="Цена RU" data-en="Price RU" onChange={(e: React.ChangeEvent<HTMLInputElement>) => errChecker.clearError(e.target)} />
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


                        <h2 className='section-header full-width'>{lang === 'en' ? 'MODIFICATIONS' : 'МОДИФИКАЦИИ'}</h2>           
                        <div className="proscons pros" ref={_mods}></div>
                        <button className='button_blue add' ref={_addMod} onClick={e => onAddProCon(e, _mods)}>{lang === 'en' ? '+' : '+'}</button>




                        <h2 className='section-header full-width'>{lang === 'en' ? 'PICK COLORS' : 'ВЫБЕРЕТЕ ЦВЕТА'}</h2>           
                        <div className="colors-picker">
                            {renderFibers}
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
    catalogState: state.catalog
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ProductCreator)