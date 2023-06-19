import { IFiber, IFiberParam, TLang } from '../../interfaces'
import './params.scss'
import { ratingNumberToText } from '../../assets/js/processors'
import { fibersProperties } from '../../assets/data/fibersProperties'

interface IProps {  
    params: IFiberParam
	fiber: IFiber
    lang: TLang
}

const Params = ({params, lang, fiber} : IProps) => {


    return (
        <div className="params">
            {fibersProperties
                .filter(param => param._id !== 'maxTemp')
                .map((param, i) => {
                return (
                    <div className="param__container" key={param._id}>
                        {(param._id === "strength" || param._id === "thermalExpansion" || param._id === "density") && <div className="param"><span>{param.name[lang]}: </span><span></span><span>{params[param._id]} {param.unit[lang]}</span></div>}
                        {(param._id === "stiffnes" || param._id === "durability" || param._id === "resistantImpact") && <div className="param"><span>{param.name[lang]}: </span><span></span><span>{ratingNumberToText(String(params[param._id]), '10')[lang]}</span></div>}
                        {param._id === "minTemp" && <div className="param"><span>{lang === "en" ? "Temperetures" : 't использования'}: </span><span></span><span>{params.minTemp} ... {params.maxTemp} {param.unit[lang]}</span></div>}

                        {(param._id === "flexible" 
                        || param._id === "elastic"
                        || param._id === "soft"
                        || param._id === "composite"
                        || param._id === "resistantUV"
                        || param._id === "resistantWater"
                        || param._id === "dissolvable"
                        || param._id === "resistantHeat"
                        || param._id === "resistantChemically"
                        || param._id === "resistantFatigue"
                        || param._id === "cutting"
                        || param._id === "grinding"
                        ) && <div className="param"><span>{param.name[lang]}: </span><span></span><span>{ratingNumberToText(String(params[param._id]), '3')[lang]}</span></div>}
                          {param._id === "price" && <div className="param"><span>{param.name[lang]}: </span><span></span><span>{fiber.params.priceGr} {param.unit[lang]}</span></div>}

                    </div>
                )
            })}

        </div>
    )
}

export default Params