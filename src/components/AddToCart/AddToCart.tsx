import { ICartItem, ICartState, IColor, IFiber, IFullState, IProduct, TLang, TLangText } from '../../interfaces';
import './add-to-cart.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { addItem, saveCart } from "../../redux/actions/cart"
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Modal from "../../components/Modal/Modal";
import MessageInfo from '../MessageInfo/MessageInfo';
import AmountChanger from '../AmountChanger/AmountChanger';
//var uniqid = require('uniqid');


const actionsListCart = { addItem, saveCart }


interface IPropsState {
    cart: ICartState
    lang: TLang
}

interface IPropsParent extends IPropsState {
    product : IProduct
    type: TLangText | undefined
    fiber: IFiber['id'] | undefined
    color: IColor['id']
}


interface IPropsActions {
    setState: {
        cart: typeof actionsListCart
    }
}

interface IProps extends IPropsParent, IPropsActions {}


interface IMessageCart {
    //color: string
    //type: string
    header: string
    status: string
    //fiber: string
    //amount: number
    text: string[]
}




const AddToCart: React.FC<IProps> = ({product, type, fiber, color, lang, cart, setState}): JSX.Element => {
    const [amount, setAmount] = useState<number>(1)
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState<IMessageCart>({header: '', status: '', text: []})
    const [amountChangerReset, setAmountChangerReset] = useState<{amount: number}>({amount: 1})

    const closeModal = () => {
		setModal(false)
	}

    
    
    const addToCart = () => {
        const errorsList: string[] = []
        !color && errorsList.push(lang === 'en' ? 'Please choose the color' : 'Пожалуйста, выберите цвет')
        !fiber && errorsList.push(lang === 'en' ? 'Please choose the fiber' : 'Пожалуйста, выберите материал')
        !type && errorsList.push(lang === 'en' ? 'Please choose the type' : 'Пожалуйста, выберите версию')
        !amount && errorsList.push(lang === 'en' ? 'Please set the amount' : 'Пожалуйста, укажите количество')

        if (!color || !fiber || !type || !amount) {
            setMessage({
                status: 'error',
                header: lang === 'en' ? 'Error' : 'Ошибка',
                text: errorsList
            })
        } else {
            const newItem: ICartItem = {
                product, 
                fiber, 
                color, 
                amount, 
                type, 
                //id: uniqid()
            }
            setState.cart.addItem(newItem)
            setState.cart.saveCart([...cart.items, newItem]);
            //setAmount(1)
            setAmountChangerReset({amount: 1})
            const amountItemsInCart = cart.items.reduce((total, item) => total + item.amount, 0) + amount
            setMessage({
                status: 'success',
                header: lang === 'en' ? 'Added' : 'Добавлено',
                text: lang === 'en' ? [`This item has been added to your сart.`, `You now have ${amountItemsInCart} item${amountItemsInCart > 1 ? 's' : ''} in your сart`, ] : [`Этот товар был успешно добавлен в Вашу корзину.`, `Сейчас у Вас товаров в корзине: ${amountItemsInCart}`, ]
            })
        }
        setModal(true)

    }


    const onAmountChange = (item: IProduct['id'], amount: number) => {
        setAmount(amount)
    }

    return (
        <>
            <div className="cart-adder">
                <span>{lang === 'en' ? 'Amount' : 'Количество'}: </span>
                <div className="amount-changer__container">
                    <AmountChanger<IProduct['id']> idInstance={product.id} initialAmount={amount} reset={amountChangerReset} lang={lang} onChange={onAmountChange} />
                </div>
                <button className='button_news' title='Add to cart' onClick={addToCart}>{lang === 'en' ? 'Add to cart' : 'Добавить в корзину'}</button>
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
        </>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.cart,
    lang: state.base.lang
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        cart: bindActionCreators(actionsListCart, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);