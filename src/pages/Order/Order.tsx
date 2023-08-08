import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { ICartState, IFetch, IFullState, TLang } from "../../interfaces";
import { useEffect, useRef, useCallback, useMemo } from 'react'
import CartContent from "../../components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import { inputsProps, resetFetch} from "../../assets/js/consts";
import { checkAndLoad, deepCopy, errorsChecker, focusMover, modalMessageCreator, prevent } from "../../assets/js/processors";
import inputChecker from "../../../src/assets/js/inputChecker";
import { IModalFunctions } from "../../../src/components/Modal/ModalNew";
import MessageNew from "../../../src/components/Message/MessageNew";

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
    const _message = useRef<HTMLTextAreaElement>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _formOrder = useRef<HTMLFormElement>(null)

    const focuser = useMemo(() => focusMover(), [lang])
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])



    const closeModalMessage = useCallback(() => {        
        if (modal?.getName() === 'sendOrder') {
            if (sendOrder.status === 'success') {
                addFilesRef.current?.clearAttachedFiles()
                setState.user.setCart({items: []})
            }
            setState.user.setSendOrder(deepCopy(resetFetch))
        }
        if (modal?.getName() === 'cartFixer') {
            setState.user.setSendOrder(deepCopy(resetFetch))
        }
        if (modal?.getName() === 'errorsInForm') {
        }
        modal?.closeCurrent()
	}, [sendOrder.status])

 

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!_message.current ||  !modal || !addFilesRef.current || !_formOrder.current) return
        prevent(e)
        //check errors
        focuser.focusAll();//run over all elements to get all errors
        const errorFields = _formOrder.current.querySelectorAll('.incorrect-value')
        errorFields?.length > 0 &&  errChecker.add(lang === 'en' ? 'Some fields in additional information are filled incorrectly' : 'Некоторые поля в дополнительной информации заполнены неправильно')
        cart.items.length === 0 && errChecker.add(lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста')
        if (errChecker.amount() > 0) { //show modal with error
            modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModalMessage,
                children: <MessageNew {...errChecker.result()} buttonClose={{action: closeModalMessage, text: 'Close'}}/>
            })
            return
        }
        setState.user.sendCart() //update cart before order
        setState.user.sendOrder({
            message: _message.current.value,
            files: addFilesRef.current.getFiles(),
        })
    }


    useEffect(() => {
        if (cart.fixed?.length === 0) return //nothing was fixed
        modal?.openModal({
            name: 'cartFixer',
            onClose: closeModalMessage,
            children: <MessageNew 
                header={lang === 'en' ? "Warning" :  "Внимание"}
                status='warning'
                text={[lang === 'en' ? 
                    'Some items have been removed from your cart as unavalable for order:' 
                    : 'Некоторые товары были удалены из вашей корзины т.к. они больше недоступны для заказа:',
                ...cart.fixed?.map((item, i) => (`${i+1}) ${item[lang]}`))]}
                buttonClose={{action: closeModalMessage, text: 'Close'}}
            />
        })
    }, [cart.fixed])




    useEffect(() => {
        if (sendOrder.status === 'fetching' || sendOrder.status === 'idle') return
        modal?.openModal({ //if error/success - show modal about send order
            name: 'sendOrder',
            onClose: closeModalMessage,
            children: <MessageNew {...modalMessageCreator(sendOrder, lang)} buttonClose={{action: closeModalMessage, text: 'Close'}}/>
        })
    }, [sendOrder.status])


    useEffect(() => {
        checkAndLoad({
			fetchData: colorsLoad,
			loadFunc: setState.colors.loadColors,
		})
    }, [colorsLoad.status])


    useEffect(() => {
        if (!_formOrder.current) return
        focuser.create({container: _formOrder.current})
    }, [lang])




    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
    }

    
    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="block_text">
                        <h1>{lang === 'en' ? 'Order 3D printing' : 'Заказать 3D печать'}</h1>
                    </div>
                    <form className="form_full form_order" ref={_formOrder} >
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Additional information' : 'Дополнительная информация'}</h3>
                        </div>
                        <div className="form__inputs">
                            <div className="form__inputs__texts">
                                <div className="block_input expandable" data-selector="input-block">
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
                    </form>
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
