import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { ICartItem, ICartState, ICheckErrorItem, IColorsState, IFibersState, IFullState, IModal, IOrderState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react'
import Modal from "../../components/Modal/Modal";
import MessageInfo from "../../components/MessageInfo/MessageInfo";
import { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus }  from "../../redux/actions/order"
import CartContent from "../../components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { loadFibers } from "../../redux/actions/fibers"
import { loadColors } from "../../redux/actions/colors"
import { clearCart } from "../../redux/actions/cart"
import inputChecker from "src/assets/js/inputChecker";

const actionsListOrder = { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus  }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }
const actionsListCart = { clearCart }


interface IPropsState {
    lang: TLang,
    order: IOrderState
    cart: ICartState
    colors: IColorsState
    fibers: IFibersState
}

interface IPropsActions {
    setState: {
        order: typeof actionsListOrder
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
        cart: typeof actionsListCart,
    }
}

interface IProps extends IPropsState, IPropsActions {}


interface IMessage {
    status: string
    header: string
    text: string[]
}



const Order:React.FC<IProps> = ({lang, order, cart, colors, fibers, setState}): JSX.Element => {

    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
	const [modal, setModal] = useState<IModal>({visible: false})
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const [message, setMessage] = useState<IMessage>({status: '', header: '', text: []})


    const closeModal = () => {
		setModal({visible: false})
        if (order.dataSending.status === 'success') {
            setState.order.clearFiles();
            setState.order.clearForm();
            addFilesRef.current?.clearAttachedFiles()
            setState.cart.clearCart()
        }
        setState.order.setSendDataStatus({status: 'idle', message: ''})
	}


    const checkErrors = (): boolean => {
        const feildsToCheck: Array<ICheckErrorItem> = [
            {ref: _name, name: {en: 'Your name', ru: 'Ваше имя'}},
            {ref: _email, name: {en: 'Your email', ru: 'Ваша почта'}},
            {ref: _phone, name: {en: 'Your phone', ru: 'Ваш телефон'}},
            {ref: _message, name: {en: 'Information about the order', ru: 'Информация о заказе'}},
        ]
        const {isWrong, header, errors} = inputChecker(feildsToCheck)
        setMessage({status: 'error', header: header[lang], text: errors.map(error => error[lang])})
        return isWrong
    }


        
    const preventDefaults = (e: DragEvent | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        preventDefaults(e)
        const currentDate: Date = new Date();
        const name:string =  order.name;
        const phone:string = order.phone;
        const email:string = order.email;
        const message:string = order.message;
        if (checkErrors()) {
            setModal({visible: true})
            return
        }
        
        const textCart = cart.items.reduce((text: string, item: ICartItem, i: number) => {
            
            return text + `${i+1}) ${item.product.name[lang]}
${lang === 'en' ? 'Options' : 'Версия'}: ${item.type} 
${lang === 'en' ? 'Fiber' : 'Материал'}: ${fibers.fibersList.find(fiberItem => fiberItem.id === item.fiber)?.short.name[lang]}
${lang === 'en' ? 'Color' : 'Цвет'}: ${colors.colors.find(color => color.id === item.color)?.name[lang]}
${lang === 'en' ? 'Amount' : 'Количество'}: ${item.amount}\n\n`
        }, '')

        const textOrder: string = `
${lang === 'en' ? 'Date' : 'Дата'}: ${currentDate.toISOString().slice(0,10)}
${lang === 'en' ? 'Time' : 'Время'}: ${currentDate.toISOString().slice(11, 19)}
${lang === 'en' ? 'Name' : 'Имя'}: ${name}
${lang === 'en' ? 'Email' : 'Почта'}: ${email}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${phone}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${message}`;

        const text = `${lang === 'en' ? 'New order' : 'Новый заказ'}:${textOrder}\n\n\n ${lang === 'en' ? 'Cart content' : 'Содержимое корзины'}: \n${textCart}${order.files.length > 0 ? (lang==='en' ? '\n\n\nAttached files:' : '\n\n\nПрикрепленные файлы:') : ''}`
        
        setState.order.sendOrder({lang, text, filesArr: order.files, cart, informer})
    }


    const informer = (message: TLangText) => {
        setMessage({
            status: '',
            header: lang === 'en' ? "Sending order..." : "Отправка заказа...",
            text: [message[lang]],
        })
        setModal({visible: true})
    }


    useEffect(() => {
        if (order.dataSending.status === 'success' || order.dataSending.status === 'error') {
            setMessage({
                status: order.dataSending.status,
                header: order.dataSending.status === 'success' ? lang === 'en' ? "Success" : "Отправлено" : lang === 'en' ? "Error" : "Ошибка",
                text: [order.dataSending.message],
            })
            setModal({visible: true})
        }
    }, [order.dataSending.status])





    const clearError = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
        (e.target as HTMLElement).parentElement?.classList.remove('error')
    }


    const focusNext = ({e, target}: {e: KeyboardEvent, target: HTMLInputElement | HTMLTextAreaElement | null}) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            target?.focus();
        }
    }


    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        switch (e.target.id) {
            case "name":
                setState.order.setName(e.target.value)
                break;
            case "phone":
                setState.order.setPhone(e.target.value)
                break;
            case "email":
                setState.order.setEmail(e.target.value)
                break;
            case "message":
                setState.order.setMessage(e.target.value)
                break;
            default:
                break;
        }
        clearError(e)
    }


    const saveFiles = (files: File[]) => {
        setState.order.clearFiles()
        setState.order.addFiles(files)
    }


    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="page_order">
                        <h1>{lang === 'en' ? 'Order 3D printing' : 'Заказать 3D печать'}</h1>
                        <div className="order__block">

                            <form className="order__container">
                                <h2>{lang === 'en' ? 'Additional information' : 'Дополнительная информация'}</h2>
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
                                                required 
                                                minLength={2} 
                                                maxLength={25} 
                                                ref={_name} 
                                                value={order.name}
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _phone.current})}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="phone">
                                                {lang === 'en' ? 'Your phone' : 'Ваш телефон'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="phone"
                                                type="tel" 
                                                minLength={6} 
                                                maxLength={25} 
                                                ref={_phone} 
                                                value={order.phone}
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _email.current})}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="email">
                                                {lang === 'en' ? 'Your email*' : 'Ваша почта*'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="email" 
                                                type="email" 
                                                required 
                                                value={order.email}
                                                ref={_email} 
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _message.current})}/>
                                        </div>
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {lang === 'en' ? 'Information about the order (at least 10 symbols)*' : 'Информация о заказе (минимум 10 символов)*'}
                                            </label>
                                            <textarea 
                                                className="input-element" 
                                                id="message" 
                                                required 
                                                minLength={10} 
                                                maxLength={1000} 
                                                ref={_message} 
                                                value={order.message}
                                                onChange={onChangeText}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="files">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                            <AddFiles saveFiles={saveFiles} lang={lang} ref={addFilesRef}/>
                                        </div>
                                    </div>

                                </div>

                                <div className="cart-content__container">
                                    <h3>{lang === 'en' ? 'Your cart' : 'Ваша корзина'}</h3>
                                    <CartContent />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={cart.dataLoading.status !== 'success' && fibers.dataLoading.status !== 'success' && colors.dataLoading.status !== 'success' && order.dataSending.status !== 'sending'} 
                                    className="button_order" 
                                    onClick={onSubmit}>
                                        {lang === 'en' ? 'Order' : "Отправить"}
                                    </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
				<MessageInfo {...{
                    status: message.status,
                    header: message.header,
                    text: message.text, 
                    buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                    buttonAction: closeModal
                }}/>
			</Modal> 
        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    order: state.order,
    cart: state.cart,
    colors: state.colors,
    fibers: state.fibers,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		order: bindActionCreators(actionsListOrder, dispatch),
		colors: bindActionCreators(actionsListColors, dispatch),
		fibers: bindActionCreators(actionsListFibers, dispatch),
		cart: bindActionCreators(actionsListCart, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
/*
                        <div className="img__container">
                            <img src={imgSide} alt="" />
                        </div>
*/