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
    return (
        <>
        </>
    )


}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.cart,
    lang: state.base.lang
})



  

export default connect(mapStateToProps)(CartInformer);
