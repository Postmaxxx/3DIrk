import { IColorsState, IFetch, IFiber, IFiberProperties, IFibersState, IFullState, TLang } from 'src/interfaces';
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
    //const _fileBig = useRef<File>(null)
    //const _fileSmall = useRef<File>(null)
    //const [urls, setUrls] = useState<{big: string, small: string}>({big:'', small: ''})
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})
    //const addFileBig = useRef<IAddFilesFunctions>(null)
    //const addFileSmall = useRef<IAddFilesFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)
    const [files, setFiles] = useState<File[]>([])
    //const [file, setFile] = useState<File>()
    const [spec, setSpec] = useState<{[key: string]: string}>(fibersProperties.reduce((acc, item) => ({...acc, [item.id]: ''}), {}))
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const [selectedColors, setSelectedColors] = useState<{[key: string]: boolean}>({})
    const _spec = useRef<HTMLDivElement>(null)

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

        const check = (ref:  React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (ref.current?.value === '') {
                ref.current.classList.add('error')
                errors.push(ref.current?.dataset[lang] as string)
            }
        }

        const result = () => {
            return errors
        }

        return { check, result }
    }

   
    const saveFiles = (files: File[]) => {
        const file = files[0]
        setFiles(prev => {
                return {
                    ...prev,
                    small: file
                }
        })
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
        setSpec((prev) => {
            return {
                ...prev,
                [id]: e.target.value
            }
        })
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
        console.log(1);
        
        if (!_name_en.current || !_name_ru.current || !_name_short_en || !_name_short_ru || !_text_en || !_text_ru || !_text_short_en || !_text_short_ru) return
        if (!_spec.current ) return

        const isErrors = errorsCheck(); //check DESCRIPTION
        isErrors.check(_name_en)
        isErrors.check(_name_ru)
        isErrors.check(_name_short_en)
        isErrors.check(_name_short_ru)
        isErrors.check(_text_en)
        isErrors.check(_text_ru)
        isErrors.check(_text_short_en)
        isErrors.check(_text_short_ru)

        const fileErrors: string[] = []  
        if (files.length === 0) {//check images
            fileErrors.push(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
        }
        
        _spec.current.querySelectorAll('input').forEach(item => {
            if (item.value === '') {
                item.parentElement?.classList.add('error')
            }
        })

        _spec.current.querySelectorAll('select').forEach(item => {
            if (item.value === '') {
                item.parentElement?.parentElement?.classList.add('error')
            }
        })
        console.log(fileErrors);















        if (isErrors.result().length > 0) {
            setMessage({
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: [...isErrors.result(), ...fileErrors]
            })
            setModal(true)
            return
        }






        //const fileBig = _fileBig.current.files[0]


        const color = {
            name: {
                en: _name_en.current.value.trim(),
                ru: _name_ru.current.value.trim(),
            },
            files: {
                big: files.big as File,
                small: files.small as File,
            }
            //file: file as File
        }

        // to backend 
        //setState.fibers.sendColor(color)
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
                        <div className="descr__container">
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
                                    <textarea id="text_ru" ref={_text_en} data-ru="Текст RU" data-en="Text RU"/>
                                </div>
                            </div>
                            <div className="input-block">
                                <label htmlFor="text-short_en">{lang === 'en' ? 'Text short' : 'Текст кратко'}:</label>
                                <div className="input__wrapper">
                                    <textarea id="text-short_en" ref={_text_short_en} data-ru="Текст кратко EN" data-en="Text short EN"/>
                                </div>
                                <div className="input__wrapper">
                                    <textarea id="text-short_ru" ref={_text_short_en} data-ru="Текст кратко RU" data-en="Text short RU"/>
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
                                                    defaultData={{value: '', name: {en: 'Select', ru: 'Выберете'}}}
                                                    saveValue={saveValues}
                                                    data={item.type === '10' ? data10 : item.type === '5' ? data5 : data3 }/>
                                            </div>
                                        :
                                            <div className="input__wrapper no-info" key={item.id}>
                                                <label htmlFor={item.id}>{item.name[lang]}, ({item.unit[lang]}):</label>
                                                <input type="text" id={item.id} ref={_name_en} onChange={(e) => saveValues({id: item.id, e})}/>
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
                        <AddFiles saveFiles={saveFiles} lang={lang} ref={addFiles} multiple={true} id='big'/>

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