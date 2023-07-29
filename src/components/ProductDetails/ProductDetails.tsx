import {  IColor, IColorsState, IFetch, IFiber, IFibersState, IFullState,  IProduct, TLang, TLangText, } from '../../interfaces'
import './product-details.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import AddToCart, { IAddToCart } from '../AddToCart/AddToCart';
import { NavLink } from 'react-router-dom';
import { allActions } from "../../redux/actions/all";
import Selector, { ISelectorFunctions } from '../Selector/Selector';
import inputChecker from '../../../src/assets/js/inputChecker';
import ColorSelector from '../ColorSelector/ColorSelector';
import { defaultSelectItem, empty } from '../../../src/assets/js/consts';

interface IPropsState {
	lang: TLang
	product: IProduct
    productLoad: IFetch
    colors: IColorsState
    fibers: IFibersState
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        catalog: typeof allActions.catalog
        colors: typeof allActions.colors

    }
}

interface IProps extends IPropsState, IPropsActions {}



const ProductDetails: React.FC<IProps> = ({lang, product, colors,productLoad, fibers }): JSX.Element => {
    const [selectedFiber, setSelectedFiber] = useState<IFiber>()
    const [selectedColor, setSelectedColor] = useState<IColor["_id"]>('')
    const noType: TLangText = useMemo(() => ({en: '-', ru: '-'}), [])
    const selectorTypeRef = useRef<ISelectorFunctions>(null)
    const selectorFiberRef = useRef<ISelectorFunctions>(null)

    const onChangeFiber: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedFiber(fibers.fibersList.find(fiber => fiber._id === e.target.value))
        setSelectedColor('')        
    }


    const onSelectColor = (colorId: IColor["_id"]) => {
        setSelectedColor(colorId)
    }

    useEffect(() => {
        if (colors.load.status === 'success' && fibers.load.status === 'success' && productLoad.status === 'success') {
            const allFibers = product.fibers.map((productFiber) => {
                return fibers.fibersList.find(fiberItem => fiberItem._id === productFiber)
            }).map(item => ({_id: item?._id, short: {name: item?.short.name}})) as IFiber[]

            selectorTypeRef.current?.setData(product.mods.map(type => ({value: type[lang], name: type})))
            selectorFiberRef.current?.setData(allFibers.map(fiber => ({value: fiber._id, name: fiber.short.name})))
        }
    },[fibers.load.status, colors.load.status, productLoad.status])
       

    const productDescr = product.text[lang].split('\n').map((text, i) => <p key={i}>{text}</p>)



    const dataToCart = (): IAddToCart => {
        return {
            fiber: selectedFiber?._id,
            color: selectedColor,
            type: product.mods.length > 0 ? selectorTypeRef.current?.getItem().name || {...empty} : noType
        }
    }


    return (
        <div className="details__descr">
            <h2>{lang === 'en' ? 'Features' : 'Характеристики'}:</h2>
            <div className="features__container">
                <div className="feature text_simple">
                    <span>{lang === 'en' ? 'Description' : 'Описание'}: </span>
                    {productDescr}
                </div>


                <div className="feature text_simple">
                    <span>{lang === 'en' ? 'Price' : 'Цена'}: </span>
                    <span>{product.price}</span>
                </div>

                {product.mods.length > 0 &&
                    <div className="feature wrap_xs">
                        <Selector 
                            lang={lang} 
                            id='selector_type' 
                            label={{en: 'Version: ', ru: 'Версия: '}}
                            onBlur={(e) => inputChecker({lang, notExact: '-', el: e.target})}
                            defaultData={{...defaultSelectItem}}
                            ref={selectorTypeRef}/>
                    </div>
                }
                <div className="feature wrap_xs">
                    <Selector 
                        lang={lang} 
                        id='selector_fiber' 
                        label={{en: 'Fiber: ', ru: 'Материал: '}}
                        onBlur={(e) => inputChecker({lang, notExact: 'wrongType', el: e.target})}
                        defaultData={{...defaultSelectItem}}
                        ref={selectorFiberRef}
                        saveValue={onChangeFiber}
                    />
                    {selectedFiber &&
                        <NavLink 
                            className='fiber-link'    
                            to={`../../fibers/${selectedFiber._id}`} 
                            aria-label={lang === 'en' ? '(About selected fiber)' : ' (О выбранном материале)'}>
                                {lang === 'en' ? '(About)' : '(Подробнее)'}
                        </NavLink>
                    }
                </div>
                {selectedFiber &&
                    <div className="colors__container wrap_xs">
                        <span>{lang === 'en' ? 'Available colors: ' : 'Доступные цвета: '}: </span>
                        <div className="colors__wrapper">
                            <ColorSelector lang={lang} colors={colors.colors.filter(color => selectedFiber?.colors.includes(color._id))} onSelect={onSelectColor}/>
                        </div>
                    </div>
                }
    
                
            </div>
            <AddToCart getData={dataToCart} product={product}/>
        </div>
    )
}




const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	product: state.catalog.category.product,
    colors: state.colors,
    fibers: state.fibers,
    productLoad: state.catalog.category.loadProduct
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
