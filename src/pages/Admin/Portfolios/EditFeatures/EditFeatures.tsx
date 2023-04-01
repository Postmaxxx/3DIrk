import { useState } from "react"
import { IFeature, TLang, IProtfolioState } from "src/interfaces"
import './editFeatures.scss'

interface props {
    siteLang: TLang
    portfolio: IProtfolioState
    save: ({name, value}: IFeature) => void
    cancel: () => void
}

const EditFeatures = ({siteLang, portfolio, save, cancel} : props) => {
    const { editingLang, editingFeatureIndex } = portfolio
    const initialName =  portfolio.portfolioData.features[editingLang][editingFeatureIndex].name
    const initialValue =  portfolio.portfolioData.features[editingLang][editingFeatureIndex].value
    const [name, setName] = useState<string>(initialName)
    const [value, setValue] = useState<string>(initialValue)

    return (
        <div className="portfolio__edit">
            {portfolio.status === 'editing' && <h3>{siteLang === 'En' ? 'Edit feature' : 'Редактирование свойства'}</h3>}
            {portfolio.status === 'adding' && <h3>{siteLang === 'En' ? 'Add feature' : 'Добавление свойства'}</h3>}
            
            <div className="features__container">
                <div className="features__edit">
					<label>
						<span>{siteLang === 'En' ? 'Property' : 'Свойство'}: </span>
						<input data-edit="nameEn" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
					</label>
					<label>
						<span>{siteLang === 'En' ? 'Value' : 'Значение'}: </span>
						<input data-edit="nameRu" type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
					</label>
                    <div className="buttons">
                        <button onClick={() => save({name: name, value: value})}>{siteLang === 'En' ? 'Save' : 'Сохранить'}</button>
                        <button onClick={() => cancel()}>{siteLang === 'En' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EditFeatures