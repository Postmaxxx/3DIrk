import {  ICatalog, IColor, IColorsState, IFetch, IFiber, IFibersState, IFullState,  IProduct,  TId, TLang, } from 'src/interfaces'
import './product-details.scss'
import { useRef, useEffect, useState, useMemo } from "react";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import AddToCart from '../AddToCart/AddToCart';
import { NavLink } from 'react-router-dom';
import ColorPicker from '../tiny/ColorPicker/ColorPicker';
import { allActions } from "../../redux/actions/all";



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



const ProductDetails: React.FC<IProps> = ({lang, setState, product, colors,productLoad, fibers }): JSX.Element => {

    const [fibersDetailed, setFibersDetailed] = useState<IFiber[]>([])
    const [selectedFiber, setSelectedFiber] = useState<IFiber>()
    const [selectedColor, setSelectedColor] = useState<IColor["_id"]>('')
    const [selectedType, setSelectedType] = useState<any>(undefined)

    const _type = useRef<HTMLSelectElement>(null)

    
    const onChangeFiber: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedFiber(fibers.fibersList.find(fiber => fiber.id === e.target.value))
        setSelectedColor('')        
    }


    const onSelectColor = (colorId: IColor["_id"]) => {
        setSelectedColor(colorId)
    }

    const onChangeType: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedType(product.mods[Number(e.target.value)]);
    }


    useEffect(() => {
        if (colors.load.status === 'success' && fibers.load.status === 'success' && productLoad.status === 'success') {
            setFibersDetailed(product.fibers.map((productFiber) => {
                return fibers.fibersList.find(fiberItem => fiberItem.id === productFiber)
            }).filter(fiber => fiber?.id !== undefined) as IFiber[])
        }

        
    },[fibers.load.status, colors.load.status, productLoad.status])
        
    return (
        <div className="details__descr">
            <h2>{lang === 'en' ? 'Features' : 'Характеристики'}:</h2>
            <div className="features__container">
                <div className="feature">
                    <span>{lang === 'en' ? 'Description' : 'Описание'}: </span>
                    {product.text[lang].split('\n').map((text, i) => <p key={i}>{text}</p>)}
                </div>
                {product.features.map((feature, i) => {
                    return (
                        <div className="feature" key={i}>
                            <span>{feature.name[lang]}: </span>
                            <span>{feature.value[lang]}</span>
                        </div>
                    )
                })}

                <div className="feature">
                    <span>{lang === 'en' ? 'Price' : 'Цена'}: </span>
                    <span>{product.price[lang]}</span>
                </div>
                
                {product.mods.length > 0 ? 
                    <div className="feature wrap_xs">
                        <label htmlFor="type">{lang === 'en' ? 'Version' : 'Версия'}: </label>
                        <select id="type" ref={_type} defaultValue={'-1'} onChange={onChangeType}>
                            <option key={-1} value={'-1'} disabled hidden>{lang === 'en' ? 'Select type' : 'Выберите тип'}</option>
                            {product.mods.map((mod, i) => <option key={i} value={i}>{mod[lang]}</option>)}
                        </select>
                    </div>
                    :
                    null
                }
                <div className="feature wrap_xs">
                <label htmlFor="fiber">
                    {selectedFiber ? 
                        <NavLink to={`../../fibers/${selectedFiber.id}`} aria-label={lang === 'en' ? '(About selected fiber)' : ' (О выбранном материале)'}>
                            {lang === 'en' ? 'Fiber' : 'Материал'}:
                        </NavLink>
                        :
                        <>{lang === 'en' ? 'Fiber' : 'Материал'}:</>    
                    }
                </label>

                    <select id="fiber" onChange={onChangeFiber} defaultValue={''}>
                        <option key={-1} disabled hidden value={''}>{lang === 'en' ? 'Select fiber' : 'Выберите материал'}</option>
                        {fibersDetailed.map((fiber, i) => <option key={i} value={fiber.id}>{fiber.short.name[lang]}</option>)}
                    </select>
                </div>
                <div className="colors__container wrap_xs">
                    <span>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}: </span>
                    <div className="colors__wrapper">
                        <ColorPicker lang={lang} colors={colors.colors.filter(color => selectedFiber?.colors.includes(color._id))} onSelect={onSelectColor}/>
                    </div>
                </div>
    
                
            </div>
            <AddToCart 
                product={product} 
                type={product.mods.length > 0 ? selectedType : {en: '-', ru: '-'}} 
                fiber={selectedFiber?.id} 
                color={selectedColor}
                />
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
