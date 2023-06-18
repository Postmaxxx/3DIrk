import { IColorsState, IFetch, IFiber, IFiberParam, IFiberProperties, IFibersState, IFullState, IProsCons, TLang, TLangText } from 'src/interfaces';
import './fiber-creator.scss'
import React, {  useRef, useMemo } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal from 'src/components/Modal/Modal';
import MessageInfo from 'src/components/MessageInfo/MessageInfo';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import Selector from 'src/components/tiny/Selector/Selector';
import { selector10, selector3, selector5 } from 'src/assets/data/selectorValues';
import { fibersProperties } from 'src/assets/data/fibersProperties';
import Preloader from 'src/components/Preloaders/Preloader';

interface IPropsState {
    lang: TLang
    fiberState: IFibersState
    colorsState: IColorsState
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}



interface IProps extends IPropsState, IPropsActions {
}


const ColorCreator: React.FC<IProps> = ({lang, fiberState, setState, colorsState}): JSX.Element => {

    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const _name_short_en = useRef<HTMLInputElement>(null)
    const _name_short_ru = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})
    const addFiles = useRef<IAddFilesFunctions>(null)
    const [files, setFiles] = useState<File[]>([])
    //const [spec, setSpec] = useState<{[key: string]: string}>(fibersProperties.reduce((acc, item) => ({...acc, [item.id]: ''}), {}))
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const [selectedColors, setSelectedColors] = useState<{[key: string]: boolean}>({})
    const _spec = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)

    const data10 = useMemo(() => {
        return selector10
    }, [])

    const data5 = useMemo(() => {
        return selector5
    }, [])

    const data3 = useMemo(() => {
        return selector3
    }, [])


    const prevent = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const closeModal = () => {
		setModal(false)
        /*setMessage({
            status: '',
            header: colorState.send.status,
            text: ['']
        })
        setState.colors.setSendColors({status: 'idle', message: {en: '', ru: ''}})*/
	}


    const errorsCheck = () => {
        const errors: string[] = []

        const check = (el:  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean => {
            if (!el.value) {
                errors.push(el.dataset[lang] as string)
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.parentElement?.classList.add('error')
                }
                if (el.tagName === 'SELECT') {
                    el.parentElement?.parentElement?.classList.add('error')
                }
                return true //error exists
            }
            return false // no error
        }


        const add = (e: string) => {
            errors.push(e)
        }

        const result = () => {
            return errors
        }

        return { check, result, add }
    }

   
    const saveFiles = (files: File[]) => {
        setFiles(files)
    }



    
    useEffect(() => {
        /*if (!_name_en.current || !_name_ru.current) return
        if (colorState.send.status === 'success' || colorState.send.status === 'error') {
            const errors: string[] = colorState.send.errors?.map(e => e[lang]) || []
            setMessage({
                header: colorState.send.status === 'success' ? lang === 'en' ? 'Success' : 'Успех' : lang === 'en' ? 'Error' : 'Ошибка',
                status: colorState.send.status,
                text: [colorState.send.message[lang], ...errors]
            })
            setModal(true)
            /*if (colorState.send.status === 'success') {
                _name_en.current.value = ''
                _name_ru.current.value = ''
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }*/
        //}

    }, [])



    useEffect(() => {
        if (colorsState.load.status !== 'fetching' && colorsState.load.status !== 'success') {
            setState.colors.loadColors()
        }    
    }, [colorsState.load.status])


    const saveValues = ({id, e}: {id: string, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>}) => {
        /*setSpec((prev) => {
            return {
                ...prev,
                [id]: e.target.value
            }
        })*/
        if (e.target.tagName === 'INPUT') {
            e.target.parentElement?.classList.remove('error')
        }
        if (e.target.tagName === 'SELECT') {
            e.target.parentElement?.parentElement?.classList.remove('error')
        }
    }


    const onAddPro = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        const newImageBlock = document.createElement('div')
        newImageBlock.classList.add('block_procon')
        newImageBlock.classList.add('full-width')

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
        delBtn.onclick = (e) => onDeletePro(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>)

        newImageBlock.appendChild(wrEn)
        newImageBlock.appendChild(wrRu)
        newImageBlock.appendChild(delBtn)
        if (!_pros.current) return
        _pros.current.appendChild(newImageBlock)
    }


    const onDeletePro = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        prevent(e)
        const parent = e.currentTarget?.parentNode as HTMLElement
        parent.remove();
    }


    const onAddCon = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        const newImageBlock = document.createElement('div')
        newImageBlock.classList.add('block_procon')
        newImageBlock.classList.add('full-width')

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
        delBtn.onclick = (e) => onDeleteCon(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>)

        newImageBlock.appendChild(wrEn)
        newImageBlock.appendChild(wrRu)
        newImageBlock.appendChild(delBtn)
        if (!_cons.current) return
        _cons.current.appendChild(newImageBlock)
    }


    const onDeleteCon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        prevent(e)
        const parent = e.currentTarget?.parentNode as HTMLElement
        parent.remove();
    }


    const onColorClick = (id: string) => {
        setSelectedColors(prev => prev[id] ? 
            {...prev, [id]: false} 
            : 
            {...prev, [id]: true})
    }





    

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        
        if (!_name_en.current || !_name_ru.current || !_name_short_en.current || !_name_short_ru.current || !_text_en.current || 
            !_text_ru.current || !_text_short_en.current || !_text_short_ru.current || !_spec.current || !_descr.current) return

        const isErrors = errorsCheck(); 
        
        _descr.current.querySelectorAll('input, textarea').forEach(item => {//check DESCRIPTION
            isErrors.check(item as HTMLInputElement | HTMLTextAreaElement)
        })
        

        const allSpec: {[key: string]: string} = {};
        _spec.current.querySelectorAll('input, select').forEach(item => { //check specifications      
            isErrors.check(item as HTMLInputElement | HTMLSelectElement)
            allSpec[item.id] = (item as HTMLInputElement | HTMLSelectElement).value 
        })


        if (files.length === 0) {//check images
            isErrors.add(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }
       

        if (!Object.values(selectedColors).some(item => item)) { //check at least 1 color selected
            isErrors.add(lang === 'en' ? 'No color selected' : 'Цвет не выбран')
        }
        



        const proscons = {} as IProsCons
        proscons.pros = Array.from(_pros.current?.querySelectorAll('input') || []) //
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])
        
        proscons.cons = Array.from(_cons.current?.querySelectorAll('input') || []) //
            .reduce<TLangText[]>((result, current, i) => {
                i % 2 === 0 ? result.push({en: current.value, ru: ''}) : result[Math.floor(i/2)].ru = current.value
                return result;
            }, [])

        if (proscons.pros.some(item => !item.en || !item.ru)) {//proscons error check
            isErrors.add(lang === 'en' ? 'Empty pro exists' : 'Есть незаполненный плюс')
        }
        if (proscons.cons.some(item => !item.en || !item.ru)) {
            isErrors.add(lang === 'en' ? 'Empty con exists' : 'Есть незаполненный минус')
        }

       
        if (isErrors.result().length > 0) {
            setMessage({
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: [isErrors.result().join(', ')]
            })
            return setModal(true)
        }


        //create new fiberToStore
        const newFiber: Omit<IFiber, '_id' | 'images'> & {images: File[]} = {
            name: {en: _name_en.current.value, ru: _name_ru.current.value},
            text: {en: _text_en.current.value, ru: _text_ru.current.value},
            short: {
                name: {en: _name_short_en.current.value, ru: _name_short_ru.current.value},
                text: {en: _text_short_en.current.value, ru: _text_short_ru.current.value}
            },
            params: (allSpec as unknown) as IFiberParam,
            colors: Object.entries(selectedColors).filter(item => item[1]).map(item => item[0]),
            images: files,
            proscons
        }

        
        // to backend 
        setState.fibers.sendFiber(newFiber)
    }

    
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
                                    <input type="text" id="name_en" ref={_name_en} data-ru="Название EN" data-en="Name EN"/>
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="name-short_en">{lang === 'en' ? 'Name short' : 'Назв. кратко'}:</label>
                                <div className="input__wrapper">
                                    <input type="text" id="name-short_en" ref={_name_short_en} data-ru="Название кратко EN" data-en="Name short EN"/>
                                </div>
                                <div className="input__wrapper">
                                    <input type="text" id="name-short_ru" ref={_name_short_ru} data-ru="Название кратко RU" data-en="Name short RU"/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text_en">{lang === 'en' ? 'Text' : 'Текст'}:</label>
                                <div className="input__wrapper">
                                    <textarea  id="text_en" ref={_text_en} data-ru="Текст EN" data-en="Text EN"/>
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text_ru" ref={_text_ru} data-ru="Текст RU" data-en="Text RU"/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text-short_en" ref={_text_short_en} data-ru="Текст кратко EN" data-en="Text short EN"/>
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text-short_ru" ref={_text_short_ru} data-ru="Текст кратко RU" data-en="Text short RU"/>
                                </div>
                            </div>
                        </div>

                        <h2 className='section-header full-width'>{lang === 'en' ? 'SPECIFICATIONS' : 'ПАРАМЕТРЫ'}</h2>           
                        <div className="input-block multi" ref={_spec}>
                            {fibersProperties.map((item, i) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        {item.type !== 'string' ? 
                                            <div className="input__wrapper no-info" key={item.id}>
                                                <Selector 
                                                    lang={lang} 
                                                    id={item.id} 
                                                    label={item.name}
                                                    defaultData={{value: data10[0].value, name: {en: 'Select', ru: 'Выберете'}}}
                                                    saveValue={saveValues}
                                                    data={item.type === '10' ? data10 : item.type === '5' ? data5 : data3 }
                                                    dataset={item.name}
                                                    />
                                            </div>
                                        :
                                            <div className="input__wrapper no-info" key={item.id}>
                                                <label htmlFor={item.id}>{item.name[lang]}, ({item.unit[lang]}):</label>
                                                <input type="text" id={item.id} onChange={(e) => saveValues({id: item.id, e})} data-ru={item.name.ru} data-en={item.name.en}/>
                                            </div>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div>


                        <h2 className='section-header full-width'>{lang === 'en' ? 'PROS' : 'ПЛЮСЫ'}</h2>           
                        <div className="proscons pros" ref={_pros}></div>
                        <button className='button_blue add' onClick={e => onAddPro(e)}>{lang === 'en' ? '+' : '+'}</button>
                        
                        <h2 className='section-header full-width'>{lang === 'en' ? 'CONS' : 'МИНУСЫ'}</h2>           
                        <div className="proscons cons" ref={_cons}></div>
                        <button className='button_blue add' onClick={e => onAddCon(e)}>{lang === 'en' ? '+' : '+'}</button>




                        <h2 className='section-header full-width'>{lang === 'en' ? 'PICK COLORS' : 'ВЫБЕРЕТЕ ЦВЕТА'}</h2>           
                        <div className="colors-picker">
                            {colorsState.load.status === 'success' ? 
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
                            }
                        </div>



                        <h2 className='section-header full-width'>{lang === 'en' ? 'Images' : 'Изображения'}</h2>           
                        <AddFiles saveFiles={(files: File[]) => saveFiles(files)} lang={lang} ref={addFiles} multiple={true} id='big'/>

                        <button className='button_blue post' disabled={false} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Add fiber' : "Добавить материал"}</button>
                    </form>
                </div>
                <Modal {...{visible: modal, close: closeModal, escExit: true}}>
                    <MessageInfo {...{  
                            status: message.status,
                            header: message.header,
                            text: message.text, 
                            buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                            buttonAction: closeModal
                        }}/>
                </Modal> 
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    fiberState: state.fibers,
    colorsState : state.colors
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)