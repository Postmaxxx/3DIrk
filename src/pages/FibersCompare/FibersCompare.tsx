import './FibersCompare.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IFiber } from "../../interfaces";
import { useEffect, useState, Fragment, useMemo } from 'react'; 
import Preloader from '../../components/Preloaders/Preloader';
import { NavLink } from 'react-router-dom';
import SvgInserter from '../../components/tiny/SvgInserter/SvgInserter';
import RatingLine from '../../components/tiny/RatingLine/RatingLine';
import RatingMoney from '../../components/tiny/RatingMoney/RatingMoney';
import { fibersProperties } from '../../assets/data/fibersProperties';
import { allActions } from "../../redux/actions/all";
import ErrorMock from '../../components/tiny/ErrorMock/ErrorMock';
import { strengthMax, strengthMin } from '../../assets/js/consts';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { checkAndLoad } from '../../assets/js/processors';



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
        /*if (fibersState.load.status !== 'success' && fibersState.load.status !== 'fetching') {
            setState.fibers.loadFibers()
        }*/
        checkAndLoad(fibersState.load.status, setState.fibers.loadFibers)

        if (fibersState.load.status === 'success') {
            setFibersList(fibersState.fibersList)
            clearSelected()
            setShowList(fibersState.fibersList.map(fiber => fiber._id))
        }        
    }, [fibersState.load.status])
   


    const clearCheckboxes = () => {
        Array.from(document.querySelectorAll('[data-fiberselect]')).forEach(item => (item as HTMLInputElement).checked = false)
    }


    const compareSelected = () => {       
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
        setShowList(fibersState.fibersList.map(fiber => fiber._id))
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


    const sortByProperty = (_id: string) => {
        setFibersList(prev => {
            let reverse: boolean = true
            const newFibers = prev.sort((fiberA, fiberB) => { 
                const delta = (fiberA.params[_id] as number) - (fiberB.params[_id] as number)
                delta < 0 ? reverse = false : null
                return delta
            })
            return reverse ? [...newFibers.reverse()] : [...newFibers]
        })
    }


    const renderProperties = useMemo(() => {
        return fibersProperties.map((property, i) => {
            return property._id !== 'priceGr' && 
                <div className="cell row-name fixed-left with-tip padding_no" key={property._id}>
                    <button onClick={() => sortByProperty(property._id)} title={`${lang === 'en' ? 'Sort fibers by' : 'Отсортировать материалы по свойству '} ${property.name[lang]}`}>
                        <span>{property.name[lang]}</span>
                        <div className='tip' title={property.tip[lang]}>
                            <SvgInserter type={'question'}/>
                        </div>
                    </button>
                </div>
        }
    )}, [lang, fibersList, lang])


    const renderFiberList = useMemo(() => fibersList
        .filter(fiber => showList.includes(fiber._id))
        .map((fiber, i) => {
            return (
                <Fragment key={fiber._id}>
                    <div className={`cell col-name ${fiber._id === fibersState.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber._id, '')} >
                        <div className="img__container">
                            <ImgWithPreloader src={`${fiber.images.paths.small}/${fiber.images.files[0]}`} alt={fiber.images.files[0]}  />
                            <span>{fiber.short.name[lang]}</span>
                        </div>
                        <NavLink 
                            to={`../${fiber._id}`}
                            className='button_blue'
                            >
                                {lang === 'en' ? 'Learn more' : 'Подробнее'}
                        </NavLink>
                    </div>
                    <div className={`cell cell_checkbox ${fiber._id === fibersState.selected ? "selected" : ""}`}>
                        <label>
                            <input type="checkbox" data-fiberselect={fiber._id} onChange={onCheckbox}/>
                            <span></span>
                        </label>
                    </div>
                    {fibersProperties.map((property, i) => {                                                
                        return (
                            <Fragment key={property._id}>
                                {property._id !== 'priceGr' ? 
                                    <div className={`cell ${fiber._id === fibersState.selected ? 'selected' : ''} ${selectedProperty === property._id ? 'selected' : ''}`} key={`${fiber._id}-${property._id}`}  onClick={e => onCellClick(fiber._id, property._id)}>
                                        {property._id === "strength" && <div className="rating__container"><RatingLine colorValue='blue' min={strengthMin} max={strengthMax} value={fiber.params[property._id]} text={`${fiber.params[property._id]}`} measurment={lang === 'en' ? ' MPa' : ' МПа'}/></div>}
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
                                        ) && <SvgInserter type={fiber.params[property._id] === 3 ? 'plus' : fiber.params[property._id] === 1 ? 'minus' : 'question'}/>}
                                        {property._id === "price" && <RatingMoney value={fiber.params.price} max={5} text={``} measurment={''} />}
                                    </div>
                                :
                                    null
                            }
                            </Fragment>
                        )
                    })}
                    <div className={`cell col-name_last  ${fiber._id === fibersState.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber._id, '')}>
                        <span>{fiber.short.name[lang]}</span>
                    </div>

                </Fragment>
            )
        })
    , [fibersList, lang, fibersState.selected, selectedProperty, showList])





    return (
        <div className="page page_compare">
            <div className="container_page">
                <div className="container_compare">
                    <div className="block_text">
                        <h1>{lang === 'en' ? 'Filaments comparison' : 'Сравнение филаментов'}</h1>
                        <p>{lang === 'en' ? 'You can click at the feature on the left to sort fibers in forward or reverse order by this feature' : 'Вы можете кликнуть по свойству слева чтобы отсортировать материалы по данному свойству'}</p>
                    </div>
                    <div className="table__container">
                        {fibersState.load.status === 'success' && 
                            <div className="table">
                                <div className="cell row-name fixed-left">
                                    <span></span>
                                </div>
                                
                                <div className="cell row-name fixed-left selectors">
                                    {(filtered && !selectedMore) && <button className='button_blue' onClick={clearSelected}>{lang === 'en' ? 'Show all' : 'Показать все'}</button>}
                                    {(!filtered || selectedMore) && <button className='button_blue' onClick={compareSelected}>{lang === 'en' ? 'Compare' : 'Сравнить'}</button>}
                                    {selectError && <span className='error-message'>{lang === 'en' ? `select > 1` : `выберите > 1`}</span>}
                                </div>
                                {renderProperties}
                                <div className="cell row-name fixed-left row-name_last">
                                    <span></span>
                                </div>
                                {renderFiberList}
                            </div>}
                        {fibersState.load.status === 'fetching' && <Preloader />}
                        {fibersState.load.status === 'error' && <ErrorMock lang={lang} comp={{en: 'fibers', ru: 'материалов'}} />}
                    </div>
                </div>
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