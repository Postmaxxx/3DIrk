import "./product.scss"
import { useEffect, useState } from "react";
import { useParams  } from "react-router-dom"
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, IColorsState, IFibersState, IFullState, TLang } from "../../interfaces";
import SpliderPreview from "../../components/Spliders/Preview/SpliderPreview";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { allActions } from "../../redux/actions/all";
import { checkAndLoad } from "../../assets/js/processors";


interface IPropsState {
	lang: TLang
    catalogState: ICatalogState
    colorsState: IColorsState
    fibersState: IFibersState
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog,
        colors: typeof allActions.colors,
        fibers: typeof allActions.fibers,
    }
}


interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, setState, catalogState, colorsState, fibersState}): JSX.Element => {
    const paramProductId = useParams().productId || ''
    const [loaded, setLoaded] = useState<boolean>(false)



    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' && catalogState.category.loadProduct.status === 'success' && paramProductId === catalogState.category.product._id) {
            setLoaded(true)
        } else {
            checkAndLoad({
                fetchData: colorsState.load,
                loadFunc: setState.colors.loadColors,
            })
            if (paramProductId !== catalogState.category.product._id) {
                checkAndLoad({
                    fetchData: catalogState.category.loadProduct,
                    loadFunc: setState.catalog.loadProduct,
                    args: [paramProductId],
                    force: true
                })
            } 
            setLoaded(false)
        }
    },[fibersState.load.status, colorsState.load.status, catalogState.category.loadProduct.status, paramProductId])
    

    return (
        <div className="page page_product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{catalogState.category.product.name[lang]}</h1>
                    {loaded ? 
                        <div className="details__block">
                            <div className="details__splider">
                                <SpliderPreview images={catalogState.category.product.images} sizePreview='preview' sizeMain="medium"  />
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
    catalogState: state.catalog,
    colorsState: state.colors,
    fibersState: state.fibers,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		fibers: bindActionCreators(allActions.fibers, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
