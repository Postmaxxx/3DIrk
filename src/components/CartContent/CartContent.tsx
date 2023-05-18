import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartState, IColorsState, IFibersState, IFullState, IProductState, TLang } from "src/interfaces";
import { changeItem }  from "../../redux/actions/cart"
import { useState, useEffect, useRef } from 'react'
import { loadProduct } from "src/redux/actions/product"
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"


const actionsCartList = { changeItem  }
const actionsListProduct = { loadProduct }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }

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
        product: typeof actionsListProduct,
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
    }
}

interface IProps extends IPropsState, IPropsActions {}

const CartContent: React.FC<IProps> = ({lang, cart,  product, colors, fibers, setState}): JSX.Element => {

    const [itemsToShow, setItemsToShow] = useState([])


    useEffect(() => {
        cart.items.map(item => {
            const fiber = fibers.fibersList.find(fiber => fiber.id === item.fiber)
            const color = colors.colors.find(color => color.id === item.color)
            const amount = item.amount

        })

    }, [cart.items])


    return (
        <div className="cart-content">
            {cart.items.map((item, i) => {
                return(
                    <div className="cart__item">
                        <div className="img__cont">
                            <img src={item.product.imgs[0].url} alt={item.product.imgs[0].name[lang]} />
                        </div>
                        <a href={`catalog/${item.product.id}`}>dsf</a>
                    </div>
                )
            })}
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
        product: bindActionCreators(actionsListProduct, dispatch),
        colors: bindActionCreators(actionsListColors, dispatch),
        fibers: bindActionCreators(actionsListFibers, dispatch),
	}
})
  

  

export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
