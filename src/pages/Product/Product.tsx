import "./product.scss"
import { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import Preloader from 'src/components/Preloader/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, ICategories, IFullState, IProductState, TId, TLang } from "src/interfaces";
import SpliderPreview from "src/components/Spliders/Preview/SpliderPreview";
import { loadProduct } from "src/redux/actions/product"
import { setSelectedProduct } from "src/redux/actions/catalog"



const actionsListProduct = { loadProduct }
const actionsListCatalog = { setSelectedProduct }

interface IPropsState {
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	categories: ICategories
    //selectedImage: IProductState["selectedImage"]
    product: IProductState
}

interface IPropsActions {
    setState: {
        product: typeof actionsListProduct,
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, selectedProduct, setState, product }): JSX.Element => {
    const productId = useParams().productId
    const [loaded, setLoaded] = useState<boolean>(false)
    


    useEffect(() => {
        if (productId !== selectedProduct && productId) {
            setState.product.loadProduct(productId)
            setLoaded(false)
        } else {
            setLoaded(true)
        }
    },[])
    

    useEffect(() => {
        if (product.dataLoading.status === 'success') {
            setLoaded(true)
        }
    },[product.dataLoading.status])

    return (
        <section className="product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{product.name[lang]}</h1>
                    <div className="details__block">
                        <div className="details__splider">
                            {loaded ? 
                                <SpliderPreview />
                            :
                                <Preloader />}
                            
                        </div>
                        <div className="details__descr">
                                <h2>Features:</h2>
                                <div className="features__container">
                                    <div className="feature">
                                        <span>Description: </span>
                                        {product.text[lang].map((text, i) => {
                                            return <p key={i}>{text.part}</p>
                                        })}
                                    </div>
                                    {product.features.map((feature, i) => {
                                        return (
                                            <div className="feature" key={i}>
                                                <span>{feature.name[lang]}: </span>
                                                <span>{feature.value[lang]}: </span>
                                            </div>
                                        )

                                    })}
                                                                        {product.features.map((feature, i) => {
                                        return (
                                            <div className="feature" key={i}>
                                                <span>{feature.name[lang]}: </span>
                                                <span>{feature.value[lang]}: </span>
                                            </div>
                                        )

                                    })}
                                                                        {product.features.map((feature, i) => {
                                        return (
                                            <div className="feature" key={i}>
                                                <span>{feature.name[lang]}: </span>
                                                <span>{feature.value[lang]}: </span>
                                            </div>
                                        )

                                    })}
                                    <div className="feature">
                                        <span>Price: </span>
                                        <span>{product.price[lang]}</span>
                                    </div>
                                </div>
                        </div>

                    </div>
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
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        product: bindActionCreators(actionsListProduct, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
