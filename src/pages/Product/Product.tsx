import "./product.scss"
import { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import Preloader from 'src/components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICategories, IColorsState, IFibersState, IFullState, IProductState, TId, TLang } from "src/interfaces";
import SpliderPreview from "src/components/Spliders/Preview/SpliderPreview";
import { loadProduct } from "src/redux/actions/product"
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"
import ProductDetails from "src/components/ProductDetails/ProductDetails";



const actionsListProduct = { loadProduct }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }
//const actionsListCatalog = { setSelectedProduct }

interface IPropsState {
	selectedCategory: TId
	//selectedProduct: TId
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


const Product: React.FC<IProps> = ({lang, setState, product, colors, fibers }): JSX.Element => {
    const paramProductId = useParams().productId || ''
    const [loaded, setLoaded] = useState<boolean>(false)
    
    useEffect(() => {
        if (paramProductId !== product.id) {
            setState.product.loadProduct(paramProductId)
            console.log(222);
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
            setLoaded(true)
        }


    },[fibers.dataLoading.status, colors.dataLoading.status, product.dataLoading.status])
    

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
                            <div className="details__descr-order">
                                <ProductDetails />
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
	//selectedProduct: state.catalog.selectedProduct,
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
