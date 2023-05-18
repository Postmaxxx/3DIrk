import { IColor, IFiber, IFullState, IModal, IProduct, TLang } from 'src/interfaces';
import './add-to-cart.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { addItem } from "src/redux/actions/cart"
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Modal from "src/components/Modal/Modal";
import MessageInfo from '../MessageInfo/MessageInfo';


const actionsListCart = { addItem }


interface IPropsState {
    id : IProduct['id']
    type: string,
    fiber: IFiber['id']
    color: IColor['id']
    lang: TLang
}



interface IPropsActions {
    setState: {
        cart: typeof actionsListCart
    }
}

interface IProps extends IPropsState, IPropsActions {}


const AddToCart: React.FC<IProps> = ({id, type, fiber, color, lang, setState}): JSX.Element => {
    const [amount, setAmount] = useState<number>(0)
	const [modal, setModal] = useState<IModal>({visible: false})
    const [itemDetails, setItemDetails] = useState()

    const closeModal = () => {
		setModal({visible: false})
	}
    
    const setNewAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = Number(e.target.value)
        if (value) {
            setAmount(value)
        }
        if (e.target.value === '') {
            setAmount(0)
        }
    }

    const changeAmount = (newAmount: number) => {
        newAmount >=0 && setAmount(newAmount)
    }


    const addToCart = () => {
        if (!color) {
            return
        }
        setState.cart.addItem({ id, amount, fiber, type, color })
        setModal({visible: true})
        setAmount(0)

    }

    return (
        <>
            <div className="cart-adder">
                <span>Amount: </span>
                <button className='amount-changer' title='Decrease amount' onClick={() => changeAmount(amount - 1)}>–</button>
                <input type="text" value={amount} onChange={setNewAmount}/>
                <button className='amount-changer' title='Increase amount' onClick={() => changeAmount(amount + 1)}>+</button>
                <button className='button_news' title='Add to cart' onClick={addToCart}>Add to cart</button>
            </div>
            <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
                <MessageInfo {...{
                    status: 'success',
                    header: lang === 'en' ? 'Item was added' : "Товар добавлен",
                    text: ['444'], 
                    buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                    buttonAction: closeModal
                }}/>
            </Modal> 
        </>
    )
}



const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        cart: bindActionCreators(actionsListCart, dispatch),
	}
})
  
  

export default connect(null, mapDispatchToProps)(AddToCart);