import "./product.scss"
import { useEffect, useState } from "react";
import { useParams  } from "react-router-dom"
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFetch, IFullState, IProduct, TLang } from "../../interfaces";
import SpliderPreview from "../../components/Spliders/Preview/SpliderPreview";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { allActions } from "../../redux/actions/all";
import { checkAndLoad } from "../../assets/js/processors";
import ErrorFetch from "../../../src/components/ErrorFetch/ErrorFetch";


interface IPropsState {
	lang: TLang
    fibersLoad: IFetch
    colorLoad: IFetch
    catalogProduct: IProduct
    catalogLoadProduct: IFetch
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog,
        colors: typeof allActions.colors,
        fibers: typeof allActions.fibers,
    }
}


interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, setState, colorLoad, catalogProduct, fibersLoad, catalogLoadProduct}): JSX.Element => {
    const paramProductId = useParams().productId || ''
    const [loaded, setLoaded] = useState<boolean>(false)



    useEffect(() => {
        if (colorLoad.status === 'success' && fibersLoad.status === 'success' && catalogLoadProduct.status === 'success' && paramProductId === catalogProduct._id) {
            setLoaded(true)
        } else {
            checkAndLoad({
                fetchData: colorLoad,
                loadFunc: setState.colors.loadColors,
            })
            if (paramProductId !== catalogProduct._id) {
                checkAndLoad({
                    fetchData: catalogLoadProduct,
                    loadFunc: setState.catalog.loadProduct,
                    args: [paramProductId],
                    force: true
                })
            } 
            setLoaded(false)
        }
    },[fibersLoad.status, colorLoad.status, catalogLoadProduct.status, paramProductId])
    

    return (
        <div className="page page_product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{catalogProduct.name[lang]}</h1>
                    {loaded ?
                        <div className="details__block">
                            <div className="details__splider">
                                <SpliderPreview images={catalogProduct.images} sizePreview='preview' sizeMain="medium"  />
                            </div>
                            <div className="details__descr-order">
                                <ProductDetails />
                            </div>
                        </div>
                    :
                        <>
                            {colorLoad.status === 'error' || fibersLoad.status === 'error' || catalogLoadProduct.status === 'error' ? 
                                <ErrorFetch lang={lang} fetchData={{status: 'error', message: {en: 'Error occured while loading product, try again later', ru: 'Произошла ошибка при загрузке продукта, попробуйте позже'}}} />
                            :
                                <Preloader />}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    colorLoad: state.colors.load,
    fibersLoad: state.fibers.load,
    catalogProduct: state.catalog.category.product,
    catalogLoadProduct: state.catalog.category.loadProduct
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		fibers: bindActionCreators(allActions.fibers, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
