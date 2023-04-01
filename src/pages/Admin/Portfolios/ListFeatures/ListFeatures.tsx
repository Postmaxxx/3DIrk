import { IFeature, IPortfolioData, TLang } from "src/interfaces"
import Portfolio from "../../../Portfolio/Portfolio"
import { IProtfolioState } from "src/interfaces"
import './listFeatures.scss'

interface props {
    portfolio: IProtfolioState
    siteLang: TLang
    remove: ({index, lang} : {index:number, lang: TLang}) => void
    edit: ({index, lang} : {index:number, lang: TLang}) => void
    add: ({addLang}: {addLang: TLang}) => void
}

const ListFeatures = ({portfolio, siteLang, remove, edit, add} : props) => {
    const langs = Object.keys(portfolio.portfolioData.features) as TLang[]
    return (
        <div className='portfolio__features'>
            <h3>{siteLang === 'En' ? 'Portfolio features' : 'Свойства портфолио'}: {portfolio.portfolioData.descr}</h3>
            <div className="features__container">
                {langs.map(lang => (
                    <div className="features__block" key={lang}>
                        <div className="features__list">
                            <h4>{lang}</h4>
                            {portfolio.portfolioData.features[lang].map((feature: IFeature, index: number) => {
                                return feature.name ? 
                                    (
                                        <div className="feature" key={feature.name}>
                                            <span>{feature.name}: </span>
                                            <span>{feature.value}</span>
                                            <button disabled={!!portfolio.status} onClick={() => remove({index: index, lang: lang})}>X</button>
                                            <button disabled={!!portfolio.status} onClick={() => edit({index: index, lang: lang})}>E</button>
                                        </div>
                                    ) : (null)
                                
                            })}
                        </div>
                        <button className="feature_add" disabled={!!portfolio.status} onClick={() => add({addLang: lang})}>+</button>
                    </div>
                ))}
            </div>
        </div> 
    )
}

export default ListFeatures