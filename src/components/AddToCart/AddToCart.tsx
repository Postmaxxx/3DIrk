import { ICartState, IColor, IFiber, IFullState, IModal, IProduct, TLang } from 'src/interfaces';
import './add-to-cart.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { addItem, saveCart } from "src/redux/actions/cart"
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Modal from "src/components/Modal/Modal";
import MessageInfo from '../MessageInfo/MessageInfo';


const actionsListCart = { addItem, saveCart }






interface IPropsState {
    cart: ICartState
    lang: TLang
}

interface IPropsParent extends IPropsState {
    product : IProduct
    type: string,
    fiber: IFiber['id']
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
	const [modal, setModal] = useState<IModal>({visible: false})
    const [message, setMessage] = useState<IMessageCart>({header: '', status: '', text: []})

    const closeModal = () => {
		setModal({visible: false})
	}
    
    const setNewAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = Number(e.target.value)
        if (value) {
            setAmount(value)
        }
        if (e.target.value === '') {
            setAmount(1)
        }
    }

    const changeAmount = (newAmount: number) => {
        newAmount >0 && setAmount(newAmount)
    }

    const addToCart = () => {
        const errorsList: string[] = []
        !color && errorsList.push(lang === 'en' ? 'Please choose the color' : 'Пожалуйста, выберите цвет')
        !fiber && errorsList.push(lang === 'en' ? 'Please choose the fiber' : 'Пожалуйста, выберите материал')
        !type && errorsList.push(lang === 'en' ? 'Please, choose the type' : 'Пожалуйста, выберите версию')

        if (!color || !fiber || !type) {
            setMessage({
                status: 'error',
                header: lang === 'en' ? 'Error' : 'Ошибка',
                text: errorsList
            })
            
            
        } else {
            const itemsInCart = cart.items.reduce((total, item) => total + item.amount, 0) + amount
            setMessage({
                status: 'success',
                header: lang === 'en' ? 'Added' : 'Добавлено',
                text: lang === 'en' ? [`This item has been added to your сart. You now have ${itemsInCart} item${itemsInCart > 1 ? 's' : ''} in your сart`, ] : [`Этот товар был успешно добавлен в Вашу корзину. Сейчас у Вас товаров в корзине: ${itemsInCart}`, ]
            })
            setState.cart.addItem({product, fiber, color, amount, type})
            setState.cart.saveCart([...cart.items, {product, fiber, color, amount, type}]);
            setAmount(1)
        }
        setModal({visible: true})

    }

    return (
        <>
            <div className="cart-adder">
                <span>{lang === 'en' ? 'Amount' : 'Количество'}: </span>
                <button className='amount-changer' title='Decrease amount' onClick={() => changeAmount(amount - 1)}>–</button>
                <input type="text" value={amount} onChange={setNewAmount}/>
                <button className='amount-changer' title='Increase amount' onClick={() => changeAmount(amount + 1)}>+</button>
                <button className='button_news' title='Add to cart' onClick={addToCart}>{lang === 'en' ? 'Add to cart' : 'Добавить в корзину'}</button>
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