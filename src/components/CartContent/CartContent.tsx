import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './cart-content.scss'
import { ICartItem, ICartState, IColor, IColorsState, IFibersState, IFullState, IProduct, TLang } from "../../interfaces";
import { useState, useEffect, useRef,  useCallback, useMemo } from 'react'
import { NavLink } from "react-router-dom";
import Delete from "../Delete/Delete";
import AmountChanger from "../AmountChanger/AmountChanger";
import PreloaderW from "../Preloaders/PreloaderW";
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";
import Modal, { IModalFunctions } from "../Modal/Modal";
import { IImageModalFunctions } from "../ImageModal/ImageModal";
import { allActions } from "../../redux/actions/all";
import ImageModal from "../ImageModal/ImageModal";
import ErrorMock from "../ErrorMock/ErrorMock";

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
    const modalImageRef = useRef<IModalFunctions>(null)
    const imageModalRef = useRef<IImageModalFunctions>(null)

    const deleteItem = useCallback((item: ICartItem) => {
        setState.user.removeItem(item)
    }, [])

    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' &&  cart.load.status === 'success') {
            setCartReady(true)
        }
    }, [colorsState.load.status, fibersState.load.status, cart.load.status])


    const onAmountChange = useCallback((item: ICartItem, amount: number) => {
        setState.user.changeItem({...item, amount})
    }, [])

    const onImageClick = (e: React.MouseEvent, product: IProduct) => {
        if (!product) return
        e.stopPropagation()
        imageModalRef.current?.update({url: `${product.images.paths.full}/${product.images.files[0]}`, text: product.name[lang]})
        modalImageRef.current?.openModal('product')
    }
    
    const onColorClick = (e: React.MouseEvent, color: IColor | undefined) => {
        if (!color) return
        e.stopPropagation()
        imageModalRef.current?.update({url: color.url.full, text: color.name[lang]})
        modalImageRef.current?.openModal('color')
    }

    
    const closeModalImage = useCallback(() => {
        modalImageRef.current?.closeModal()
	}, [])


    const cartContent = useMemo(() => {
        return cart.items.map((item, i) => {
            const fiber = fibersState.fibersList.find(fiberItem => fiberItem._id === item.fiber)?.short.name[lang]
            const color: IColor | undefined = colorsState.colors.find(color => color._id === item.color)
            return(
                <div className="cart__item" key={i}>
                    <div className="img__container" onClick={(e) => onImageClick(e, item.product)}>
                        <ImgWithPreloader src={`${item.product.images.paths.preview}/${item.product.images.files[0]}`} alt={item.product.images.files[0]}/>
                    </div>

                    <div className="item-descr__container">
                        <div className="item__block">
                            <NavLink className="item__product-link_img" to={`../catalog/${item.product._id}`} target="_blank" rel="noopener noreferrer" aria-label={lang === 'en' ? 'Go to product' : 'Перейти к товару'}>
                                <span aria-label={lang === 'en' ? "Go to product page" : 'Перейти на страницу продукта'}>{item.product.name[lang]}</span>
                            </NavLink>
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
                            <div className="colors__container" onClick={(e) => onColorClick(e, color)}> 
                                <div className="color__container">
                                    <img src={color?.url.thumb} alt={color?.name[lang]} />
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
        })
    }, [cart.items])
        

    return (
        <div className="cart-content">
            {cartReady &&
                cart.items.length > 0 ? 
                    <>{cartContent}</>
                : 
                    <h3 className="cart_empty__text">{lang === 'en' ? 'Your cart is empty' : 'Ваша корзина пуста'}</h3>
            }
            
            {cart.load.status === 'fetching' && <PreloaderW />}
            {cart.load.status === 'error' && <ErrorMock lang={lang} comp={{en: 'cart', ru: 'корзины'}}/>}

            <Modal escExit={true} ref={modalImageRef} onClose={closeModalImage}>
                <ImageModal ref={imageModalRef} />
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
