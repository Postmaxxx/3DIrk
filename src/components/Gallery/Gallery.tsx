import './gallery.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFibersState, IFullState, IProduct, IProductShort, TId, TLang } from "../../interfaces";
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { NavLink } from 'react-router-dom';
import { allActions } from "../../redux/actions/all";


interface IPropsState {
	lang: TLang
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}

interface IProps extends IPropsState, IPropsActions {
    products: IProductShort[]
}


const Gallery: React.FC<IProps> = ({lang, products, setState}):JSX.Element => {

    const onClicked = (_id: TId) => {
        //setState.catalog.setSelectedProduct(product.id)
        /*setState.product.setLoadDataStatusProduct({status: 'success', message: ''})
        setState.product.setProduct(product)*/
        //setState.catalog.loadProduct(_id)
    }

    return (
        <div className="gallery__container">
            {products.map((product):JSX.Element => {
                return (
                    <NavLink
                        to={product._id}
                        key={product._id}
                        onClick={() => onClicked(product._id)}
                        >
                        <div className='gallery__item' >
                            <div className="img__container">
                                <ImgWithPreloader src={product.image.thumb} alt={product.image.fileName}/>
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
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

