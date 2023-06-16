import { IColorsState, IFetch, IFullState, TLang } from 'src/interfaces';
import './color-creator.scss'
import React, {  useRef } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal from 'src/components/Modal/Modal';
import MessageInfo from 'src/components/MessageInfo/MessageInfo';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';

interface IPropsState {
    lang: TLang
    colorState: IColorsState
}


interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}



interface IProps extends IPropsState, IPropsActions {
}


const ColorCreator: React.FC<IProps> = ({lang, colorState, setState}): JSX.Element => {

    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    //const _fileBig = useRef<File>(null)
    //const _fileSmall = useRef<File>(null)
    //const [urls, setUrls] = useState<{big: string, small: string}>({big:'', small: ''})
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const addFileSmall = useRef<IAddFilesFunctions>(null)
    const [files, setFiles] = useState<{big: File | undefined, small: File | undefined}>({big: undefined, small: undefined})
    //const [file, setFile] = useState<File>()

    const prevent = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const closeModal = () => {
		setModal(false)
        setMessage({
            status: '',
            header: colorState.send.status,
            text: ['']
        })
        setState.colors.setSendColors({status: 'idle', message: {en: '', ru: ''}})
	}


    const errorsCheck = () => {
        const errors: string[] = []

        const check = (ref:  React.RefObject<HTMLInputElement>) => {
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




    const saveFileSmall = (files: File[]) => {
        const file = files[0]
        setFiles(prev => {
                return {
                    ...prev,
                    small: file
                }
        })
    }

    const saveFileBig = (files: File[]) => {
        const file = files[0]
        setFiles(prev => {
                return {
                    ...prev,
                    big: file
                }
        })
    }


    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        
        if (!_name_en.current || !_name_ru.current) return

        const isErrors = errorsCheck();
        isErrors.check(_name_en)
        isErrors.check(_name_ru)

        const fileErrors: string[] = []
        /*if (!file) {
            fileErrors.push(lang === 'en' ? 'File is missed' : 'Отсутствует файл')
        }*/    
        if (!files.big) {
            fileErrors.push(lang === 'en' ? 'File full is missed' : 'Отсутствует файл полноразмера')
        }
        if (!files.small) {
            fileErrors.push(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
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
        setState.colors.sendColor(color)
    }


    
    useEffect(() => {
        if (!_name_en.current || !_name_ru.current) return
        if (colorState.send.status === 'success' || colorState.send.status === 'error') {
            const errors: string[] = colorState.send.errors?.map(e => e[lang]) || []
            setMessage({
                header: colorState.send.status === 'success' ? lang === 'en' ? 'Success' : 'Успех' : lang === 'en' ? 'Error' : 'Ошибка',
                status: colorState.send.status,
                text: [colorState.send.message[lang], ...errors]
            })
            setModal(true)
            if (colorState.send.status === 'success') {
                _name_en.current.value = ''
                _name_ru.current.value = ''
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }
        }

    }, [colorState.send.status])

    
    return (
        <div className="page page_color-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Add new color' : 'Добавление нового цвета'}</h1>
                    <form>

                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label htmlFor="header_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="header_en" ref={_name_en} data-ru="Название EN" data-en="Name EN"/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="header_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"/>
                            </div>
                        </div>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>{lang === 'en' ? "FULLSIZE" : "ПОЛНОРАЗМЕР"}</h3>
                            <h3 className='lang'>{lang === 'en' ? "PREVIEW" : "ПРЕДПРОСМОТР"}</h3>
                        </div>
                        <div className="input-block">
                            <label htmlFor="url_big">{lang === 'en' ? 'Image' : 'Картинка'}:</label>
                            <div className="input__wrapper">
                                <AddFiles saveFiles={saveFileBig} lang={lang} ref={addFileBig} multiple={false} id='big'/>
                            </div>
                            <div className="input__wrapper">
                                <AddFiles saveFiles={saveFileSmall} lang={lang} ref={addFileSmall} multiple={false} id='small'/>
                            </div>
                        </div>

                        <button className='button_blue post' disabled={false} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Add color' : "Добавить цвет"}</button>
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
    colorState: state.colors,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)