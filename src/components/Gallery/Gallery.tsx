import './gallery.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from 'src/components/Preloader/Preloader';
import { IFibersState, IFullState, IProduct, TLang } from "src/interfaces";
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory }  from "src/redux/actions/catalog"
import { useEffect } from 'react';
import { catalogBlock } from "src/assets/js/data";


const actionsListCatalog = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory  }

interface IPropsReceived {
    products: IProduct[]
}

interface IPropsState {
	lang: TLang
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsListCatalog
    }
}

interface IProps extends IPropsState, IPropsActions, IPropsReceived {}


const Gallery: React.FC<IProps> = ({lang, products, setState}):JSX.Element => {

    const onClicked = (e: IProduct["id"]) => {
                
    }





    return (
        <div className="gallery__container">
            {products.map((product):JSX.Element => {
                return (
                    <div className='gallery__item' key={product.id} onClick={() => onClicked(product.id)} >
                        <div className="img__container">
                            <img src={product.imgs[0].url} alt={product.imgs[0].name[lang]} />
                        </div>
                        <div className="descr__container">
                            <span className='name'>{product.name[lang]}</span>
                            <span className='price'>{catalogBlock.priceGallery[lang]}: {product.price[lang]}</span>
                        </div>
                    </div>
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
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

/*
                            <div className='colors__container'>
                                <span>Colors:</span>
                                {product.colors?.map((color, i) => (
                                <div key={i} className={`color ${color.value === 'mixed' ? "mixed" : ""}`} style={{backgroundColor: `#${color.value}`}} title={color.name[lang]}></div>
                            ))}
                            </div>
                            */