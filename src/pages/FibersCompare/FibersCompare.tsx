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
    const [showList, setShowList] = useState<IFiber['_id'][]>([])

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
            setShowList(fibers.fibersList.map(fiber => fiber._id))
            setLoaded(true)
        }
    }, [colors.load.status, fibers.load.status])
   


    const clearCheckboxes = () => {
        Array.from(document.querySelectorAll('[data-fiberselect]')).forEach(item => (item as HTMLInputElement).checked = false)
    }


    const compareSelected =() => {
        const selectedFibers:IFiber['_id'][] = Array.from(document.querySelectorAll('[data-fiberselect]'))
            .filter(item => (item as HTMLInputElement).checked)
            .map(input => (input as HTMLInputElement).dataset.fiberselect as IFiber['_id']) 
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
        setShowList(fibers.fibersList.map(fiber => fiber._id))
        clearCheckboxes()
    }



    const onCheckbox = () => {
        setSelectError(false)
        if (filtered) {
            setSelectedMore(true)
        }
    }


    const onCellClick = (id: IFiber['_id'], propertyName: string) => { 
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
                                            {property._id !== 'priceGr' ? 
                                                <div className="cell row-name fixed-left with-tip padding_no" key={property._id}>
                                                    <NavLink 
                                                        key={property._id}
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
                                    .filter(fiber => showList.includes(fiber._id))
                                    .map((fiber, i) => {
                                    return (
                                    <Fragment key={fiber._id}>
                                        <div className={`cell col-name ${fiber._id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber._id, '')} >
                                            <div className="img__container">
                                                <img src={fiber.images[0].thumb} alt={fiber.images[0].fileName} />
                                                <span>{fiber.short.name[lang]}</span>
                                            </div>
                                            <NavLink 
                                                to={`../${fiber._id}`}
                                                className='button_blue'
                                                >
                                                    {lang === 'en' ? 'Learn more' : 'Подробнее'}
                                            </NavLink>
                                        </div>
                                        <div className={`cell cell_checkbox ${fiber._id === fibers.selected ? "selected" : ""}`}>
                                            <label>
                                                <input type="checkbox" data-fiberselect={fiber._id} onChange={onCheckbox}/>
                                                <span></span>
                                            </label>
                                        </div>
                                        {fibersProperties.map((property, i) => {
                                            return (
                                                <>
                                                    {property._id !== 'priceGr' ? 
                                                        <div className={`cell ${fiber._id === fibers.selected ? 'selected' : ''} ${selectedProperty === property._id ? 'selected' : ''}`} key={`${fiber._id}-${property._id}`}  onClick={e => onCellClick(fiber._id, property._id)}>
                                                            {property._id === "strength" && <div className="rating__container"><RatingLine colorValue='blue' min={0} max={180} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={lang === 'en' ? ' MPa' : ' МПа'}/></div>}
                                                            {property._id === "stiffnes" && <div className="rating__container"><RatingLine colorValue='red' min={0} max={10} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={' / 10'}/></div>}
                                                            {property._id === "durability" && <div className="rating__container"><RatingLine colorValue='green' min={0} max={10} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={' / 10'}/></div>}
                                                            {property._id === "resistantImpact" && <div className="rating__container"><RatingLine colorValue='lilac' min={0} max={10} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={' / 10'}/></div>}
                                                            {(property._id === "minTemp" || property._id === "maxTemp" || property._id === "thermalExpansion" || property._id === "density") && <span>{fiber.params[property._id]} <span>{property.unit[lang]}</span></span>}
                                                            {(property._id === "flexible" 
                                                            || property._id === "elastic"
                                                            || property._id === "soft"
                                                            || property._id === "composite"
                                                            || property._id === "resistantUV"
                                                            || property._id === "resistantWater"
                                                            || property._id === "dissolvable"
                                                            || property._id === "resistantHeat"
                                                            || property._id === "resistantChemically"
                                                            || property._id === "resistantFatigue"
                                                            || property._id === "cutting"
                                                            || property._id === "grinding"
                                                            ) && <SvgInserter type={fiber.params[property._id] === 2 ? 'plus' : fiber.params[property._id] === 0 ? 'minus' : 'con'}/>}
                                                            {property._id === "price" && <RatingMoney value={fiber.params.price} max={5} text={``} measurment={''} />}
                                                        </div>
                                                    :
                                                        null
                                                }
                                                </>
                                            )
                                        })}
                                        <div className={`cell col-name_last  ${fiber._id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber._id, '')}>
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