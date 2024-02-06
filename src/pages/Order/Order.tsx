import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { ICartState, IFetch, IFullState, TLang } from "../../interfaces";
import { useEffect, useRef, useCallback } from 'react'
import CartContent from "../../components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import { inputsProps, resetFetch} from "../../assets/js/consts";
import { deepCopy, modalMessageCreator, prevent } from "../../assets/js/processors";
import { IModalFunctions } from "../../components/Modal/Modal";
import Message from "../../components/Message/Message";
import Uploader from "../../../src/components/Preloaders/Uploader";
import BlockInput, { IBlockInputFunctions } from "../../components/BlockInput/BlockInput";

interface IPropsState {
    lang: TLang,
    colorsLoad: IFetch
    fibersLoad: IFetch
    cart: ICartState
    sendOrder: IFetch
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}



const Order:React.FC<IProps> = ({lang, cart, sendOrder, colorsLoad, fibersLoad, modal, setState}): JSX.Element => {
    const _message = useRef<IBlockInputFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _formOrder = useRef<HTMLDivElement>(null)


    const closeModal = useCallback(async () => {        
        if (await modal?.getName() === 'orderSend') {
            if (sendOrder.status === 'success') {
                addFilesRef.current?.clearAttachedFiles()
                setState.user.setCart({items: []})
                _message.current?.setValue('')
            }
            setState.user.setSendOrder(deepCopy(resetFetch))
        }
        if (await modal?.getName() === 'cartFixer') {
            setState.user.setSendOrder(deepCopy(resetFetch))
        }
        modal?.closeCurrent()
	}, [sendOrder.status])

 

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if (!_message.current ||  !modal || !addFilesRef.current || !_formOrder.current) return
        prevent(e)
        //check errors
        const errors: string[] = [_message]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]
            
        cart.items.length === 0 && errors.push(lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста')
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
        setState.user.sendCart() //update cart before order
        setState.user.sendOrder({
            message: _message.current.getValue(),
            files: addFilesRef.current.getFiles(),
        })
    }


    useEffect(() => {
        if (cart.fixed?.length === 0) return //nothing was fixed
        modal?.openModal({
            name: 'cartFixer',
            onClose: closeModal,
            children: <Message 
                header={lang === 'en' ? "Warning" :  "Внимание"}
                status='warning'
                text={[lang === 'en' ? 
                    'Some items have been removed from your cart as unavalable for order:' 
                    : 'Некоторые товары были удалены из вашей корзины т.к. они больше недоступны для заказа:',
                ...cart.fixed?.map((item, i) => (`${i+1}) ${item[lang]}`))]}
                buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
            />
        })
    }, [cart.fixed])



        
    useEffect(() => {
        if (sendOrder.status === 'success' || sendOrder.status === 'error') {
            modal?.closeName('orderSending');
            modal?.openModal({ //if error/success - show modal about send order
                name: 'orderSend',
                onClose: closeModal,
                children: <Message {...modalMessageCreator(sendOrder, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (sendOrder.status === 'fetching') {
            modal?.openModal({
                name: 'orderSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending order, please wait..." : "Отправка заказа, пожалуйста ждите..."}/>
            })
        }
    }, [sendOrder.status])


    useEffect(() => {
        if (colorsLoad.status !== 'success' && colorsLoad.status  !== 'fetching') {
            setState.colors.loadColors()
        }
    }, [])

    
    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="block_text">
                        <h1>{lang === 'en' ? 'Order 3D printing' : 'Заказать 3D печать'}</h1>
                    </div>
                    <div className="form_full form_order" ref={_formOrder} >
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Additional information' : 'Дополнительная информация'}</h3>
                        </div>
                        <div className="form__inputs">
                            <div className="form__inputs__texts">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Information about the order', ru: 'Информация о заказе'}}
                                    expandable
                                    typeElement="textarea"
                                    id="order_message"
                                    rules={{min:inputsProps.messageOrder.min, max:inputsProps.messageOrder.max}}
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
                        <section className="cart__content">
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Your cart' : 'Ваша корзина'}</h3>
                            </div>
                            <CartContent />
                        </section>
                        <button 
                            className="button_blue button_light button_order" 
                            type="submit" 
                            disabled={cart.load.status !== 'success' || fibersLoad.status !== 'success' || colorsLoad.status !== 'success' || sendOrder.status === 'fetching'} 
                            onClick={onSubmit}>
                                {lang === 'en' ? 'Order' : "Заказать"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    cart: state.user.cart,
    sendOrder: state.user.sendOrder,
    colorsLoad: state.colors.load,
    fibersLoad: state.fibers.load,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
