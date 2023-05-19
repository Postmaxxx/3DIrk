import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartItem, ICartState, IColor, IColorsState, IFiber, IFibersState, IFullState, IProduct, IProductState, TLang } from "src/interfaces";
import { changeItem, saveCart, removeItem }  from "src/redux/actions/cart"
import { useState, useEffect, useRef } from 'react'

import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"
import { NavLink } from "react-router-dom";
import Delete from "../Delete/Delete";
import Preloader from "../Preloader/Preloader";
import { setProduct, setLoadDataStatusProduct }  from "src/redux/actions/product"


const actionsCartList = { changeItem, saveCart, removeItem }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }
const actionsListProduct = { setProduct, setLoadDataStatusProduct  }



interface IPropsState {
    lang: TLang,
    cart: ICartState,
    product: IProductState
    colors: IColorsState
    fibers: IFibersState
}

interface IPropsActions {
    setState: {
        cart: typeof actionsCartList,
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
        product: typeof actionsListProduct
    }
}

interface IProps extends IPropsState, IPropsActions {}

const CartContent: React.FC<IProps> = ({lang, cart, colors, fibers, setState}): JSX.Element => {

    const [confirmationId, setConfirmationId] = useState<ICartItem["id"]>('')
    const [cartReady, setCartReady] = useState<boolean>(false)

    const changeAmount = (itemToChange: ICartItem, newAmount: number) => {
        if (newAmount>=0) {
            setState.cart.changeItem({...itemToChange, amount: newAmount})
        } else {
            setState.cart.changeItem({...itemToChange, amount: 0})
        }
    }
    
    useEffect(() => {
        if (cart.dataLoading.status !== 'loading'){
            setState.cart.saveCart(cart.items)
        }
    }, [cart.items])


    const onCancel = (item: ICartItem) => {
        setConfirmationId('');
    }

    const onConfirm = (item: ICartItem) => {
        setState.cart.removeItem(item)
        setConfirmationId('')
    }

    const onDelete = (item: ICartItem) => {
        setConfirmationId(item.id)
    }

    const showConfirmation = (item: ICartItem): boolean => {
        return item.id === confirmationId
    }


    useEffect(() => {
        if (colors.dataLoading.status === 'success' && fibers.dataLoading.status === 'success' &&  cart.dataLoading.status === 'success') {
            setCartReady(true)            
        }
    }, [colors.dataLoading.status, fibers.dataLoading.status, cart.dataLoading.status])

    const onProductClick = (product: IProduct) => {
        setState.product.setLoadDataStatusProduct({status: 'success', message: ''})
        setState.product.setProduct(product)
    }

    return (
        <div className="cart-content">
            {cartReady ? 
                cart.items.length > 0 ? 
                <>
                    {cart.items.map((item, i) => {
                        const fiber = fibers.fibersList.find(fiberItem => fiberItem.id === item.fiber)?.name[lang]
                        return(
                            <div className="cart__item" key={item.id}>
                                <div className="img__cont">
                                    <img src={item.product.imgs[0].url} alt={item.product.imgs[0].name[lang]} />
                                </div>
                                <div className="item-descr__container">
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Product' : 'Наименование'}:</span>
                                        <NavLink className="name-link" to={`../catalog/${item.product.id}`} onClick={() => onProductClick(item.product)}><span aria-label={lang === 'en' ? "Go to product page" : 'Перейти на страницу продукта'}>{item.product.name[lang]}</span></NavLink>
                                    </div>
                                    {item.type ? 
                                        <div className="item__block">
                                            <span>{lang === 'en' ? 'Type' : 'Модификация'}:</span>
                                            <span className="fiber">{item.type}</span>
                                        </div>
                                    : 
                                    null}
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Fiber' : 'Материал'}:</span>
                                        <span className="fiber">{fiber}</span>
                                    </div>
                                    <div className="breaker_2sm"></div>
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Color' : 'Цвет'}:</span>
                                        <div className="color__container">
                                            {colors.colors
                                                .filter(color => color.id === item.color)
                                                .map(color => 
                                                    <div 
                                                        key={i} 
                                                        className={`color ${color.value === 'mixed' ? "color_mixed" : ''}`} 
                                                        style={{backgroundColor: `#${color.value}`}} 
                                                        title={color.name[lang]}>
                                                    </div>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="item__amount-delete">
                                    <div className="delete__container">
                                        <div className="delete__wrapper">
                                            <Delete<ICartItem> onDelete={onDelete} onCancel={onCancel} onConfirm={onConfirm} idInstance={item} showConfirmation={showConfirmation} lang={lang}/>
                                        </div>
                                    </div>
                                    <div className="amount__container">
                                        <button className='amount-changer' aria-label='Decrease amount' onClick={(e) => {e.preventDefault(); changeAmount(item, item.amount > 2 ?  item.amount - 1 : 1)}}>–</button>
                                        <input type="text" value={item.amount} onChange={(e) => {e.preventDefault(); changeAmount(item, Number(e.target.value))}} aria-label={lang === 'en' ? "Enter amount" : 'Введите количество'}/>
                                        <button className='amount-changer' aria-label='Increase amount' onClick={(e) => {e.preventDefault(); changeAmount(item, item.amount + 1)}}>+</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })} 
                </>
                : 
                <h3>{lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста'}</h3>
            :
                <Preloader />
            } 
        </div>
    )


}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.cart,
    lang: state.base.lang,
    product: state.product,
    colors: state.colors,
    fibers: state.fibers,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		cart: bindActionCreators(actionsCartList, dispatch),
        colors: bindActionCreators(actionsListColors, dispatch),
        fibers: bindActionCreators(actionsListFibers, dispatch),
		product: bindActionCreators(actionsListProduct, dispatch),
	}
})
  

  

export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
