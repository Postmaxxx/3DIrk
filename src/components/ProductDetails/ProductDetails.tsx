import { ICartState, ICategories, IColor, IColorsState, IFiber, IFibersState, IFullState, IModal, IModalImg, IProductState, TId, TLang, TLangText, TLangTextArr } from 'src/interfaces'
import './product-details.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { loadProduct } from "src/redux/actions/product"
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"
import AddToCart from '../AddToCart/AddToCart';
import Modal from '../Modal/Modal';
import MessageInfo from '../MessageInfo/MessageInfo';
import { NavLink } from 'react-router-dom';
import ColorPicker from '../tiny/ColorPicker/ColorPicker';
import ModalImage from '../MessageImage/MessageImage';
//import { addItem } from "src/redux/actions/cart"


const actionsListProduct = { loadProduct }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }
//const actionsListCart = { addItem }

interface IPropsState {
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	categories: ICategories
    product: IProductState
    colors: IColorsState
    fibers: IFibersState
    //cart: ICartState
}

interface IPropsActions {
    setState: {
        product: typeof actionsListProduct,
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
        //cart: typeof actionsListCart
    }
}

interface IProps extends IPropsState, IPropsActions {}



const ProductDetails: React.FC<IProps> = ({lang, setState, product, colors, fibers }): JSX.Element => {

    const [fibersDetailed, setFibersDetailed] = useState<IFiber[]>([])
    const [selectedFiber, setSelectedFiber] = useState<IFiber>()
    const [selectedColor, setSelectedColor] = useState<IColor["id"]>('')
    const [selectedType, setSelectedType] = useState<any>(undefined)

    const _type = useRef<HTMLSelectElement>(null)

    
    const onChangeFiber: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedFiber(fibers.fibersList.find(fiber => fiber.id === e.target.value))
        setSelectedColor('')        
    }


    const onSelectColor = (colorId: IColor["id"]) => {
        setSelectedColor(colorId)
    }

    const onChangeType: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedType(product.mods[Number(e.target.value)]);
    }


    useEffect(() => {
        if (colors.dataLoading.status === 'success' && fibers.dataLoading.status === 'success' && product.dataLoading.status === 'success') {
            setFibersDetailed(product.fibers.map((productFiber) => {
                return fibers.fibersList.find(fiberItem => fiberItem.id === productFiber)
            }).filter(fiber => fiber?.id !== undefined) as IFiber[])
        }

        
    },[fibers.dataLoading.status, colors.dataLoading.status, product.dataLoading.status])
        
    return (
        <div className="details__descr">
            <h2>{lang === 'en' ? 'Features' : 'Характеристики'}:</h2>
            <div className="features__container">
                <div className="feature">
                    <span>{lang === 'en' ? 'Description' : 'Описание'}: </span>
                    {product.text[lang].map((text, i) => <p key={i}>{text.part}</p>)}
                </div>
                {product.features.map((feature, i) => {
                    return (
                        <div className="feature" key={i}>
                            <span>{feature.name[lang]}: </span>
                            <span>{feature.value[lang]}</span>
                        </div>
                    )
                })}

                <div className="feature">
                    <span>{lang === 'en' ? 'Price' : 'Цена'}: </span>
                    <span>{product.price[lang]}</span>
                </div>
                
                {product.mods.length > 0 ? 
                    <div className="feature wrap_xs">
                        <label htmlFor="type">{lang === 'en' ? 'Version' : 'Версия'}: 
                        </label>
                        <select id="type" ref={_type} defaultValue={'-1'} onChange={onChangeType}>
                            <option key={-1} value={'-1'} disabled hidden>{lang === 'en' ? 'Select type' : 'Выберите тип'}</option>
                            {product.mods.map((mod, i) => <option key={i} value={i}>{mod[lang]}</option>)}
                        </select>
                    </div>
                    :
                    null
                }
                <div className="feature wrap_xs">
                <label htmlFor="fiber">
                    {selectedFiber ? 
                        <NavLink to={`../../fibers/${selectedFiber.id}`} aria-label={lang === 'en' ? '(About selected fiber)' : ' (О выбранном материале)'}>
                            {lang === 'en' ? 'Fiber' : 'Материал'}:
                        </NavLink>
                        :
                        <>{lang === 'en' ? 'Fiber' : 'Материал'}:</>    
                    }
                </label>

                    <select id="fiber" onChange={onChangeFiber} defaultValue={''}>
                        <option key={-1} disabled hidden value={''}>{lang === 'en' ? 'Select fiber' : 'Выберите материал'}</option>
                        {fibersDetailed.map((fiber, i) => <option key={i} value={fiber.id}>{fiber.short.name[lang]}</option>)}
                    </select>
                </div>
                <div className="colors__container wrap_xs">
                    <span>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}: </span>
                    <div className="colors__wrapper">
                        <ColorPicker lang={lang} colors={colors.colors.filter(color => selectedFiber?.colors.includes(color.id))} onSelect={onSelectColor}/>
                    </div>
                </div>
    
                
            </div>
            <AddToCart 
                product={product} 
                type={product.mods.length > 0 ? selectedType : {en: '-', ru: '-'}} 
                fiber={selectedFiber?.id} 
                color={selectedColor}
                />
        </div>
    )
}




const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	selectedCategory: state.catalog.selectedCategory,
	categories: state.catalog.categories,
	selectedProduct: state.catalog.selectedProduct,
    product: state.product,
    colors: state.colors,
    fibers: state.fibers,
    //cart: state.cart
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        product: bindActionCreators(actionsListProduct, dispatch),
        colors: bindActionCreators(actionsListColors, dispatch),
        fibers: bindActionCreators(actionsListFibers, dispatch),
        //cart: bindActionCreators(actionsListCart, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
