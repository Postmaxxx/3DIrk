import { ICartItem, ICartState, IColor, IFiber, IFullState, IProduct, TLang, TLangText } from '../../interfaces';
import './add-to-cart.scss'
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from '../Message/Message';
import AmountChanger from '../AmountChanger/AmountChanger';
import { allActions } from "../../redux/actions/all";


interface IPropsState {
    cart: ICartState
    lang: TLang
}

interface IPropsParent extends IPropsState {

}

interface IPropsActions {
    setState: {
		user: typeof allActions.user
    }
}


interface IProps extends IPropsParent, IPropsActions {
    product : IProduct
    type: TLangText | undefined
    fiber: IFiber['_id'] | undefined
    color: IColor['_id']
}





const AddToCart: React.FC<IProps> = ({product, type, fiber, color, lang, cart, setState}): JSX.Element => {
    const [amount, setAmount] = useState<number>(1)
    const [amountChangerReset, setAmountChangerReset] = useState<{amount: number}>({amount: 1})
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)




    const closeModalMessage = useCallback(() => {
		modal.current?.closeModal()
	}, [])

    
    
    const addToCart = () => {
        const errorsList: string[] = []
        !color && errorsList.push(lang === 'en' ? 'Please choose the color' : 'Пожалуйста, выберите цвет')
        !fiber && errorsList.push(lang === 'en' ? 'Please choose the fiber' : 'Пожалуйста, выберите материал')
        !type && errorsList.push(lang === 'en' ? 'Please choose the type' : 'Пожалуйста, выберите версию')
        !amount && errorsList.push(lang === 'en' ? 'Please set the amount' : 'Пожалуйста, укажите количество')

        if (!color || !fiber || !type || !amount) {
            message.current?.update({
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
            }
            setState.user.addItem(newItem)
            //setState.user.sendCart(); // ???
            //setAmount(1)
            setAmountChangerReset({amount: 1})
            const amountItemsInCart = cart.items.reduce((total, item) => total + item.amount, 0) + amount
            message.current?.update({
                status: 'success',
                header: lang === 'en' ? 'Added' : 'Добавлено',
                text: lang === 'en' ? [`This item has been added to your сart.`, `You now have ${amountItemsInCart} item${amountItemsInCart > 1 ? 's' : ''} in your сart`, ] : [`Этот товар был успешно добавлен в Вашу корзину.`, `Сейчас у Вас товаров в корзине: ${amountItemsInCart}`, ]
            })
        }
        modal.current?.openModal()
    }


    const onAmountChange = useCallback((_id: IProduct['_id'], amount: number) => {
        setAmount(amount)
    }, [])

    return (
        <>
            <div className="cart-adder">
                <span>{lang === 'en' ? 'Amount' : 'Количество'}: </span>
                <div className="amount-changer__container">
                    <AmountChanger<IProduct['_id']> idInstance={product._id} initialAmount={amount} reset={amountChangerReset} lang={lang} onChange={onAmountChange} />
                </div>
                <button className='button_news' title='Add to cart' onClick={addToCart}>{lang === 'en' ? 'Add to cart' : 'Добавить в корзину'}</button>
            </div>
            <Modal escExit={true} ref={modal} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
            </Modal>
        </>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.user.cart,
    lang: state.base.lang
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);