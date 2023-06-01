import './gallery.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { IFibersState, IFullState, IProduct, TLang } from "../../interfaces";
import { useEffect } from 'react';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { NavLink } from 'react-router-dom';
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedProduct, loadCategoriesList, loadCategory }  from "../../redux/actions/catalog"
import { setProduct, setLoadDataStatusProduct }  from "../../redux/actions/product"

const actionsListCatalog = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedProduct, loadCategoriesList, loadCategory  }
const actionsListProduct = { setProduct, setLoadDataStatusProduct  }

interface IPropsReceived {
    products: IProduct[]
}

interface IPropsState {
	lang: TLang
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsListCatalog,
        product: typeof actionsListProduct
    }
}

interface IProps extends IPropsState, IPropsActions, IPropsReceived {}


const Gallery: React.FC<IProps> = ({lang, products, setState}):JSX.Element => {

    const onClicked = (product: IProduct) => {
        //setState.catalog.setSelectedProduct(product.id)
        setState.product.setLoadDataStatusProduct({status: 'success', message: ''})
        setState.product.setProduct(product)
    }


    return (
        <div className="gallery__container">
            {products.map((product):JSX.Element => {
                return (
                    <NavLink
                        to={product.id}
                        key={product.id}
                        onClick={() => onClicked(product)}
                        >
                        <div className='gallery__item' >
                            <div className="img__container">
                                <ImgWithPreloader src={product.imgs[0].url} alt={product.imgs[0].name[lang]}/>
                            </div>
                            <div className="descr__container">
                                <span className='name'>{product.name[lang]}</span>
                                <span className='price'>{lang === 'en' ? 'Price' : 'Цена'}: {product.price[lang]}</span>

                            </div>
                        </div>
                    </NavLink>
                )
            })
            }
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsListCatalog, dispatch),
		product: bindActionCreators(actionsListProduct, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

