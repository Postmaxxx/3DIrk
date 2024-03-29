import './gallery.scss'
import { connect } from "react-redux";
import { IFullState, IProductShort, TLang } from "../../interfaces";
import { NavLink } from 'react-router-dom';
import { useMemo } from 'react'
import PicWithPreloader from '../../../src/assets/js/PicWithPreloader';

interface IPropsState {
	lang: TLang
}

interface IProps extends IPropsState {
    products: IProductShort[]
}


const Gallery: React.FC<IProps> = ({lang, products}):JSX.Element => {
    const cards: JSX.Element[] = useMemo(() => products.map(product => {
        return (
            <NavLink
                to={product._id}
                key={product._id}
                aria-label={lang === 'en' ? `Go to page of the product: ${product.name.en}` : `Перейти на страницу товара: ${product.name.ru}`}
                >
                <div className='gallery__card' >
                    <div className={`gallery__card__img-wrapper ${product.active ? '' : 'inactive'}`}>
                        <PicWithPreloader basePath={product.images.basePath} sizes={product.images.sizes} image={product.images.files[0]} alt={product.name[lang]}/>
                    </div>
                    <div className="gallery__card__text">
                        <span className='name'>{product.name[lang]}</span>
                        <span className='text'>{product.textShort[lang]}</span>
                    </div>
                </div>
            </NavLink>
        )
    }), [lang, products])


    return (
        <div className="gallery">
            {cards}
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang
})


  

export default connect(mapStateToProps)(Gallery);

