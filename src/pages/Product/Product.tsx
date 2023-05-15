import "./product.scss"
import { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams  } from "react-router-dom"
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory, setPage, setCategory } from "src/redux/actions/catalog"
import Preloader from 'src/components/Preloader/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, ICategories, IFullState, IProductState, TId, TLang } from "src/interfaces";



const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory, setPage, setCategory  }

interface IPropsState {
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	categories: ICategories
    selectedImage: ICatalogState["selectedProductImage"]
    product: IProductState
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, selectedCategory, selectedProduct, setState, categories, selectedImage, product }): JSX.Element => {
    const productId = useParams().productId
    
    useEffect(() => {
        if (productId !== product.id) {
            setState.
        }
    },[])
    
    return (
        <section className="product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{categories.}</h1>
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
    selectedImage: state.catalog.selectedProductImage,
    product: state.product
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsList, dispatch)
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
