import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-informer.scss'
import { ICartState, IFullState, TLang } from "src/interfaces";


interface IPropsState {
    cart: ICartState
    lang: TLang
}




const CartInformer: React.FC<IPropsState> = ({lang, cart}): JSX.Element => {
    
    const itemsInCart = cart.items.reduce((total, item) => total + item.amount, 0)
    return (
        <>
            {cart.dataLoading.status === 'success' ? 
                <div className="cart-informer">
                    <span>{itemsInCart > 0 ? `+${itemsInCart}` : null}</span>
                </div>
                :
                null
            }
        </>
        
    )


}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.cart,
    lang: state.base.lang
})



  

export default connect(mapStateToProps)(CartInformer);
