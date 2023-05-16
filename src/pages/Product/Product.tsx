import "./product.scss"
import { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import Preloader from 'src/components/Preloader/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, ICategories, IColor, IColorsState, IFiber, IFibersState, IFullState, IProductState, TId, TLang } from "src/interfaces";
import SpliderPreview from "src/components/Spliders/Preview/SpliderPreview";
import { loadProduct } from "src/redux/actions/product"
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"



const actionsListProduct = { loadProduct }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }
//const actionsListCatalog = { setSelectedProduct }

interface IPropsState {
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	categories: ICategories
    //selectedImage: IProductState["selectedImage"]
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


const Product: React.FC<IProps> = ({lang, selectedProduct, setState, product, colors, fibers }): JSX.Element => {
    const productId = useParams().productId
    const [loaded, setLoaded] = useState<boolean>(false)
    const [fibersDetailed, setFibersDetailed] = useState<IFiber[]>([])
    const [selectedFiber, setSelectedFiber] = useState<IFiber["id"]>('')
    const [selectedColor, setSelectedColor] = useState<IColor["id"]>('')

    useEffect(() => {
        if (productId !== selectedProduct && productId) {
            setState.product.loadProduct(productId)
            setLoaded(false)
        }
    }, [])


    useEffect(() => {
        if (fibers.dataLoading.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
    }, [fibers.dataLoading.status])


    useEffect(() => {
        if (colors.dataLoading.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
    }, [colors.dataLoading.status])



    useEffect(() => {
        if (colors.dataLoading.status === 'success' && fibers.dataLoading.status === 'success' && product.dataLoading.status === 'success') {
            setFibersDetailed(product.fibers.map((productFiber) => {
                return fibers.fibersList.find(fiberItem => fiberItem.id === productFiber)
            }).filter(fiber => fiber?.id !== undefined) as IFiber[])
            setSelectedFiber(product.fibers[0])
            setLoaded(true)
        }

        
    },[fibers.dataLoading.status, colors.dataLoading.status, product.dataLoading.status])
    






    

    const onChangeFiber: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedFiber(e.target.value)
        setSelectedColor('')
    }

    const onChangeColor = (colorId: IColor["id"]) => {
        setSelectedColor(colorId)
    }


    return (
        <section className="product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{product.name[lang]}</h1>
                    {loaded ? 
                        <div className="details__block">
                            <div className="details__splider">
                                <SpliderPreview />
                            </div>
                            <div className="details__descr">
                                    <h2>Features:</h2>
                                    <div className="features__container">
                                        <div className="feature">
                                            <span>Description: </span>
                                            {product.text[lang].map((text, i) => <p key={i}>{text.part}</p>)}
                                        </div>
                                        {product.features.map((feature, i) => {
                                            return (
                                                <div className="feature" key={i}>
                                                    <span>{feature.name[lang]}: </span>
                                                    <span>{feature.name[lang]}: </span>
                                                </div>
                                            )
                                        })}
                                        <div className="feature">
                                            <label>Type: 
                                                <select>
                                                    {product.mods[lang].map((mod, i) => <option key={i} value={mod.part}>{mod.part}</option>)}
                                                </select>
                                            </label>
                                        </div>
                                        <div className="feature">
                                            <label>Fiber: 
                                                <select onChange={onChangeFiber}>
                                                    {fibersDetailed.map((fiber, i) => <option key={i} value={fiber.id}>{fiber.name[lang]}</option>)}
                                                </select>
                                            </label>
                                        </div>
                                        <div className="colors__container">
                                            <span>Available colors: </span>
                                            {colors.colors.map((color, i) => {
                                                const colorAvailable = fibers.fibersList.find(fiber => fiber.id === selectedFiber)?.colors.find(colorId => colorId === color.id)
                                                return <div key={i} onClick={colorAvailable ? () => onChangeColor(color.id) : undefined} className={`color ${color.value === 'mixed' && "mixed"} ${!colorAvailable && "disabled"} ${selectedColor === color.id && "selected"}`} style={{backgroundColor: `#${color.value}`}} title={color.name[lang]}></div>
                                            })}
                                        </div>
                                        <div className="feature">
                                            <span>Price: </span>
                                            <span>{product.price[lang]}</span>
                                        </div>
                                        
                                    </div>
                            </div>
                        </div>
                    :
                        <Preloader />}
                </div>
            </div>
        </section>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	selectedCategory: state.catalog.selectedCategory,
	categories: state.catalog.categories,
	selectedProduct: state.catalog.selectedProduct,
    //selectedImage: state.product.selectedImage,
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
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
