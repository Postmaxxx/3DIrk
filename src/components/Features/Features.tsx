import { IFeature, IFiber, IFiberParam, TLang, TLangText } from '../../interfaces'
import './features.scss'
import { ratingNumberToText } from '../../assets/js/processors'
import { fibersProperties } from '../../assets/data/fibersProperties'

interface IProps {  
    params: IFiberParam
	fiber: IFiber
    lang: TLang
}

const Features = ({params, lang, fiber} : IProps) => {


    return (
        <div className="features">
            {fibersProperties
                .filter(property => property.id !== 'maxTemp')
                .map((property, i) => {
                return (
                    <div className="feature__container" key={property.id}>
                        {(property.id === "strength" || property.id === "thermalExpansion" || property.id === "density") && <div className="feature"><span>{property.name[lang]}: </span><span></span><span>{params[property.id]} {property.unit[lang]}</span></div>}
                        {(property.id === "stiffnes" || property.id === "durability" || property.id === "resistantImpact") && <div className="feature"><span>{property.name[lang]}: </span><span></span><span>{ratingNumberToText(params.stiffnes, 10)[lang]}</span></div>}
                        {property.id === "minTemp" && <div className="feature"><span>{lang === "en" ? "Temperetures" : 't использования'}: </span><span></span><span>{params.minTemp} ... {params.maxTemp} {property.unit[lang]}</span></div>}

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
                        ) && <div className="feature"><span>{property.name[lang]}: </span><span></span><span>{ratingNumberToText(params[property.id]+1, 3)[lang]}</span></div>}

                        {/*property === "speed" && <div className="feature"><span>{property.name[lang]}: </span><span></span><span>{ratingNumberToText(params[property]+1, 10)[lang]}</span></div>*/}
                        {property.id === "price" && <div className="feature"><span>{property.name[lang]}: </span><span></span><span>{fiber.params.priceGr} {property.unit[lang]}</span></div>}

                    </div>
                )
            })}

        </div>
    )
}

export default Features