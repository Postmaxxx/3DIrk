import { IFeature, IFiber, IFiberParam, TLang, TLangText } from '../../interfaces'
import './features.scss'
import { ratingNumberToText } from '../../assets/js/processors'
import { propertiesValues, propertiesList } from '../../assets/data/fibers'

interface IProps {  
    params: IFiberParam
	fiber: IFiber
    lang: TLang
}

const Features = ({params, lang, fiber} : IProps) => {


    return (
        <div className="features">
            {propertiesList
                .filter(property => property !== 'maxTemp')
                .map((property, i) => {
                return (
                    <div className="feature__container" key={property}>
                        {(property === "strength" || property === "thermalExpansion" || property === "density") && <div className="feature"><span>{propertiesValues[property].name[lang]}: </span><span></span><span>{params[property]} {propertiesValues[property].unit[lang]}</span></div>}
                        {(property === "stiffnes" || property === "durability" || property === "resistantImpact") && <div className="feature"><span>{propertiesValues[property].name[lang]}: </span><span></span><span>{ratingNumberToText(params.stiffnes, 10)[lang]}</span></div>}
                        {property === "minTemp" && <div className="feature"><span>{lang === "en" ? "Temperetures" : 't использования'}: </span><span></span><span>{params.minTemp} ... {params.maxTemp} {propertiesValues[property].unit[lang]}</span></div>}

                        {(property === "flexible" 
                        || property === "elastic"
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
                        ) && <div className="feature"><span>{propertiesValues[property].name[lang]}: </span><span></span><span>{ratingNumberToText(params[property]+1, 3)[lang]}</span></div>}

                        {/*property === "speed" && <div className="feature"><span>{propertiesValues[property].name[lang]}: </span><span></span><span>{ratingNumberToText(params[property]+1, 10)[lang]}</span></div>*/}
                        {property === "price" && <div className="feature"><span>{propertiesValues[property].name[lang]}: </span><span></span><span>{fiber.params.priceGr} {propertiesValues.price.unit[lang]}</span></div>}

                    </div>
                )
            })}

        </div>
    )
}

export default Features