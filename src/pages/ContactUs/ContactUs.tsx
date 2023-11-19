import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './contact-us.scss'
import {  IFullState,  IUserState, TLang } from "../../interfaces";
import {  useEffect, useRef, useCallback } from 'react'
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import { inputsProps, nwsp, resetFetch } from "../../assets/js/consts";
import { deepCopy, modalMessageCreator, prevent } from "../../assets/js/processors";
import { IModalFunctions } from "../../components/Modal/Modal";
import Message from "../../components/Message/Message";
import Preloader from "../../../src/components/Preloaders/Preloader";
import logo_vk from '../../assets/img/logo_vk.svg';
import logo_tg from '../../assets/img/logo_telegram.svg';
import locationMap from '../../assets/img/address_scheme.jpg';
import locationMapSmall from '../../assets/img/address_scheme_small.webp';
import ImageModal from "../../components/ImageModal/ImageModal";
import svgs from "../../components/additional/svgs";
import Uploader from "../../../src/components/Preloaders/Uploader";
import BlockInput, { IBlockInputFunctions } from "../../components/BlockInput/BlockInput";

interface IPropsState {
    lang: TLang,
    userState: IUserState
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ContactUs:React.FC<IProps> = ({lang, userState, modal, setState}): JSX.Element => {
    const _name = useRef<IBlockInputFunctions>(null)
    const _email = useRef<IBlockInputFunctions>(null)
    const _phone = useRef<IBlockInputFunctions>(null)
    const _message = useRef<IBlockInputFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _formContact = useRef<HTMLDivElement>(null)
    
    const closeModal = useCallback(async () => {
        if (!_message.current || !addFilesRef.current ) return
        if (userState.sendOrder.status === 'success') { //clear all inputs
            [_name, _email, _phone, _message].map(el => el.current?.setValue(''))
            addFilesRef.current.clearAttachedFiles()
        }
        modal?.closeCurrent()
        setState.user.setSendOrder(deepCopy(resetFetch))
	}, [userState.sendOrder.status])



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {  
        prevent(e)
        const isAuth: boolean = userState.auth.status === 'success' ? true : false
        if (!addFilesRef.current || !_formContact.current) return

        //check errors
        const errors: string[] = [_name, _email, _phone, _message]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]
        
        if (errors.length > 0) { //show modal with error
            return modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModal,
                children: <Message 
                    header={lang === 'en' ? 'Errors was found' : 'Найдены ошибки'}
                    status={'error'}
                    text={errors}
                    buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
                />
            })
        }
        
        const files: File[] = addFilesRef.current.getFiles() // attached files
        const textOrder: string = 
`${lang === 'en' ? 'New message' : 'Новое сообщение'}:
${lang === 'en' ? 'Name' : 'Имя'}: ${isAuth ? userState.name : _name.current?.getValue()}
${lang === 'en' ? 'Email' : 'Почта'}: ${isAuth ? userState.email : _email.current?.getValue()}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${isAuth ? userState.phone : _phone.current?.getValue()}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${_message.current?.getValue()}`;
        const text: string = `${lang === 'en' ? 'New message' : 'Новое сообщение'}:${textOrder}\n ${files.length > 0 ? (lang==='en' ? `\nAttached files ${files.length}:` : `\nПрикрепленные файлы ${files.length}:`) : ''}`
        setState.user.sendMessage({text, files})
    }



    useEffect(() => {
        if (userState.sendOrder.status === 'success' || userState.sendOrder.status === 'error') { //show modal after fetch with the fetch result 
            modal?.closeName('messageSending');
            modal?.openModal({
                name: 'messageSend',
                onClose: closeModal,
                children: <Message {...modalMessageCreator(userState.sendOrder, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (userState.sendOrder.status === 'fetching') {
            modal?.openModal({
                name: 'messageSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending message, please wait..." : "Отправка сообщения, пожалуйста ждите..."}/>
            })
        }
    }, [userState.sendOrder.status])



    const onLocationClick = (): void => {
        modal?.openModal({
            name: 'location',
            children: <ImageModal url={locationMap} text={lang === 'en' ? 'Irkutsk city, Gertcena street, 14' : 'г. Иркутск, Улица Герцена, 14'}/>
        })
    }


    return (
        <div className="page_contact">
            <div className='container_page'>
                <div className="container">
                    <div className="block_text">
                        <h1 data-testid='contactHeader'>{lang === 'en' ? 'Contact us' : 'Свяжитесь с нами'}</h1>
                    </div>
                        <div className="form_full contact__form" ref={_formContact}>
                            <div className="block_text">
                                <h3 data-testid='contactSubheader'>{lang === 'en' ? 'Strezhen' : 'Компания Стрежень'}</h3>
                                <div className="contacts">
                                    <div className="location">
                                        <img data-testid='contactMapImg' src={locationMapSmall} alt={lang === 'en' ? 'Location map' : 'Схема проезда'} onClick={onLocationClick}/>
                                        <a data-testid='mapLink' href={lang === 'en' ? "https://goo.gl/maps/89SfgdnrPWB8kbDJA" : "https://go.2gis.com/uy5m3"} target="_blank">{lang === 'en' ? `Irkutsk city, Gertcena${nwsp}street,${nwsp}14` : `г. Иркутск, Улица${nwsp}Герцена,${nwsp}14`} {svgs().iconRoute2}</a>
                                    </div>
                                    <div className="contacts__list">
                                        <div className="contact">
                                            <div className="img-wrapper">
                                                {svgs().iconPhone}
                                            </div>
                                            <a href="tel:+79834088949" aria-label={lang === 'en' ? 'Call us' : 'Позвонить нам'}>+7 983 408 89 49</a>
                                        </div>
                                        <div className="contact">
                                            <div className="img-wrapper">
                                                <img src={logo_vk} alt="VK" />
                                            </div>
                                            <a href="vk.com" aria-label={lang === 'en' ? 'Contact us via VK' : 'Связаться с нами через ВК'}>{lang === 'en' ? "Strezhen" : 'Стрежень'}</a>
                                        </div>
                                        <div className="contact">
                                            <div className="img-wrapper">
                                                <img src={logo_tg} alt="Telegram" />
                                            </div>
                                            <a href="telegram.org" aria-label={lang === 'en' ? 'Contact us via Telegram' : 'Связаться с нами через Telegram'}>{lang === 'en' ? "Out group" : 'Наша группа'}</a>
                                        </div>
                                        <div className="contact">
                                            <div className="img-wrapper">
                                                {svgs().iconEmail}
                                            </div>
                                            <a href="mailto:pypkin@mail.ru"  aria-label={lang === 'en' ? 'Contact us via email' : 'Связаться с нами через электронную почту'}>vasya_pypkin@mail.ru</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Write us a message' : 'Напишите нам сообщение'}</h3>
                            </div>
                            <div className="form__inputs">
                                <div className="form__inputs__texts">
                                    {userState.auth.status !== 'success' && <>
                                        <BlockInput 
                                            lang={lang}
                                            labelText={{en: 'Your name', ru: 'Ваше имя'}}
                                            required
                                            id="contacter_name"
                                            rules={{min:inputsProps.name.min, max:inputsProps.name.max}}
                                            ref={_name}
                                        />
                                        <BlockInput 
                                            lang={lang}
                                            labelText={{en: 'Your phone', ru: 'Ваш телефон'}}
                                            id="contacter_phone"
                                            inputType="text"
                                            rules={{min:inputsProps.phone.min, max:inputsProps.phone.max, type:'phone'}}
                                            ref={_phone}
                                        />
                                        <BlockInput 
                                            lang={lang}
                                            labelText={{en: 'Your email', ru: 'Ваша почта'}}
                                            required
                                            inputType="email"
                                            id="contacter_email"
                                            rules={{min:inputsProps.email.min, max:inputsProps.email.max, type: 'email'}}
                                            ref={_email}
                                        />
                                    </>}
                                    <BlockInput
                                        lang={lang}
                                        labelText={{en: 'Your message', ru: 'Ваше сообщение'}}
                                        required
                                        expandable
                                        typeElement="textarea"
                                        id="contacter_message"
                                        rules={{min:inputsProps.message.min, max:inputsProps.message.max}}
                                        ref={_message}
                                    />
                                </div>
                                <div className="form__inputs__files">
                                    <div className="block_input files">
                                        <label htmlFor="files">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='files'/>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                data-testid='contactSendMessage'
                                disabled={userState.sendOrder.status === 'fetching'} 
                                className="button_blue button_contact" 
                                onClick={onSubmit}>
                                    {userState.sendOrder.status === 'fetching' ? 
                                        <Preloader />
                                        :
                                        lang === 'en' ? 'Send message' : "Отправить сообщение" 
                                    }
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs)
