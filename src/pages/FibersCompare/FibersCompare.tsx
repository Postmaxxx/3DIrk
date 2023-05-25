import './FibersCompare.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor, TLangText } from "../../interfaces";
import { useEffect, useState, Fragment } from 'react'; 
import Preloader from 'src/components/Preloaders/Preloader';
import { loadFibers }  from "../../redux/actions/fibers"
import { loadColors }  from "../../redux/actions/colors"
import { NavLink } from 'react-router-dom';
import SvgInserter from 'src/components/tiny/SvgInserter/SvgInserter';

const actionsListFibers = { loadFibers }
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
    "price",
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
] as const

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
            en: 'flexible',
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
            en: 'soft',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    composite: {
        name: {
            en: 'composite',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantUV: {
        name: {
            en: 'resistantUV',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantWater: {
        name: {
            en: 'resistantWater',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    dissolvable: {
        name: {
            en: 'dissolvable',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantHeat: {
        name: {
            en: 'resistantHeat',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantChemically: {
        name: {
            en: 'resistantChemically',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    resistantFatigue: {
        name: {
            en: 'resistantFatigue',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    cutting: {
        name: {
            en: 'cutting',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    grinding: {
        name: {
            en: 'grinding',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        }
    },
    speed: {
        name: {
            en: 'speed',
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
            setLoaded(true)

        }
    }, [colors.dataLoading?.status, fibers.dataLoading?.status])
    



    return (
        <div className="page page_compare">
            <div className="container_page">
                <div className="container_compare">
                    <h1>{lang === 'en' ? 'Fiber compare table' : 'Таблица сравнения материалов'}</h1>
                    <div className="table__container">
                        {loaded ? 
                            <div className="table">
                                <div className="cell name_raw fixed-left">
                                    <span></span>
                                </div>
                                <div className="cell name_raw fixed-left">
                                    <button className='button_blue'>{lang === 'en' ? 'Compare selected' : 'Сравнить выбранные'}</button>
                                </div>
                                {propertiesList.map((property, i) => {
                                    return (
                                        <div className="cell name_raw fixed-left with-tip">
                                            <span>{propertiesValues[property].name[lang]}</span>
                                            <div className='tip' title={propertiesValues[property].tip[lang]}>
                                                <SvgInserter type={'question'}/>
                                            </div>
                                        </div>
                                    )
                                })}



                                {/*<div className="cell name_raw fixed-left with-tip ">
                                    <span>{lang === 'en' ? 'Strength' : 'Прочность'}</span>
                                    <div className='tip' title={lang === 'en' ? 'The maximum stress that a material can withstand without breaking.' : 'Максимальная нагрузка, которую материал может выдержать без разрушения.'}>
                                        <SvgInserter type={'question'}/>
                                    </div>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Stiffness' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Durability' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Min usage temp' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Max usage temp' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Thermal expansion' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Density' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Flexible' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Elastic' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Soft' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Composite' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Impact resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'UV resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Water resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Heat resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Chemically resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Dissolvable' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Fatigue resistant' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Cutting' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Grinding' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Speed' : 'Прочность'}</span>
                                </div>
                                <div className="cell name_raw fixed-left with-tip">
                                    <span>{lang === 'en' ? 'Price' : 'Прочность'}</span>
                                </div>*/}
                                <div className="cell name_raw fixed-left">
                                    <span></span>
                                </div>

                                {fibers.fibersList.map((fiber, i) => {
                                    return (
                                    <Fragment key={i}>
                                        <div className="cell name_col">
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
                                        <div className="cell">
                                            <input type="checkbox"/>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.strength}</span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.stiffnes}</span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.durability}</span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.minTemp} <span>°C</span></span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.maxTemp} <span>°C</span></span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.thermalExpansion} <span>µm/m-°C</span></span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.density} <span>g/cm<sup>3</sup></span></span>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.flexible === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.elastic === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.soft === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.composite === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantImpact === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantUV === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantWater === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantHeat === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantChemically === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.dissolvable === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.resistantFatigue === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.cutting === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <SvgInserter type={fiber.params.grinding === 0 ? 'minus' : 'plus'}/>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.speed}</span>
                                        </div>
                                        <div className="cell">
                                            <span>{fiber.params.price}</span>
                                        </div>
                                        <div className="cell name_col_last">
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