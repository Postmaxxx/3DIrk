import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartItem, ICartState, ICatalogState, IColor, IColorsState, IFiber, IFibersState, IFullState, IProduct, TLang } from "src/interfaces";
import { useState, useEffect, useRef } from 'react'
import { NavLink } from "react-router-dom";
import Delete from "../Delete/Delete";
import AmountChanger from "../AmountChanger/AmountChanger";
import PreloaderW from "../Preloaders/PreloaderW";
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";
import Modal, { IModalFunctions } from "../Modal/Modal";
import ModalImage, { IImageModalFunctions } from "../ImageModal/ImageModal";
import { allActions } from "../../redux/actions/all";
import ImageModal from "../ImageModal/ImageModal";
import ErrorMock from "../tiny/ErrorMock/ErrorMock";
import { empty, resetFetch, successFetch } from "src/assets/js/consts";





interface IPropsState {
    lang: TLang,
    colorsState: IColorsState
    fibersState: IFibersState
    cart: ICartState
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

const CartContent: React.FC<IProps> = ({lang, cart, colorsState, fibersState, setState}): JSX.Element => {

    const [cartReady, setCartReady] = useState<boolean>(false)
    const modal_image = useRef<IModalFunctions>(null)
    const imageModal = useRef<IImageModalFunctions>(null)


/*
    useEffect(() => {
        if (cart.load.status !== 'fetching'){
            //setState.cart.saveCart(cart.items)
        }
    }, [cart.items])
*/

    const deleteItem = (item: ICartItem) => {
        setState.user.removeItem(item)
    }


    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' &&  cart.load.status === 'success') {
            setCartReady(true)
        }
    }, [colorsState.load.status, fibersState.load.status, cart.load.status])


    const onProductClick = (product: IProduct) => {
        //setState.catalog.setLoadProduct(resetFetch)
        //setState.product.setProduct(product)
    }

    const onAmountChange = (item: ICartItem, amount: number) => {
        console.log(cart.items);
        setState.user.changeItem({...item, amount})
    }


    
    const onImageClick = (e: React.MouseEvent , color: IColor | undefined) => {
        if (!color) return
        e.stopPropagation()
        imageModal.current?.update({url: color.url.full, text: color.name[lang]})
        modal_image.current?.openModal()
    }

    
    const closeModalImage = () => {
        modal_image.current?.closeModal()
	}


    return (
        <div className="cart-content">
            {cartReady &&
                cart.items.length > 0 ? 
                <>
                    {cart.items.map((item, i) => {
                        const fiber = fibersState.fibersList.find(fiberItem => fiberItem._id === item.fiber)?.short.name[lang]
                        const color: IColor | undefined = colorsState.colors.find(color => color._id === item.color)
                        return(
                            <div className="cart__item" key={i}>
                                <NavLink className="item__product-link_img" to={`../catalog/${item.product._id}`} onClick={() => onProductClick(item.product)} aria-label={lang === 'en' ? 'Go to product' : 'Перейти к товару'}>
                                    <div className="img__container">
                                        <ImgWithPreloader src={item.product.images[0].thumb} alt={item.product.images[0].fileName}/>
                                    </div>
                                </NavLink>


                                <div className="item-descr__container">
                                    <div className="item__block">
                                        <span aria-label={lang === 'en' ? "Go to product page" : 'Перейти на страницу продукта'}>{item.product.name[lang]}</span>
                                    </div>
                                    {item.type ? 
                                        <div className="item__block">
                                            <span>{lang === 'en' ? 'Type' : 'Модификация'}:</span>
                                            <span className="fiber">{item.type[lang]}</span>
                                        </div>
                                    : 
                                    null}
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Fiber' : 'Материал'}:</span>
                                        <span className="fiber">{fiber}</span>
                                    </div>
                                    <div className="item__block">
                                        <span>{lang === 'en' ? 'Color' : 'Цвет'}:</span>
                                        <div className="colors__container" onClick={(e) => onImageClick(e, color)}> 
                                            <div className="color__container">
                                                <img src={color?.url.small} alt={color?.name[lang]} />
                                            </div>
                                            <span className="color__name">({color?.name[lang]})</span>
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
                        )
                    })} 
                </>
                : 
                <h3 className="cart_empty__text">{lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста'}</h3>}
            
            {cart.load.status === 'fetching' && <PreloaderW />}
            {cart.load.status === 'error' && <ErrorMock lang={lang} comp={{en: 'cart', ru: 'корзины'}}/>}

            <Modal escExit={true} ref={modal_image} onClose={closeModalImage}>
				<ImageModal ref={imageModal} />
            </Modal>
        </div>
    )


}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.user.cart,
    lang: state.base.lang,
    colorsState: state.colors,
    fibersState: state.fibers,
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
