import './FibersCompare.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor, TLangText, IFiber } from "../../interfaces";
import { useEffect, useState, Fragment } from 'react'; 
import Preloader from 'src/components/Preloaders/Preloader';
import { loadFibers, setShowListFibers, setSelectedFiber }  from "../../redux/actions/fibers"
import { loadColors }  from "../../redux/actions/colors"
import { NavLink } from 'react-router-dom';
import SvgInserter from 'src/components/tiny/SvgInserter/SvgInserter';
import RatingLine from 'src/components/tiny/RatingLine/RatingLine';

const actionsListFibers = { loadFibers, setShowListFibers, setSelectedFiber }
const actionsListColors = { loadColors }

interface IPropsState {
    lang: TLang,
    fibers: IFibersState
    colors: IColorsState
}

interface IPropsActions {
    setState: {
        fibers: typeof actionsListFibers
        colors: typeof actionsListColors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const propertiesList = [
    "strength",
    "stiffnes",
    "durability",
    "minTemp",
    "maxTemp",
    "thermalExpansion",
    "density",
    "flexible",
    "elastic",
    "resistantImpact",
    "soft",
    "composite",
    "resistantUV",
    "resistantWater",
    "dissolvable",
    "resistantHeat",
    "resistantChemically",
    "resistantFatigue",
    "cutting",
    "grinding",
    "speed",
    "price",
] as const
/*
type TPropertyType = "text" | "icon" | "rating"

type TPropertiesTypes = {
    [key in IPropertyTypes] : {
        type: TPropertyType,
        prefix:
    }
}

const propertiesTypes: TPropertiesTypes = {
    strength: {
        type: 'text',
        prefix: '',
        postfix: ''
    }
}
*/
type IPropertyTypes = typeof propertiesList[number]; 

type TPropertiesValues = {
    [key in IPropertyTypes] : {
        name: TLangText
        tip: TLangText
    }
}

const propertiesValues: TPropertiesValues = {
    strength: {
        name: {
            en: 'Strength',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    stiffnes: {
        name: {
            en: 'Stiffnes',
            ru: 'SПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    durability: {
        name: {
            en: 'Durability',
            ru: 'DПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    minTemp: {
        name: {
            en: 'Min usage temp',
            ru: 'mПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    maxTemp: {
        name: {
            en: 'Max usage temp',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    thermalExpansion: {
        name: {
            en: 'Thermal expansion',
            ru: 'svПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    density: {
        name: {
            en: 'Density',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    price: {
        name: {
            en: 'Price',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    flexible: {
        name: {
            en: 'Flexible',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    elastic: {
        name: {
            en: 'Elastic',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantImpact: {
        name: {
            en: 'Impact resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    soft: {
        name: {
            en: 'Soft',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    composite: {
        name: {
            en: 'Composite',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantUV: {
        name: {
            en: 'UV resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantWater: {
        name: {
            en: 'Water resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    dissolvable: {
        name: {
            en: 'Dissolvable',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantHeat: {
        name: {
            en: 'Heat resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantChemically: {
        name: {
            en: 'Chemically resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantFatigue: {
        name: {
            en: 'Fatigue resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    cutting: {
        name: {
            en: 'Cutting',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    grinding: {
        name: {
            en: 'Grinding',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    speed: {
        name: {
            en: 'Speed',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
}



const FibersCompare:React.FC<IProps> = ({lang, fibers, colors, setState}):JSX.Element => {

    const [loaded, setLoaded] = useState<boolean>(false)
    const [filtered, setFiltered] = useState<boolean>(false)
    const [selectError, setSelectError] = useState<boolean>(false)
    const [selectedMore, setSelectedMore] = useState<boolean>(false)
    const [selectedProperty, setSelectedProperty] = useState<IPropertyTypes>()

    useEffect(() => {
        if (fibers.dataLoading.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
        if (colors.dataLoading.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
        if (colors.dataLoading.status === 'success' && fibers.dataLoading.status === 'success') {
            setState.fibers.setShowListFibers(fibers.fibersList.map(fiber => fiber.id))
            setLoaded(true)
        }
    }, [colors.dataLoading?.status, fibers.dataLoading?.status])
   


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
        setState.fibers.setShowListFibers(selectedFibers)
        setFiltered(true)
        clearCheckboxes()
        setSelectedMore(false)
    }


    useEffect(() => {
        setTimeout(() => {setSelectError(false)}, 3000)
    }, [selectError])


    const clearSelected = () => {
        setFiltered(false)  
        setState.fibers.setShowListFibers(fibers.fibersList.map(fiber => fiber.id))
        clearCheckboxes()
    }



    const onCheckbox = () => {
        setSelectError(false)
        if (filtered) {
            setSelectedMore(true)
        }
    }


    const onCellClick = (id: IFiber['id'], propertyName: IPropertyTypes | '') => { //
        setState.fibers.setSelectedFiber(id)
        if (propertyName) {
            setSelectedProperty(propertyName)
        }
    }


    /*
     onChange={e => changeSelected(fiber.id)} checked={fibers.showList.includes(fiber.id)}*/
    return (
        <div className="page page_compare">
            <div className="container_page">
                <div className="container_compare">
                    <h1>{lang === 'en' ? 'Filaments comparison' : 'Сравнение филаментов'}</h1>
                    <div className="table__container">
                        {loaded ? 
                            <div className="table">
                                <div className="cell name_raw fixed-left">
                                    <span></span>
                                </div>
                                
                                <div className="cell name_raw fixed-left selectors">
                                    {(filtered && !selectedMore) && <button className='button_blue' onClick={clearSelected}>{lang === 'en' ? 'Show all' : 'Показать все'}</button>}
                                    {(!filtered || selectedMore) && <button className='button_blue' onClick={compareSelected}>{lang === 'en' ? 'Compare' : 'Сравнить'}</button>}
                                       
                                        {selectError && <span className='error-message'>{lang === 'en' ? `select 2 or more` : `выберите 2 или более`}</span>}
                                </div>
                                {propertiesList.map((property) => {
                                    return (
                                        <NavLink 
                                            to='/fibers'>
                                            <div className="cell name_raw fixed-left with-tip" key={property}>
                                                <span>{propertiesValues[property].name[lang]}</span>
                                                <div className='tip' title={propertiesValues[property].tip[lang]}>
                                                    <SvgInserter type={'question'}/>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )
                                })}
                                <div className="cell name_raw fixed-left">
                                    <span></span>
                                </div>


                                {fibers.fibersList
                                    .filter(fiber => fibers.showList.includes(fiber.id))
                                    .map((fiber, i) => {
                                    return (
                                    <Fragment key={i}>
                                        <div className={`cell name_col ${fiber.id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber.id, '')} >
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
                                        <div className={`cell padding_no ${fiber.id === fibers.selected ? "selected" : ""}`}>
                                            <label>
                                                <input type="checkbox" data-fiberselect={fiber.id} onChange={onCheckbox}/>
                                                <span></span>
                                            </label>
                                        </div>
                                        {propertiesList.map((property, i) => {
                                            return (
                                                <div className={`cell ${fiber.id === fibers.selected ? 'selected' : ''} ${selectedProperty === property ? 'selected' : ''}`} key={property}  onClick={e => onCellClick(fiber.id, property)}>
                                                    {property === "strength" && <div className="rating__container"><RatingLine colorValue='blue' min={0} max={10} value={fiber.params[property]}/></div>}
                                                    {property === "stiffnes" && <div className="rating__container"><RatingLine colorValue='red' min={0} max={10} value={fiber.params[property]}/></div>}
                                                    {property === "durability" && <div className="rating__container"><RatingLine colorValue='green' min={0} max={10} value={fiber.params[property]}/></div>}
                                                    {(property === "minTemp" || property === "maxTemp") && <span>{fiber.params[property]} <span>°C</span></span>}
                                                    {property === "thermalExpansion" && <span>{fiber.params.thermalExpansion} <span>µm/m-°C</span></span>}
                                                    {property === "density" && <span>{fiber.params.density} <span>g/cm<sup>3</sup></span></span>}
                                                    {(property === "flexible" 
                                                    || property === "elastic"
                                                    || property === "resistantImpact"
                                                    || property === "soft"
                                                    || property === "composite"
                                                    || property === "resistantUV"
                                                    || property === "resistantWater"
                                                    || property === "dissolvable"
                                                    || property === "resistantHeat"
                                                    || property === "resistantChemically"
                                                    || property === "resistantFatigue"
                                                    || property === "cutting"
                                                    || property === "grinding"
                                                    ) && <SvgInserter type={fiber.params[property] === 2 ? 'plus' : fiber.params[property] === 1 ? 'minus' : 'con'}/>}
                                                    {property === "speed" && <span>{fiber.params.speed}</span>}
                                                    {property === "price" && <span>{fiber.params.price}</span>}
                                                    
                                                </div>
                                            )
                                        })}
                                        <div className={`cell name_col_last  ${fiber.id === fibers.selected ? "selected" : ""}`} onClick={e => onCellClick(fiber.id, '')}>
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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(actionsListFibers, dispatch),
		colors: bindActionCreators(actionsListColors, dispatch)
	}
})
    
export default connect(mapStateToProps, mapDispatchToProps)(FibersCompare)