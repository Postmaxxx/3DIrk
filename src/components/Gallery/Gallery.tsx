import './gallery.scss'
import { connect } from "react-redux";
import { IFullState, IProductShort, TLang } from "../../interfaces";
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { NavLink } from 'react-router-dom';
import { useMemo } from 'react'

interface IPropsState {
	lang: TLang
}

interface IProps extends IPropsState {
    products: IProductShort[]
}


const Gallery: React.FC<IProps> = ({lang, products}):JSX.Element => {
    const cards = useMemo(() => products.map(product => {
        return (
            <NavLink
                to={product._id}
                key={product._id}
                >
                <div className='gallery__item' >
                    <div className={`img__container ${product.active ? '' : 'inactive'}`}>
                        <ImgWithPreloader src={`${product.images.paths.small}/${product.images.files[0]}`} alt={product.images.files[0]}/>
                    </div>
                    <div className="descr__container">
                        <span className='name'>{product.name[lang]}</span>
                        <span className='price'>{lang === 'en' ? 'Price' : 'Цена'}: {product.price[lang]}</span>
                    </div>
                </div>
            </NavLink>
        )
    }), [lang, products])


    return (
        <div className="gallery__container">
            {cards}
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang
})


  

export default connect(mapStateToProps)(Gallery);

