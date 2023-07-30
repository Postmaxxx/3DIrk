import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartItem, ICartState, IColor, IColorsState, IFibersState, IFullState, IProduct, TLang } from "../../interfaces";
import { useCallback, useMemo, Fragment } from 'react'
import { NavLink } from "react-router-dom";
import Delete from "../Delete/Delete";
import AmountChanger from "../AmountChanger/AmountChanger";
import PreloaderW from "../Preloaders/PreloaderW";
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";
import { allActions } from "../../redux/actions/all";
import ErrorMock from "../ErrorFetch/ErrorFetch";
import ImageModalNew from "../ImageModal/ImageModalNew";
import { IModalFunctions } from "../Modal/ModalNew";

interface IPropsState {
    lang: TLang,
    colorsState: IColorsState
    fibersState: IFibersState
    cart: ICartState
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        catalog: typeof allActions.catalog
        colors: typeof allActions.colors
		user: typeof allActions.user
    }
}

interface IProps extends IPropsState, IPropsActions {}

const CartContent: React.FC<IProps> = ({lang, cart, colorsState, modal, fibersState, setState}): JSX.Element => {


    const deleteItem = useCallback((item: ICartItem) => {
        setState.user.removeItem(item)
    }, [])


    const onAmountChange = useCallback((item: ICartItem, amount: number) => {
        setState.user.changeItem({...item, amount})
    }, [])


    const onImageClick = (e: React.MouseEvent, product: IProduct) => {
        if (!product) return
        e.stopPropagation()
        modal?.openModal({
            name: 'productClicked',
            children: <ImageModalNew url={`${product.images.paths.full}/${product.images.files[0]}`}/>
        })
    }
    
    const onColorClick = (e: React.MouseEvent, color: IColor | undefined) => {
        if (!color) return
        e.stopPropagation()
        modal?.openModal({
            name: 'colorClicked',
            children: <ImageModalNew url={color.url.full}/>
        })
    }



    const cartContent = useMemo(() => {
        return cart.items.map((item, i) => {
            const fiberName = fibersState.fibersList.find(fiberItem => fiberItem._id === item.fiber)?.short.name[lang]
            const color: IColor | undefined = colorsState.colors.find(color => color._id === item.color)
            return (
                <Fragment  key={i}>
                    {color && fiberName &&
                        <div className="cart__item">
                            <div className="img__container" onClick={(e) => onImageClick(e, item.product)}>
                                <ImgWithPreloader src={`${item.product.images.paths.preview}/${item.product.images.files[0]}`} alt={item.product.images.files[0]}/>
                            </div>
                
                            <div className="item-descr__container">
                                <div className="item__block">
                                    <NavLink className="item__product-link_img" to={`../catalog/${item.product._id}`} target="_blank" rel="noopener noreferrer" aria-label={lang === 'en' ? 'Go to product' : 'Перейти к товару'}>
                                        {item.product.name[lang]}
                                    </NavLink>
                                </div>
                                {item.type &&
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Type' : 'Модификация'}:</span>
                                        <span className="fiber">{item.type[lang]}</span>
                                    </div>
                                }
                                <div className="item__block">
                                    <span>{lang === 'en' ? 'Fiber' : 'Материал'}:</span>
                                    <span className="fiber">{fiberName}</span>
                                </div>
                                <div className="item__block">
                                    <span>{lang === 'en' ? 'Color' : 'Цвет'}:</span>
                                    <div className="colors__container" onClick={(e) => onColorClick(e, color)}> 
                                        <div className="color__container">
                                            <img src={color.url.thumb} alt={color.name[lang]} />
                                        </div>
                                        <span className="color__name">({color.name[lang]})</span>
                                    </div>
                                </div>
                            </div>
                            <div className="item__amount-delete">
                                <div className="delete__container">
                                    <div className="delete__wrapper">
                                        <Delete<ICartItem> remove={deleteItem} idInstance={item} lang={lang} disabled={false}/>
                                    </div>
                                </div>
                                <div className="amount__container">
                                    <AmountChanger<ICartItem> idInstance={item} initialAmount={item.amount} lang={lang} onChange={onAmountChange} />
                                </div>
                            </div>
                        </div>
                    }
                </Fragment>
            )
        })
    }, [cart.items, fibersState.fibersList, colorsState.colors])
        

    return (
        <div className="cart-content">
            {colorsState.load.status === 'success' && fibersState.load.status === 'success' &&  cart.load.status === 'success' &&
                cart.items.length > 0 ? 
                    <>{cartContent}</>
                : 
                    <h3 className="cart_empty__text">{lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста'}</h3>
            }
            
            {cart.load.status === 'fetching' && <PreloaderW />}
            {cart.load.status === 'error' && <ErrorMock lang={lang} fetchData={cart.load}/>}
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.user.cart,
    lang: state.base.lang,
    colorsState: state.colors,
    fibersState: state.fibers,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
