import { IPortfolioData, TLang } from "src/interfaces"


const ListFeatures = ({portfolioData, lang, remove, edit} : {portfolioData: IPortfolioData, lang: TLang, remove: (i:number, lang: TLang) => void, edit: (i:number, lang: TLang) => void}) => {
    return (
        <>
            <h3>{lang === 'En' ? 'Portfolio features' : 'Свойства портфолио'}: {portfolioData.filedescr}</h3>
            <div className="features__container">
                <div className="features__list">
                    <h4>{lang === 'En' ? 'English' : 'Английский'}</h4>
                    {portfolioData.features.En.map((feature: any, index: number) => {
                        return (
                            <div className="feature" key={index}>
                                <span>{feature.name}: </span>
                                <span>{feature.value}</span>
                                <button onClick={() => edit(index, 'En')}>Edit</button>
                                <button onClick={() => remove(index, 'En')}>Delete</button>
                            </div>
                        )
                    })}
                </div>
                <div className="features__list">
                    <h4>{lang === 'En' ? 'Russian' : 'Русский'}</h4>
                    {portfolioData.features.Ru.map((feature: any, index: number) => {
                        return (
                            <div className="feature" key={index}>
                                <span>{feature.name}: </span>
                                <span>{feature.value}</span>
                                <button onClick={() => edit(index, 'Ru')}>Edit</button>
                                <button onClick={() => remove(index, 'Ru')}>Delete</button>
                            </div>
                        )
                    })}
                </div>

            </div>
        </> 
    )
}

export default ListFeatures