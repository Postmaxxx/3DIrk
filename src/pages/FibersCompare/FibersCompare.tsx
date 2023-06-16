import './FibersCompare.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor, TLangText, IFiber } from "../../interfaces";
import { useEffect, useState, Fragment } from 'react'; 
import Preloader from '../../components/Preloaders/Preloader';
import { NavLink } from 'react-router-dom';
import SvgInserter from '../../components/tiny/SvgInserter/SvgInserter';
import RatingLine from '../../components/tiny/RatingLine/RatingLine';
import RatingMoney from '../../components/tiny/RatingMoney/RatingMoney';
import { fibersProperties } from '../../assets/data/fibersProperties';
import { allActions } from "../../redux/actions/all";



interface IPropsState {
    lang: TLang,
    fibers: IFibersState
    colors: IColorsState
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}

const FibersCompare:React.FC<IProps> = ({lang, fibers, colors, setState}):JSX.Element => {

    const [loaded, setLoaded] = useState<boolean>(false)
    const [filtered, setFiltered] = useState<boolean>(false)
    const [selectError, setSelectError] = useState<boolean>(false)
    const [selectedMore, setSelectedMore] = useState<boolean>(false)
    const [selectedProperty, setSelectedProperty] = useState<any>()
    const [showList, setShowList] = useState<IFiber['id'][]>([])

    useEffect(() => {
        if (fibers.load.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
        if (colors.load.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
        if (colors.load.status === 'success' && fibers.load.status === 'success') {
            setShowList(fibers.fibersList.map(fiber => fiber.id))
            setLoaded(true)
        }
    }, [colors.load.status, fibers.load.status])
   


    const clearCheckboxes = () => {
        Array.from(document.querySelectorAll('[data-fiberselect]')).forEach(item => (item as HTMLInputElement).checked = false)
    }


    const compareSelected =() => {
        const selectedFibers:IFiber['id'][] = Array.from(document.querySelectorAll('[data-fiberselect]'))
            .filter(item => (item as HTMLInputElement).checked)
            .map(input => (input as HTMLInputElement).dataset.fiberselect as IFiber['id']) 
        if (selectedFibers.length < 2) {
                setSelectError(true)
            return
        }
        setShowList(selectedFibers)
        setFiltered(true)
        clearCheckboxes()
        setSelectedMore(false)
    }


    useEffect(() => {
        setTimeout(() => {setSelectError(false)}, 3000)
    }, [selectError])


    const clearSelected = () => {
        setFiltered(false)  
        setShowList(fibers.fibersList.map(fiber => fiber.id))
        clearCheckboxes()
    }



    const onCheckbox = () => {
        setSelectError(false)
        if (filtered) {
            setSelectedMore(true)
        }
    }


    const onCellClick = (id: IFiber['id'], propertyName: string) => { 
        setState.fibers.setSelectedFiber(id)
        if (propertyName) {
            setSelectedProperty(propertyName)
        }
    }



    return (
        <div className="page page_compare">
            <div className="container_page">
                <div className="container_compare">
                    <h1>{lang === 'en' ? 'Filaments comparison' : 'Сравнение филаментов'}</h1>
                    <div className="table__container">
                        {loaded ? 
                            <div className="table">
                                <div className="cell row-name fixed-left">
                                    <span></span>
                                </div>
                                
                                <div className="cell row-name fixed-left selectors">
                                    {(filtered && !selectedMore) && <button className='button_blue' onClick={clearSelected}>{lang === 'en' ? 'Show all' : 'Показать все'}</button>}
                                    {(!filtered || selectedMore) && <button className='button_blue' onClick={compareSelected}>{lang === 'en' ? 'Compare' : 'Сравнить'}</button>}
                                       
                                        {selectError && <span className='error-message'>{lang === 'en' ? `select 2 or more` : `выберите 2 или более`}</span>}
                                </div>
                                {fibersProperties.map((property, i) => {
                                    return (
                                        <>
                                            {property.id !== 'priceGr' ? 
                                                <div className="cell row-name fixed-left with-tip padding_no" key={property.id}>
                                                    <NavLink 
                                                        key={property.id}
                                                        to='/fibers'>
                                                            <span>{property.name[lang]}</span>
                                                            <div className='tip' title={property.tip[lang]}>
                                                                <SvgInserter type={'question'}/>
                                                            </div>
                                                    </NavLink>
                                                </div>
                                                :
                                                null
                                            }
                                        </>
                                    )
                                })}
                                <div className="cell row-name fixed-left row-name_last">
                                    <span></span>
                                </div>


                                {fibers.fibersList
                                    .filter(fiber => showList.includes(fiber.id))
                                    .map((fiber, i) => {
                                    return (
                                    <Fragment key={fiber.id}>
                                        <div className={`cell col-name ${fiber.id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber.id, '')} >
                                            <div className="img__container">
                                                <img src={fiber.imgs[0].url} alt={fiber.imgs[0].name[lang]} />
                                                <span>{fiber.short.name[lang]}</span>
                                            </div>
                                            <NavLink 
                                                to={`../${fiber.id}`}
                                                className='button_blue'
                                                >
                                                    {lang === 'en' ? 'Learn more' : 'Подробнее'}
                                            </NavLink>
                                        </div>
                                        <div className={`cell cell_checkbox ${fiber.id === fibers.selected ? "selected" : ""}`}>
                                            <label>
                                                <input type="checkbox" data-fiberselect={fiber.id} onChange={onCheckbox}/>
                                                <span></span>
                                            </label>
                                        </div>
                                        {fibersProperties.map((property, i) => {
                                            return (
                                                <>
                                                    {property.id !== 'priceGr' ? 
                                                        <div className={`cell ${fiber.id === fibers.selected ? 'selected' : ''} ${selectedProperty === property.id ? 'selected' : ''}`} key={`${fiber.id}-${property.id}`}  onClick={e => onCellClick(fiber.id, property.id)}>
                                                            {property.id === "strength" && <div className="rating__container"><RatingLine colorValue='blue' min={0} max={180} value={fiber.params[property.id]} text={`${fiber.params[property.id]}`} measurment={lang === 'en' ? ' MPa' : ' МПа'}/></div>}
                                                            {property.id === "stiffnes" && <div className="rating__container"><RatingLine colorValue='red' min={0} max={10} value={fiber.params[property.id]} text={`${fiber.params[property.id]}`} measurment={' / 10'}/></div>}
                                                            {property.id === "durability" && <div className="rating__container"><RatingLine colorValue='green' min={0} max={10} value={fiber.params[property.id]} text={`${fiber.params[property.id]}`} measurment={' / 10'}/></div>}
                                                            {property.id === "resistantImpact" && <div className="rating__container"><RatingLine colorValue='lilac' min={0} max={10} value={fiber.params[property.id]} text={`${fiber.params[property.id]}`} measurment={' / 10'}/></div>}
                                                            {(property.id === "minTemp" || property.id === "maxTemp" || property.id === "thermalExpansion" || property.id === "density") && <span>{fiber.params[property.id]} <span>{property.unit[lang]}</span></span>}
                                                            {(property.id === "flexible" 
                                                            || property.id === "elastic"
                                                            || property.id === "soft"
                                                            || property.id === "composite"
                                                            || property.id === "resistantUV"
                                                            || property.id === "resistantWater"
                                                            || property.id === "dissolvable"
                                                            || property.id === "resistantHeat"
                                                            || property.id === "resistantChemically"
                                                            || property.id === "resistantFatigue"
                                                            || property.id === "cutting"
                                                            || property.id === "grinding"
                                                            ) && <SvgInserter type={fiber.params[property.id] === 2 ? 'plus' : fiber.params[property.id] === 0 ? 'minus' : 'con'}/>}
                                                            {property.id === "price" && <RatingMoney value={fiber.params.price} max={5} text={``} measurment={''} />}
                                                        </div>
                                                    :
                                                        null
                                                }
                                                </>
                                            )
                                        })}
                                        <div className={`cell col-name_last  ${fiber.id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber.id, '')}>
                                            <span>{fiber.short.name[lang]}</span>
                                        </div>

                                    </Fragment>
                                    )
                                })}
                            </div>
                        :
                            <Preloader />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibers: state.fibers,
    colors: state.colors
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(FibersCompare)