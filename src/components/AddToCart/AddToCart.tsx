import { ICartState, IColor, IFiber, IFullState, IProduct, TLang, TLangText } from '../../interfaces';
import './add-to-cart.scss'
import { useRef, useState, useCallback } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from '../Message/Message';
import AmountChanger from '../AmountChanger/AmountChanger';
import { allActions } from "../../redux/actions/all";
import { errorsChecker } from '../../../src/assets/js/processors';
import { useMemo } from 'react'

interface IPropsState {
    cart: ICartState
    lang: TLang
}

interface IParentProps {
    product: IProduct
    getData: () => IAddToCart
}

export interface IAddToCart {
    type: TLangText
    fiber: IFiber['_id'] | undefined
    color: IColor['_id']
}

interface IPropsActions {
    setState: {
		user: typeof allActions.user
    }
}


interface IProps extends IPropsState, IParentProps, IPropsActions {}



const AddToCart: React.FC<IProps> = ({getData, product, lang, cart, setState}): JSX.Element => {
    const [amount, setAmount] = useState<number>(1)
    const [amountChangerReset, setAmountChangerReset] = useState<{amount: number}>({amount: 1})
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef  = useRef<IMessageFunctions>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const closeModalMessage = useCallback(() => {
		modalRef.current?.closeModal()
	}, [])
     
        
    const addToCart = () => { 
        errChecker.clear() 
        !getData().color && errChecker.add(lang === 'en' ? 'Please choose the color' : 'Пожалуйста, выберите цвет');
        !getData().fiber && errChecker.add(lang === 'en' ? 'Please choose the fiber' : 'Пожалуйста, выберите материал');
        (getData().type?.en === '') && errChecker.add(lang === 'en' ? 'Please choose the type' : 'Пожалуйста, выберите тип');
        !amount && errChecker.add(lang === 'en' ? 'Please set the amount' : 'Пожалуйста, укажите количество')

        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal('submit')
            return
        }

        setState.user.addItem({
            product, 
            amount, 
            fiber: getData().fiber as string, 
            color: getData().color,
            type: getData().type, 
        })

        setAmountChangerReset({amount: 1})
        const amountItemsInCart = cart.items.reduce((total, item) => total + item.amount, 0) + amount
        messageRef.current?.update({
            status: 'success',
            header: lang === 'en' ? 'Added' : 'Добавлено',
            text: lang === 'en' ? [`This item has been added to your сart.`, `You now have ${amountItemsInCart} item${amountItemsInCart > 1 ? 's' : ''} in your сart`, ] : [`Этот товар был успешно добавлен в Вашу корзину.`, `Сейчас у Вас товаров в корзине: ${amountItemsInCart}`, ]
        })
        
        modalRef.current?.openModal()
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
            <Modal escExit={true} ref={modalRef} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
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