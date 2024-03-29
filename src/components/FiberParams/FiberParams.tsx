import { IFiber, IFiberParam, TLang } from '../../interfaces'
import './fiber-params.scss'
import { ratingNumberToText } from '../../assets/js/processors'
import { IFiberProperties, fibersProperties } from '../../assets/data/fibersProperties'
import { useMemo } from "react";

interface IProps {  
    params: IFiberParam
	fiber: IFiber
    lang: TLang
}

const FiberParams: React.FC<IProps> = ({params, lang, fiber}): JSX.Element => {

    const getFiberType = (param: IFiberProperties): JSX.Element => {
        if (param._id === "minTemp") {
            return <div className="param">
                    <span aria-label={lang === 'en' ? `Using temperatures: from ${params.minTemp} to ${params.maxTemp} ${param.unit[lang]}` : `Температуры использования: от ${params.minTemp} до ${params.maxTemp} ${param.unit[lang]}`}>{lang === "en" ? "Temperetures" : 't использования'}: </span>
                    <span></span><span>{params.minTemp} ... {params.maxTemp} {param.unit[lang]}</span>
                </div>
        }
        if (param.type === 'string') {
            return <div className="param"><span>{param.name[lang]}: </span><span></span><span>{params[param._id]} {param.unit[lang]}</span></div>
        } else {
            return <div className="param"><span>{param.name[lang]}: </span><span></span><span>{ratingNumberToText(String(params[param._id]), param.type)[lang]}</span></div>
        }
    }   


    const renderPropery = useMemo(() => {
        return fibersProperties
            .filter(param => param._id !== 'maxTemp')
            ?.map((param) => {
                return (
                    <div className="param-container" key={param._id}>
                        {getFiberType(param)}
                    </div>
                )

        })
    }, [lang, fiber])

    return (
        <div className="fiber-params">
            {renderPropery}
        </div>
    )
}

export default FiberParams
