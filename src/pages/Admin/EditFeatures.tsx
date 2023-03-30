import { IFeature, TLang } from "src/interfaces"


const EditFeatures = ({lang, featureData} : {lang: TLang, featureData: IFeature}) => {
    return (
        <>
            <h3>{lang === 'En' ? 'Edit feature' : 'Редактирование свойства'}</h3>
            <div className="features__container">
                <div className="features__list">
                    <h4>{lang === 'En' ? 'English' : 'Английский'}</h4>
                        <div className="feature">
                            <span>{featureData.name}: </span>
                            <span>{featureData.value}</span>
                            <button >{lang === 'En' ? 'Save' : 'Сохранить'}</button>
                            <button >{lang === 'En' ? 'Cancel' : 'Отмена'}</button>
                        </div>
                </div>
            </div>
        </>
    )
}


export default EditFeatures