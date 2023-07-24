import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { ICartItem, ICartState, IColor, IColorsState, IFetch, IFiber, IFibersState, IFullState, TLang } from "../../interfaces";
import { useEffect, useRef, useCallback, useMemo } from 'react'
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from "../../components/Message/Message";
import CartContent from "../../components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import { inputsProps, resetFetch, timeModalClosing} from "../../assets/js/consts";
import { checkAndLoad, focusMover, modalMessageCreator, prevent } from "../../assets/js/processors";
import inputChecker from "../../../src/assets/js/inputChecker";

interface IPropsState {
    lang: TLang,
    colorsState: IColorsState
    fibersState: IFibersState
    cart: ICartState
    sendOrder: IFetch
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
    const modalMessageRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _formOrder = useRef<HTMLFormElement>(null)

    const focuser = useMemo(() => focusMover(), [lang])


    const closeModalMessage = useCallback(() => {
        if (!_message.current) return
        modalMessageRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (sendOrder.status === 'success') {
            addFilesRef.current?.clearAttachedFiles()
            _message.current.value = ''
            setState.user.setCart({items: []})
        }
        setState.user.setSendOrder(resetFetch)
	}, [sendOrder.status])

 

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!_message.current || !messageRef.current || !modalMessageRef.current || !addFilesRef.current || !_formOrder.current) return
        //await checkCartIsActual(cart)
        prevent(e)
        //check errors
        focuser.focusAll();//run over all elements to get all errors
        const errorFields = _formOrder.current.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) return
        setState.user.sendOrder({
            message: _message.current.value,
            files: addFilesRef.current.getFiles(),
        })
    }


    useEffect(() => {
        if (sendOrder.status === 'success' || sendOrder.status === 'error') {
            messageRef.current?.update(modalMessageCreator(sendOrder, lang))
            modalMessageRef.current?.openModal('order')
        }
    }, [sendOrder.status])


    useEffect(() => {
        checkAndLoad({
			fetchData: colorsState.load,
			loadFunc: setState.colors.loadColors,
		})
    }, [colorsState.load.status])


    useEffect(() => {
        if (!_formOrder.current) return
        focuser.create({container: _formOrder.current})
    }, [lang])



    const checkCartIsActual = async (cart: ICartState) => {
        //await setState.user.checkCart()
        /*await checkAndLoad({
            fetchData: colorsState.load,
			loadFunc: setState.colors.loadColors,
            force: true
		})
        await checkAndLoad({
            fetchData: fibersState.load,
			loadFunc: setState.fibers.loadFibers,
            force: true
		})
        const wrongProducts: ICartItem[] = []
        const newCartItems = [...cart.items]
        newCartItems.filter(item => {
            const fiber: IFiber | undefined = fibersState.fibersList.find(fiberItem => fiberItem._id === item.fiber)
            const color: IColor | undefined = colorsState.colors.find(color => color._id === item.color)
            if (fiber && color) {
                
                return true
            } else {
                wrongProducts.push(item)
                return false
            }
        })*/


    }


    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
    }


    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <h1>{lang === 'en' ? 'Order 3D printing' : 'Заказать 3D печать'}</h1>
                    <div className="order__block">
                        <form className="order__container" ref={_formOrder} >
                            <h2>{lang === 'en' ? 'Additional information' : 'Дополнительная информация'}</h2>
                            <div className="data-block">
                                <div className="inputs-block">
                                    <div className="input-block message-block" data-selector="input-block">
                                        <label htmlFor="message">
                                            {lang === 'en' ? 'Information about the order' : 'Информация о заказе'}
                                        </label>
                                        <textarea 
                                            data-selector="input"
                                            className="input-element" 
                                            id="message" 
                                            ref={_message}
                                            onChange={onChangeText}
                                            onBlur={(e) => inputChecker({lang, min:0, max:inputsProps.message.max, el: e.target})}/>
                                    </div>
                                </div>
                                <div className="files-block">
                                    <div className="input-block files">
                                        <label htmlFor="allImages">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
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
            <Modal escExit={true} ref={modalMessageRef} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
            </Modal>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    cart: state.user.cart,
    sendOrder: state.user.sendOrder,
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
