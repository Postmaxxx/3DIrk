import { ICartState, ICategories, IColor, IColorsState, IFiber, IFibersState, IFullState, IModal, IProductState, TId, TLang, TLangText, TLangTextArr } from 'src/interfaces'
import './product-details.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { loadProduct } from "src/redux/actions/product"
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"
import { catalogProductDetails } from "src/assets/js/data";
import AddToCart from '../AddToCart/AddToCart';
import Modal from '../Modal/Modal';
import MessageInfo from '../MessageInfo/MessageInfo';
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

interface IMessageCart {
    //color: string
    //type: string
    header: string
    status: string
    //fiber: string
    //amount: number
    text: string[]
}


const ProductDetails: React.FC<IProps> = ({lang, setState, product, colors, fibers }): JSX.Element => {

    const [fibersDetailed, setFibersDetailed] = useState<IFiber[]>([])
    const [selectedFiber, setSelectedFiber] = useState<IFiber["id"]>('')
    const [selectedColor, setSelectedColor] = useState<IColor["id"]>('')
    const [selectedColorName, setSelectedColorName] = useState<TLangText>()
    const [selectedFiberName, setSelectedFiberName] = useState<TLangText>()
    const [amount, setAmount] = useState<number>(1)
	/*const [modal, setModal] = useState<IModal>({visible: false})
    const [message, setMessage] = useState<IMessageCart>({header: '', status: '', text: []})*/
    const _type = useRef<HTMLSelectElement>(null)

    
    const onChangeFiber: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedFiber(e.target.value)
        setSelectedColor('')
    }

    const onChangeColor = (colorId: IColor["id"]) => {
        setSelectedColor(colorId)
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
            <h2>{catalogProductDetails.featuresHeader[lang]}:</h2>
            <div className="features__container">
                <div className="feature">
                    <span>{catalogProductDetails.descr[lang]}: </span>
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
                {product.mods.length > 0 ? 
                    <div className="feature">
                        <label>{catalogProductDetails.type[lang]}: 
                            <select ref={_type} defaultValue={'-1'}>
                                <option key={-1} value={'-1'} disabled hidden>{lang === 'en' ? 'Select type' : 'Выберите тип'}</option>
                                {product.mods.map((mod, i) => <option key={i} value={i}>{mod[lang]}</option>)}
                            </select>
                        </label>
                    </div>
                    :
                    null
                }
                <div className="feature">
                    <label>{catalogProductDetails.fiber[lang]}: 
                        <select onChange={onChangeFiber} defaultValue={''}>
                            <option key={-1} disabled hidden value={''}>{lang === 'en' ? 'Select fiber' : 'Выберите материал'}</option>
                            {fibersDetailed.map((fiber, i) => <option key={i} value={fiber.id}>{fiber.name[lang]}</option>)}
                        </select>
                    </label>
                </div>
                <div className="colors__container">
                    <span>{catalogProductDetails.colors[lang]}: </span>
                    {colors.colors.map((color, i) => {
                        const colorAvailable = fibers.fibersList.find(fiber => fiber.id === selectedFiber)?.colors.find(colorId => colorId === color.id)
                        return <div key={i} onClick={colorAvailable ? () => onChangeColor(color.id) : undefined} className={`color ${color.value === 'mixed' ? "color_mixed" : ''} ${!colorAvailable && "disabled"} ${selectedColor === color.id && "selected"}`} style={{backgroundColor: `#${color.value}`}} title={color.name[lang]}></div>
                    })}
                </div>
                <div className="feature">
                    <span>{catalogProductDetails.price[lang]}: </span>
                    <span>{product.price[lang]}</span>
                </div>
                
            </div>
            <AddToCart 
                product={product} 
                type={product.mods.length > 0 ? product.mods[Number(_type.current?.value)] : {en: '-', ru: '-'}} 
                fiber={selectedFiber} 
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
