import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-informer.scss'
import { ICartState, IFullState, IOrderState, TLang } from "../../interfaces";


interface IPropsState {
    order: IOrderState
    lang: TLang
}




const CartInformer: React.FC<IPropsState> = ({lang, order}): JSX.Element => {
    
    const itemsInCart = order.cart.items.reduce((total, item) => total + item.amount, 0)
    return (
        <>
            {order.cart.load.status === 'success' ? 
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
    order: state.order,
    lang: state.base.lang
})



  

export default connect(mapStateToProps)(CartInformer);
