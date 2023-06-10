import "./product.scss"
import { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IColorsState, IFetch, IFibersState, IFullState, IProduct, TId, TLang } from "src/interfaces";
import SpliderPreview from "../../components/Spliders/Preview/SpliderPreview";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { allActions } from "../../redux/actions/all";




interface IPropsState {
	lang: TLang
    product: IProduct
    colors: IColorsState
    fibers: IFibersState
    productFetch: IFetch
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog,
        colors: typeof allActions.colors,
        fibers: typeof allActions.fibers,
    }
}


interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, setState, product, colors, fibers, productFetch }): JSX.Element => {
    const paramProductId = useParams().productId || ''
    const [loaded, setLoaded] = useState<boolean>(false)
    
    useEffect(() => {
        if (paramProductId !== product.id) {
            setState.catalog.loadProduct(paramProductId)
            setLoaded(false)
        }
        if (fibers.load.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
        if (colors.load.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
    }, [])



    useEffect(() => {
        if (colors.load.status === 'success' && fibers.load.status === 'success' && productFetch.status === 'success') {
            setLoaded(true)
        }
    },[fibers.load.status, colors.load.status, productFetch.status])
    

    return (
        <div className="page page_product-details">
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
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    product: state.catalog.category.product,
    productFetch: state.catalog.category.loadProduct,
    colors: state.colors,
    fibers: state.fibers
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		fibers: bindActionCreators(allActions.fibers, dispatch),

	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
