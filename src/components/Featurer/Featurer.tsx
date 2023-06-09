import { IImgWithThumb, TLang, TLangText } from '../../interfaces';
import './featurer.scss'
import { useEffect, useState, forwardRef, useImperativeHandle  } from "react";
import { prevent } from '../../assets/js/processors';
import { empty } from '../../assets/js/consts';


interface IItem {
    _id: string
    name: TLangText
}


interface IProps {
    lang: TLang
}


export interface IFeaturerFunctions {
    setFeatures: (items: IItem[]) => void;
    getFeatures: () => IItem[];
}



const Featurer = forwardRef<IFeaturerFunctions, IProps>(({lang}, ref) => {
    useImperativeHandle(ref, () => ({
        setFeatures(items) {
            setFeatures(items || [])
        },
        getFeatures() {
            return features
        },
    }));

    const [features, setFeatures] = useState<{_id: string, name: {en: string, ru: string}}[]>([])

    const onEditFeature = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.target.parentElement?.classList.remove('error')
        setFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures[index].name[e.target.name as TLang] = e.target.value
            return newFeatures
        })
    }


    const onDeleteFeature = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        prevent(e)
        setFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures.splice(index, 1)
            return newFeatures
        })
    }


    const onAddFeature = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        setFeatures(prev => [...prev, {_id: '', name: {...empty}}])
    }



    return (
        <div className="features__container">
            <div className="features">
                {features.map((item, i) => {
                    return (
                        <div className="block_feature full-width" key={i}>
                            <div className="input__wrapper">
                                <label>{lang === 'en' ? 'Value EN' : 'Значение EN'}</label>
                                <input name="en" type="text" onChange={(e) => onEditFeature(e, i)} value={item.name.en} />
                            </div>
                            <div className="input__wrapper">
                                <label>{lang === 'en' ? 'Value RU' : 'Значение RU'}</label>
                                <input name="ru" type="text" onChange={(e) => onEditFeature(e, i)} value={item.name.ru}/>
                            </div>
                            <button className="button_blue del" onClick={(e) => {onDeleteFeature(e, i)}}>X</button>
                        </div>
    
                    )
                })}
            </div>
            <button className='button_blue add' onClick={onAddFeature}>{lang === 'en' ? '+' : '+'}</button>
        </div>



    )
})


export default Featurer
    


