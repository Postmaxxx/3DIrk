import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { ICartState, IColorsState, IFetch, IFibersState, IFullState, TLang, TLangText } from "src/interfaces";
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
    colorsState: IColorsState
    fibersState: IFibersState
    cart: ICartState
    sendOrder: IFetch,
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Order:React.FC<IProps> = ({lang, cart, sendOrder, colorsState, fibersState, setState}): JSX.Element => {
    const _message = useRef<HTMLTextAreaElement>(null)
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const addFiles = useRef<IAddFilesFunctions>(null)


    const closeModalMessage = useCallback(() => {
        if (!_message.current) return
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (sendOrder.status === 'success') {
            addFiles.current?.clearAttachedFiles()
            _message.current.value = ''
            setState.user.setCart([])
        }
        setState.user.setSendOrder(resetFetch)
        errChecker.clear()
	}, [sendOrder.status])


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
        if (!_message.current || !message.current || !modal_message.current || !addFiles.current) return
        prevent(e)
        errChecker.check(_message.current, 0, 3000)

        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal_message.current.openModal()
            return
        }

        setState.user.sendOrder({
            message: _message.current.value,
            files: addFiles.current.getFiles(),
            informer
        })
    }


    useEffect(() => {
        if (sendOrder.status === 'success' || sendOrder.status === 'error') {
            const errors: string[] = sendOrder.errors?.map(e => e[lang]) || []
            message.current?.update({
                header: headerStatus[sendOrder.status][lang],
                status: sendOrder.status,
                text: [sendOrder.message[lang], ...errors]
            })
            modal_message.current?.openModal()
        }
    }, [sendOrder.status])


    useEffect(() => {
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }
    }, [colorsState.load.status])


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
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {lang === 'en' ? 'Information about the order' : 'Информация о заказе'}
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
                                    disabled={cart.load.status !== 'success' || fibersState.load.status !== 'success' || colorsState.load.status !== 'success' || sendOrder.status === 'fetching'} 
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
    cart: state.user.cart,
    sendOrder: state.user.sendOrder,
   // message: state.user.message,
    colorsState: state.colors,
    fibersState: state.fibers,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
