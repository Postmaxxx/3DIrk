import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './contact-us.scss'
import {  IFullState,  IUserState, TLang } from "../../interfaces";
import {  useEffect, useRef, useMemo, useCallback } from 'react'
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import Message, { IMessageFunctions } from "../../components/Message/Message";
import { inputsProps, resetFetch, timeModalClosing } from "../../assets/js/consts";
import { focusMover, modalMessageCreator, prevent } from "../../assets/js/processors";
import inputChecker from "../../../src/assets/js/inputChecker";

interface IPropsState {
    lang: TLang,
    userState: IUserState
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
    }
}

interface IProps extends IPropsState, IPropsActions {}




const ContactUs:React.FC<IProps> = ({lang, userState, setState}): JSX.Element => {
    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
    const modalMessageRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const processedContainer = '[data-selector="contact-form"]'

    const focuser = useMemo(() => focusMover(), [lang])


    
    const closeModalMessage = useCallback(() => {
        if (!_message.current || !addFilesRef.current ) return
        modalMessageRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (userState.sendOrder.status === 'success') { //clear all inputs
            if (userState.auth.status !== 'success') { //if user unauthorized
                if (!_name.current || !_email.current || !_phone.current) return
                _name.current.value = ''
                _email.current.value = ''
                _phone.current.value = ''
            }
            _message.current.value = ''
            addFilesRef.current.clearAttachedFiles()
        }
        setState.user.setSendOrder({...resetFetch})
	}, [userState.sendOrder.status])


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {  
        prevent(e)
        const isAuth = userState.auth.status === 'success' ? true : false
        if (!_message.current || !addFilesRef.current) return

        //check errors
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = document.querySelector(processedContainer)?.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) return
        const files = addFilesRef.current.getFiles() // attached files

        const textOrder: string = 
`${lang === 'en' ? 'New message' : 'Новое сообщение'}:
${lang === 'en' ? 'Name' : 'Имя'}: ${isAuth ? userState.name : _name.current?.value}
${lang === 'en' ? 'Email' : 'Почта'}: ${isAuth ? userState.email : _email.current?.value}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${isAuth ? userState.phone : _phone.current?.value}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${_message.current.value}`;
        const text = `${lang === 'en' ? 'New message' : 'Новое сообщение'}:${textOrder}\n ${files.length > 0 ? (lang==='en' ? `\nAttached files ${files.length}:` : `\nПрикрепленные файлы ${files.length}:`) : ''}`

        setState.user.sendMessage({text, files})
    }


    useEffect(() => {
        if (userState.sendOrder.status === 'success' || userState.sendOrder.status === 'error') { //show modal after fetch with the fetch result 
            messageRef.current?.update(modalMessageCreator(userState.sendOrder, lang))
            modalMessageRef.current?.openModal('order')
        }
    }, [userState.sendOrder.status])



    useEffect(() => {       
        focuser.create({container: processedContainer})
    }, [userState.auth.status, lang])



    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
    }


    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="page_order">
                        <h1>{lang === 'en' ? 'Send us a message' : 'Написать нам'}</h1>
                        <div className="order__block">

                            <form className="order__container" data-selector="contact-form">
                                <div className="data-block">

                                    <div className="inputs-block">
                                        {userState.auth.status !== 'success' && 
                                            <div className="input-block" data-selector="input-block">
                                                <label htmlFor="name">{lang === 'en' ? 'Your name*' : 'Ваше имя*'}</label>
                                                <input 
                                                    data-selector="input"
                                                    className="input-element" 
                                                    id="name" 
                                                    type="text" 
                                                    ref={_name} 
                                                    onKeyDown={(e) => focuser.next(e)}
                                                    onChange={onChangeText}
                                                    onBlur={(e) => inputChecker({lang, min:inputsProps.name.min, max:inputsProps.name.max, el: e.target})}/>
                                            </div>}
                                            
                                        {userState.auth.status !== 'success' && 
                                            <div className="input-block" data-selector="input-block">
                                                <label htmlFor="phone">{lang === 'en' ? 'Your phone' : 'Ваш телефон'}</label>
                                                <input 
                                                    data-selector="input"
                                                    className="input-element" 
                                                    id="phone"
                                                    type="tel" 
                                                    ref={_phone} 
                                                    onKeyDown={(e) => focuser.next(e)}
                                                    onChange={onChangeText}
                                                    onBlur={(e) => inputChecker({lang, min:inputsProps.phone.min, max:inputsProps.phone.max, type: 'phone', el: e.target})}/>
                                            </div>
                                        }

                                        {userState.auth.status !== 'success' && 
                                            <div className="input-block" data-selector="input-block">
                                                <label htmlFor="email">{lang === 'en' ? 'Your email*' : 'Ваша почта*'}</label>
                                                <input 
                                                    data-selector="input"
                                                    className="input-element" 
                                                    id="email" 
                                                    type="email" 
                                                    ref={_email} 
                                                    onKeyDown={(e) => focuser.next(e)}
                                                    onChange={onChangeText}
                                                    onBlur={(e) => inputChecker({lang, min:inputsProps.email.min, max:inputsProps.email.max,  type: 'email', el: e.target})}/>
                                            </div>
                                        }
                                        <div className="input-block message-block" data-selector="input-block">
                                            <label htmlFor="message">
                                                {lang === 'en' ? 'Your message (at least 10 symbols)*' : 'Ваше сообщение (минимум 10 символов)*'}
                                            </label>
                                            <textarea 
                                                data-selector="input"
                                                className="input-element" 
                                                id="message" 
                                                ref={_message} 
                                                onChange={onChangeText}
                                                onBlur={(e) => inputChecker({lang, min:inputsProps.message.min, max:inputsProps.message.max, el: e.target})}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="files">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                            <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='files'/>
                                        </div>
                                    </div>

                                </div>

                                <button 
                                    type="submit" 
                                    disabled={userState.sendOrder.status === 'fetching'} 
                                    className="button_order" 
                                    onClick={onSubmit}>
                                        {lang === 'en' ? 'Send' : "Отправить"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal escExit={true} ref={modalMessageRef} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
            </Modal>
        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs)
