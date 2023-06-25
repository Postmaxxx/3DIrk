import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { IColorsState, IFibersState, IFullState, IOrderState, TLang, TLangText } from "src/interfaces";
import { useEffect, useRef, useCallback, useMemo } from 'react'
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from "../../components/Message/Message";
import CartContent from "../../components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "src/redux/actions/all";
import { headerStatus, resetFetch, timeModalClosing } from "src/assets/js/consts";
import { errorsChecker, prevent } from "src/assets/js/processors";


interface IPropsState {
    lang: TLang,
    orderState: IOrderState
    colorsState: IColorsState
    fibersState: IFibersState
}

interface IPropsActions {
    setState: {
        order: typeof allActions.order
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Order:React.FC<IProps> = ({lang, orderState, colorsState, fibersState, setState}): JSX.Element => {

    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)


    const closeModalMessage = useCallback(() => {
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (orderState.send.status === 'success') {
            setState.order.clearForm();
            addFiles.current?.clearAttachedFiles()
            setState.order.clearCart()
        }
        setState.order.setSendOrder(resetFetch)
        errChecker.clear()
	}, [orderState.send.status])


    const errChecker = useMemo(() => errorsChecker({lang}), [lang])


    const informer = (info: TLangText): void => {
        if (!message.current) return
        message.current.update({
            header:  lang === 'en' ? "Sending order..." : "Отправка заказа...",
            status: '',
            text: [info[lang]]
        })
        modal_message.current?.openModal()
    }

    

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!_name.current || !_email.current || !_phone.current || !_message.current || !message.current || !modal_message.current || !addFiles.current) return
        prevent(e)
        errChecker.check(_name.current, 2, 40)
        errChecker.check(_email.current, 6, 70)
        errChecker.check(_phone.current, 6, 20)
        errChecker.check(_message.current, 0, 3000)

        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal_message.current.openModal()
            return
        }

        setState.order.setFiles(addFiles.current.getFiles())
        /*
        const textCart = orderState.cart.items.reduce((text: string, item: ICartItem, i: number) => {
            return text + `${i+1}) ${item.product.name[lang]}
${lang === 'en' ? 'Options' : 'Версия'}: ${item.type} 
${lang === 'en' ? 'Fiber' : 'Материал'}: ${fibersState.fibersList.find(fiberItem => fiberItem._id === item.fiber)?.short.name[lang]}
${lang === 'en' ? 'Color' : 'Цвет'}: ${colorsState.colors.find(color => color._id === item.color)?.name[lang]}
${lang === 'en' ? 'Amount' : 'Количество'}: ${item.amount}\n\n`
        }, '')

        const textOrder: string = `
${lang === 'en' ? 'Date' : 'Дата'}: ${currentDate.toISOString().slice(0,10)}
${lang === 'en' ? 'Time' : 'Время'}: ${currentDate.toISOString().slice(11, 19)}
${lang === 'en' ? 'Name' : 'Имя'}: ${orderState.name}
${lang === 'en' ? 'Email' : 'Почта'}: ${orderState.email}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${orderState.phone}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${orderState.message}`;



        const text = `${lang === 'en' ? 'New order' : 'Новый заказ'}:${textOrder}\n\n\n ${lang === 'en' ? 'Cart content' : 'Содержимое корзины'}: \n${textCart}${orderState.files.length > 0 ? (lang==='en' ? '\n\n\nAttached files:' : '\n\n\nПрикрепленные файлы:') : ''}`
    */
        //setState.order.sendOrder({lang, text, filesArr: orderState.files, informer})
        setState.order.sendOrder(informer)
    }






    useEffect(() => {
        if (orderState.send.status === 'success' || orderState.send.status === 'error') {
            const errors: string[] = orderState.send.errors?.map(e => e[lang]) || []
            message.current?.update({
                header: headerStatus[orderState.send.status][lang],
                status: orderState.send.status,
                text: [orderState.send.message[lang], ...errors]
            })
            modal_message.current?.openModal()
        }
    }, [orderState.send.status])



    const focusNext = ({e, target}: {e: KeyboardEvent, target: HTMLInputElement | HTMLTextAreaElement | null}) => {
        /*prevent(e)
        if (e.key === 'Enter') {
            //target?.focus();
        }*/
    }


    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const key = e.target.id as "name" | "email" | "phone" | "message"
        setState.order.setText({[key]: e.target.value})
        errChecker.clearError(e.target)
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
                                                ref={_name} 
                                                value={orderState.name}
                                                onChange={onChangeText}/>
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
                                                value={orderState.phone}
                                                onChange={onChangeText}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="email">
                                                {lang === 'en' ? 'Your email*' : 'Ваша почта*'}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="email" 
                                                type="email" 
                                                value={orderState.email}
                                                ref={_email} 
                                                onChange={onChangeText}/>
                                        </div>
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {lang === 'en' ? 'Information about the order (at least 10 symbols)*' : 'Информация о заказе (минимум 10 символов)*'}
                                            </label>
                                            <textarea 
                                                className="input-element" 
                                                id="message" 
                                                ref={_message} 
                                                value={orderState.message}
                                                onChange={onChangeText}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="allImages">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                            <AddFiles lang={lang} ref={addFiles} multiple={true} id='allImages'/>
                                        </div>
                                    </div>

                                </div>

                                <div className="cart-content__container">
                                    <h3>{lang === 'en' ? 'Your cart' : 'Ваша корзина'}</h3>
                                    <CartContent />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={orderState.cart.load.status !== 'success' || fibersState.load.status !== 'success' || colorsState.load.status !== 'success' || orderState.send.status === 'fetching'} 
                                    className="button_order" 
                                    onClick={onSubmit}>
                                        {lang === 'en' ? 'Order' : "Отправить"}
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
    orderState: state.order,
    colorsState: state.colors,
    fibersState: state.fibers,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		order: bindActionCreators(allActions.order, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
