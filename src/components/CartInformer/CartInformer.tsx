import { connect } from "react-redux";
import './cart-informer.scss'
import { ICartState, IFullState, IOrderState, TLang } from "../../interfaces";
import { useState, useEffect, useRef } from 'react'


interface IPropsState {
    cart: ICartState
    lang: TLang
}



const CartInformer: React.FC<IPropsState> = ({lang, cart}): JSX.Element => {
    const [itemsInCart, setItemsInCart] = useState<number>(0)

    useEffect(() => {
        if (cart.load.status === 'success') {
            //setItemsInCart(cart.items.reduce((total, item) => total + item.amount, 0))
        }
    }, [cart.load.status])


    return (
        <>
            {cart.load.status === 'success' && itemsInCart > 0 && 
                <div className="cart-informer">
                    <span>+{itemsInCart}</span>
                </div>
            }
        </>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.user.cart,
    lang: state.base.lang
})



  

export default connect(mapStateToProps)(CartInformer);
