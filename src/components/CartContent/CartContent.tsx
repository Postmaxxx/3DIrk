import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartItem, ICartState, ICatalogState, IColor, IColorsState, IFiber, IFibersState, IFullState, IModalImg, IProduct, TLang } from "src/interfaces";
import { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import Delete from "../Delete/Delete";
import AmountChanger from "../AmountChanger/AmountChanger";
import PreloaderW from "../Preloaders/PreloaderW";
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";
import Modal from "../Modal/Modal";
import ModalImage from "../MessageImage/MessageImage";
import { allActions } from "../../redux/actions/all";





interface IPropsState {
    lang: TLang,
    cart: ICartState,
    catalog: ICatalogState
    colors: IColorsState
    fibers: IFibersState
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        catalog: typeof allActions.catalog
        colors: typeof allActions.colors
		cart: typeof allActions.cart
    }
}


interface IProps extends IPropsState, IPropsActions {}

const CartContent: React.FC<IProps> = ({lang, cart, colors, fibers, setState}): JSX.Element => {

    const [cartReady, setCartReady] = useState<boolean>(false)
	const [modal, setModal] = useState<boolean>(false)
	const [modalImg, setModalImg] = useState<IModalImg>({descr: '', path: ''})
  
    useEffect(() => {
        if (cart.load.status !== 'fetching'){
            //setState.cart.saveCart(cart.items)
        }
    }, [cart.items])


    const deleteItem = (item: ICartItem) => {
        setState.cart.removeItem(item)
    }


    useEffect(() => {
        if (colors.load.status === 'success' && fibers.load.status === 'success' &&  cart.load.status === 'success') {
            setCartReady(true)
        }
    }, [colors.load.status, fibers.load.status, cart.load.status])


    const onProductClick = (product: IProduct) => {
        setState.catalog.setFetchProduct({status: 'success', message: {en: '', ru: ''}, errors: []})
        //setState.product.setProduct(product)
    }

    const onAmountChange = (item: ICartItem, amount: number) => {
        setState.cart.changeItem({...item, amount})
    }


    
    const onImageClick = (e: React.MouseEvent , color: IColor | undefined) => {
        if (!color) return
        e.stopPropagation()
        setModalImg({descr: color.name[lang], path: color.url})
        setModal(true)
    }

    
    const closeModal = () => {
		setModal(false)
	}


    return (
        <div className="cart-content">
            {cartReady ? 
                cart.items.length > 0 ? 
                <>
                    {cart.items.map((item, i) => {
                        const fiber = fibers.fibersList.find(fiberItem => fiberItem.id === item.fiber)?.short.name[lang]
                        const color: IColor | undefined = colors.colors.find(color => color.id === item.color)
                        return(
                            <div className="cart__item" key={i}>
                                <NavLink className="item__product-link_img" to={`../catalog/${item.product.id}`} onClick={() => onProductClick(item.product)} aria-label={lang === 'en' ? 'Go to product' : 'Перейти к товару'}>
                                    <div className="img__container">
                                        <ImgWithPreloader src={item.product.imgs[0].url} alt={item.product.imgs[0].name[lang]}/>
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
                                                <img src={color?.url} alt={color?.name[lang]} />
                                            </div>
                                            <span className="color__name">({color?.name[lang]})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item__amount-delete">
                                    <div className="delete__container">
                                        <div className="delete__wrapper">
                                            <Delete<ICartItem> remove={deleteItem} idInstance={item} lang={lang}/>
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
                <h3 className="cart_empty__text">{lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста'}</h3>
            :
            <PreloaderW />
        } 
            <Modal {...{visible: modal, close: closeModal, escExit: true}}>
                    <ModalImage props={{path: modalImg.path, descr: modalImg.descr}}/>
            </Modal> 
        </div>
    )


}



const mapStateToProps = (state: IFullState): IPropsState => ({
    cart: state.cart,
    lang: state.base.lang,
    catalog: state.catalog,
    colors: state.colors,
    fibers: state.fibers,
})



const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
		cart: bindActionCreators(allActions.cart, dispatch),
	}
})
  

  

export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
