import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './contact-us.scss'
import {  IFullState,  IUserState, TLang, TLangText } from "../../interfaces";
import {  useEffect, useRef, useMemo, useCallback } from 'react'
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import Message, { IMessageFunctions } from "../../components/Message/Message";
import { headerStatus, resetFetch } from "../../assets/js/consts";
import { errorsChecker, prevent } from "../../assets/js/processors";


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
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const closeModalMessage = useCallback(() => {
        if (!_name.current || !_email.current || !_phone.current || !_message.current || !addFiles.current ) return
        modal_message.current?.closeModal()
        if (userState.sendOrder.status === 'success') {
            _name.current.value = ''
            _email.current.value = ''
            _phone.current.value = ''
            _message.current.value = ''
            addFiles.current.clearAttachedFiles()
        }
        errChecker.clear()
        setState.user.setSendOrder(resetFetch)
	}, [userState.sendOrder.status, errChecker])



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_name.current || !_email.current || !_phone.current || !_message.current || !addFiles.current) return
        const currentDate: Date = new Date();
        errChecker.check(_name.current, 2, 50)
        errChecker.check(_email.current, 6, 60)
        errChecker.check(_phone.current, 6, 20)
        errChecker.check(_message.current, 10, 3000)
        
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal_message.current?.openModal()
            return
        }
        const files2 = addFiles.current.getFiles()
        
/*
        const textOrder: string = `
${lang === 'en' ? 'Date' : 'Дата'}: ${currentDate.toISOString().slice(0,10)}
${lang === 'en' ? 'Time' : 'Время'}: ${currentDate.toISOString().slice(11, 19)}
${lang === 'en' ? 'Name' : 'Имя'}: ${name}
${lang === 'en' ? 'Email' : 'Почта'}: ${email}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${phone}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${message}`;

        const text = `${lang === 'en' ? 'New message' : 'Новое сообщение'}:${textOrder}\n\n\n ${order.files.length > 0 ? (lang==='en' ? '\n\n\nAttached files:' : '\n\n\nПрикрепленные файлы:') : ''}`
        
        setState.order.sendOrder({lang, text, filesArr: order.files, informer})*/
    }



/*
    const informer = (info: TLangText): void => {
        if (!message.current) return
        message.current.update({
            header:  lang === 'en' ? "Sending message..." : "Отправка сообщения...",
            status: '',
            text: [info[lang]]
        })
        modal_message.current?.openModal()
    }

*/



    useEffect(() => {
        if (userState.sendOrder.status === 'success' || userState.sendOrder.status === 'error') {
            const errors: string[] = userState.sendOrder.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[userState.sendOrder.status][lang],
                status: userState.sendOrder.status,
                text: [userState.sendOrder.message[lang], ...errors]
            })
            modal_message.current?.openModal()
        }
    }, [userState.sendOrder.status])




    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="page_order">
                        <h1>{lang === 'en' ? 'Send us a message' : 'Написать нам'}</h1>
                        <div className="order__block">

                            <form className="order__container">
                                <div className="data-block">

                                    <div className="inputs-block">
                                        <div className="input-block">
                                            <label htmlFor="name">
                                                {lang === 'en' ? 'Your name*' : 'Ваше имя*'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="name" 
                                                type="text" 
                                                ref={_name} 
                                                onChange={(e) => errChecker.clearError(e.target)}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="phone">
                                                {lang === 'en' ? 'Your phone' : 'Ваш телефон'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="phone"
                                                type="tel" 
                                                ref={_phone} 
                                                onChange={(e) => errChecker.clearError(e.target)}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="email">
                                                {lang === 'en' ? 'Your email*' : 'Ваша почта*'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="email" 
                                                type="email" 
                                                ref={_email} 
                                                onChange={(e) => errChecker.clearError(e.target)}/>
                                        </div>
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {lang === 'en' ? 'Your message (at least 10 symbols)*' : 'Ваше сообщение (минимум 10 символов)*'}
                                            </label>
                                            <textarea 
                                                className="input-element" 
                                                id="message" 
                                                ref={_message} 
                                                onChange={(e) => errChecker.clearError(e.target)}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="files">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                            <AddFiles lang={lang} ref={addFiles} multiple={true} id='files'/>
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
            <Modal escExit={true} ref={modal_message} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
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
