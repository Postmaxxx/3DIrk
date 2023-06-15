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
    const _urlBig = useRef<HTMLInputElement>(null)
    const _urlSmall = useRef<HTMLInputElement>(null)
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})

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





    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        
        if (!_name_en.current || !_name_ru.current || !_urlBig.current || !_urlSmall.current) return

        const isErrors = errorsCheck();
        isErrors.check(_name_en)
        isErrors.check(_name_ru)
        isErrors.check(_urlBig)
        isErrors.check(_urlSmall)

        if (isErrors.result().length > 0) {
            setMessage({
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: isErrors.result()
            })
            setModal(true)
            return
        }

        const color = {
            name: {
                en: _name_en.current.value.trim(),
                ru: _name_ru.current.value.trim(),
            },
            url: {
                big: _urlBig.current.value.trim(),
                small: _urlSmall.current.value.trim(),
            }  
        }

        setState.colors.sendColor(color)
    }



    useEffect(() => {
        console.log(colorState.send.status);
        if (colorState.send.status === 'idle' || colorState.send.status === 'fetching')  return
        
        const errors: string[] = colorState.send.errors?.map(e => e[lang]) || []
        setMessage({
            header: colorState.send.status === 'success' ? lang === 'en' ? 'News posted' : 'Новость добавлена' : lang === 'en' ? 'Error' : 'Ошибка',
            status: colorState.send.status,
            text: [colorState.send.message[lang], ...errors]
        })
		setModal(true)

    }, [colorState.send.status])

    
    return (
        <div className="page page_color-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Post color' : 'Добавление цвета'}</h1>
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
                        <div className="input-block">
                            <label htmlFor="header_en">{lang === 'en' ? 'URL' : 'URL'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="header_en" ref={_urlBig} data-ru="URL большой" data-en="URL big"/>
                            </div>
                        </div>
                        <div className="input-block">
                            <label htmlFor="header_en">{lang === 'en' ? 'URL' : 'URL'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="header_en" ref={_urlSmall} data-ru="URL маленький" data-en="URL small"/>
                            </div>
                        </div>


                        <button className='button_blue post' disabled={colorState.send.status === 'fetching'} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Create color' : "Создать цвет"}</button>
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