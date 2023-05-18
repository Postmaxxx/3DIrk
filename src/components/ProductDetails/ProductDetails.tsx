import { ICategories, IColor, IColorsState, IFiber, IFibersState, IFullState, IProductState, TId, TLang } from 'src/interfaces'
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


const actionsListProduct = { loadProduct }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }


interface IPropsState {
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	categories: ICategories
    product: IProductState
    colors: IColorsState
    fibers: IFibersState
}

interface IPropsActions {
    setState: {
        product: typeof actionsListProduct,
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ProductDetails: React.FC<IProps> = ({lang, setState, product, colors, fibers }): JSX.Element => {

    const [fibersDetailed, setFibersDetailed] = useState<IFiber[]>([])
    const [selectedFiber, setSelectedFiber] = useState<IFiber["id"]>('')
    const [selectedColor, setSelectedColor] = useState<IColor["id"]>('')
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
            setSelectedFiber(product.fibers[0]) 
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
                {product.mods[lang].length > 0 ? 
                    <div className="feature">
                        <label>{catalogProductDetails.type[lang]}: 
                            <select ref={_type}>
                                <option key={-1} disabled selected hidden value={''}>Select type</option>
                                {product.mods[lang].map((mod, i) => <option key={i} value={mod.part}>{mod.part}</option>)}
                            </select>
                        </label>
                    </div>
                    :
                    null
                }
                <div className="feature">
                    <label>{catalogProductDetails.fiber[lang]}: 
                        <select onChange={onChangeFiber}>
                            <option key={-1} disabled hidden selected value={''}>Select fiber</option>
                            {fibersDetailed.map((fiber, i) => <option key={i} value={fiber.id}>{fiber.name[lang]}</option>)}
                        </select>
                    </label>
                </div>
                <div className="colors__container">
                    <span>{catalogProductDetails.colors[lang]}: </span>
                    {colors.colors.map((color, i) => {
                        const colorAvailable = fibers.fibersList.find(fiber => fiber.id === selectedFiber)?.colors.find(colorId => colorId === color.id)
                        return <div key={i} onClick={colorAvailable ? () => onChangeColor(color.id) : undefined} className={`color ${color.value === 'mixed' && "mixed"} ${!colorAvailable && "disabled"} ${selectedColor === color.id && "selected"}`} style={{backgroundColor: `#${color.value}`}} title={color.name[lang]}></div>
                    })}
                </div>
                <div className="feature">
                    <span>{catalogProductDetails.price[lang]}: </span>
                    <span>{product.price[lang]}</span>
                </div>
                
            </div>
            <AddToCart id={product.id} type={_type.current?.value || '-'} fiber={selectedFiber} color={selectedColor} lang={lang}/>
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
    fibers: state.fibers
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        product: bindActionCreators(actionsListProduct, dispatch),
        colors: bindActionCreators(actionsListColors, dispatch),
        fibers: bindActionCreators(actionsListFibers, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
