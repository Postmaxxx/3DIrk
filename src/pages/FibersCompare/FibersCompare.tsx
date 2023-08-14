import './FibersCompare.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IFiber } from "../../interfaces";
import { useEffect, useState, Fragment, useMemo, useCallback } from 'react'; 
import Preloader from '../../components/Preloaders/Preloader';
import { NavLink } from 'react-router-dom';
import SvgInserter from '../../components/SvgInserter/SvgInserter';
import RatingLine from '../../components/RatingLine/RatingLine';
import RatingMoney from '../../components/RatingMoney/RatingMoney';
import { fibersProperties } from '../../assets/data/fibersProperties';
import { allActions } from "../../redux/actions/all";
import { strengthMax, strengthMin, tipsTransition } from '../../assets/js/consts';
import ErrorFetch from '../../components/ErrorFetch/ErrorFetch';
import PicWithPreloader from '../../../src/assets/js/PicWithPreloader';


interface IPropsState {
    lang: TLang,
    fibersState: IFibersState
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
    }
}

interface IProps extends IPropsState, IPropsActions {}

const FibersCompare:React.FC<IProps> = ({lang, fibersState, setState}):JSX.Element => {
    const [filtered, setFiltered] = useState<boolean>(false)
    const [selectError, setSelectError] = useState<boolean>(false)
    const [selectedMore, setSelectedMore] = useState<boolean>(false)
    const [selectedProperty, setSelectedProperty] = useState<any>()
    const [showList, setShowList] = useState<IFiber['_id'][]>([])
    const [fibersList, setFibersList] = useState<IFiber[]>([]) //for sort fibers

    useEffect(() => {
        if (fibersState.load.status === 'success') {
            setFibersList(fibersState.fibersList)
            clearSelected()
        }        
    }, [fibersState.load.status])
   

    const clearCheckboxes = useCallback(() => {
        Array.from(document.querySelectorAll('[data-fiberselect]'))?.forEach(item => (item as HTMLInputElement).checked = false)
    }, [])


    const compareSelected = useCallback(() => {       
        const selectedFibers:IFiber['_id'][] = Array.from(document.querySelectorAll('[data-fiberselect]'))
            ?.filter(item => (item as HTMLInputElement).checked)
            ?.map(input => (input as HTMLInputElement).dataset.fiberselect as IFiber['_id']) 
        if (selectedFibers.length < 2) {
            return setSelectError(true)
        }
        setShowList(selectedFibers)
        setFiltered(true)
        clearCheckboxes()
        setSelectedMore(false)
    }, [])


    useEffect(() => {
        const tip = setTimeout(() => {setSelectError(false)}, tipsTransition)
        return () => clearTimeout(tip)
    }, [selectError])


    const clearSelected = () => {
        setFiltered(false)  
        setShowList(fibersState.fibersList.filter(fiber => fiber.active)?.map(fiber => fiber._id))
        clearCheckboxes()
    }



    const onCheckbox = () => {
        setSelectError(false)
        filtered && setSelectedMore(true)
    }


    const onCellClick = (id: IFiber['_id'], propertyName: string) => { 
        setState.fibers.setSelectedFiber(id)
        propertyName && setSelectedProperty(propertyName)
    }


    const sortByProperty = (_id: string) => {
        setFibersList(prev => {
            let reversed: boolean = true //if newFibers already sorted in reverse order 
            const newFibers = [...prev]
            newFibers.sort((fiberA, fiberB) => { 
                const delta = (fiberA.params[_id] as number) - (fiberB.params[_id] as number)
                delta < 0 && (reversed = false)
                return delta
            })
            return reversed ? newFibers.reverse() : newFibers
        })
    }


    const renderProperties = useMemo(() => {
        return fibersProperties.map((property) => {
            return property._id !== 'priceGr' && 
                <div className="cell row-name fixed-left padding_no" key={property._id}>
                    <button onClick={() => sortByProperty(property._id)}>
                        <span>{property.name[lang]}</span>
                        {/*<div className='tip' tip-text={property.tip[lang]}>
                            <SvgInserter type={'question'}/>
                        </div>*/}
                    </button>
                </div>
        }
    )}, [lang, fibersList, lang])



    const renderFiberList = useMemo(() => fibersList
        .filter(fiber => showList.includes(fiber._id))
        ?.map((fiber) => {
            return (
                <Fragment key={fiber._id}>
                    <div className={`cell col-name ${fiber._id === fibersState.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber._id, '')} >
                        <div className="img-cont">
                            <PicWithPreloader pathList={fiber.images.paths} image={fiber.images.files[0]} alt={fiber.name[lang]}/>
                        </div>
                        <span className='fiber-name'>{fiber.short.name[lang]}</span>
                        <NavLink to={`../${fiber._id}`} className='button_blue button_sort'>
                                {lang === 'en' ? 'Learn more' : 'Подробнее'}
                        </NavLink>
                    </div>
                    <div className={`cell cell_checkbox ${fiber._id === fibersState.selected ? "selected" : ""}`}>
                        <label>
                            <input type="checkbox" data-fiberselect={fiber._id} onChange={onCheckbox}/>
                            <span></span>
                        </label>
                    </div>
                    {fibersProperties.map((property) => {                                                
                        return (
                            <Fragment key={property._id}>
                                {property._id !== 'priceGr' && //filter, priceGr won't shown in this table
                                    <div className={`cell ${fiber._id === fibersState.selected ? 'selected' : ''} ${selectedProperty === property._id ? 'selected' : ''}`} key={`${fiber._id}-${property._id}`}  onClick={() => onCellClick(fiber._id, property._id)}>
                                        {property._id === "strength" && <div className="rating__container"><RatingLine colorValue='blue' min={strengthMin} max={strengthMax} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={property.unit[lang]}/></div>}
                                        {property._id === "stiffnes" && <div className="rating__container"><RatingLine colorValue='red' value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={property.unit[lang]}/></div>}
                                        {property._id === "durability" && <div className="rating__container"><RatingLine colorValue='green' value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={property.unit[lang]}/></div>}
                                        {property._id === "resistantImpact" && <div className="rating__container"><RatingLine colorValue='lilac' value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={property.unit[lang]}/></div>}
                                        {(property._id === "minTemp" || property._id === "maxTemp" || property._id === "thermalExpansion" || property._id === "density") && <span className='values_numeric'>{fiber.params[property._id]} <span>{property.unit[lang]}</span></span>}
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
                                        ) && <SvgInserter type={fiber.params[property._id] === 3 ? 'plus' : fiber.params[property._id] === 1 ? 'minus' : 'question'}/>}
                                        {property._id === "price" && <RatingMoney value={fiber.params.price} max={5} text={``} measurment={''} fullFormat={false}/>}
                                    </div>
                                }
                            </Fragment>
                        )
                    })}
                    <div className={`cell col-name_last  ${fiber._id === fibersState.selected ? "selected" : ""}`} onClick={() => onCellClick(fiber._id, '')}>
                        <span>{fiber.short.name[lang]}</span>
                    </div>
                </Fragment>
            )
        }
    ), [fibersList, lang, fibersState.selected, selectedProperty, showList])



    return (
        <div className="page page_compare">
            <div className="container_page">
                <section className="fibers-compare">
                    <div className="block_text">
                        <h1>{lang === 'en' ? 'Filaments comparison' : 'Сравнение филаментов'}</h1>
                        <p>{lang === 'en' ? 'You can click at the feature on the left to sort fibers in forward or reverse order by clicked feature' : 'Вы можете кликнуть по свойству слева чтобы отсортировать материалы по данному свойству'}</p>
                    </div>
                    <div className="table__container">
                        {fibersState.load.status === 'success' && 
                            <div className="table">
                                <div className="cell row-name fixed-left"></div>
                                <div className="cell row-name fixed-left selectors">
                                    {(filtered && !selectedMore) && <button className='button_blue button_reset' onClick={clearSelected}>{lang === 'en' ? 'Show all' : 'Показать все'}</button>}
                                    {(!filtered || selectedMore) && <button className='button_blue button_compare' onClick={compareSelected}>{lang === 'en' ? 'Compare' : 'Сравнить'}</button>}
                                    {selectError && <span className='error-message'>{lang === 'en' ? `select > 1` : `выберите > 1`}</span>}
                                </div>
                                {renderProperties}
                                <div className="cell row-name fixed-left row-name_last"></div>
                                {renderFiberList}
                            </div>}
                        {fibersState.load.status === 'fetching' && <Preloader />}
                        {fibersState.load.status === 'error' && <ErrorFetch fetchData={fibersState.load} lang={lang} />}
                    </div>
                </section>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibersState: state.fibers,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(FibersCompare)