import { TLang, TLangText } from '../../interfaces';
import './featurer.scss'
import { useState, forwardRef, useImperativeHandle, useEffect  } from "react";
import { prevent } from '../../assets/js/processors';
import { empty } from '../../assets/js/consts';


interface IItem {
    _id: string
    name: TLangText
}


interface IProps {
    lang: TLang
    amountChanged?: (newAmount: number) => void
    valueChanged?: (target: HTMLInputElement) => void
}


export interface IFeaturerFunctions {
    setFeatures: (items: IItem[]) => void;
    getFeatures: () => IItem[];
}



const Featurer = forwardRef<IFeaturerFunctions, IProps>(({lang, amountChanged, valueChanged}, ref) => {
    useImperativeHandle(ref, () => ({
        setFeatures(items) {
            setFeatures(items || [])
        },
        getFeatures() {
            return features
        }
    }));

    const [features, setFeatures] = useState<{_id: string, name: {en: string, ru: string}}[]>([])

    const onEditFeature = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.target.parentElement?.classList.remove('error')
        setFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures[index].name[e.target.name as TLang] = e.target.value
            return newFeatures
        })
        valueChanged && valueChanged(e.target)
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
    
    
    useEffect(() => {
        amountChanged && amountChanged(features.length)
    }, [features.length])



    return (
        <div className="features__container">
            <div className="features">
                {features.map((item, i) => {
                    return (
                        <div className="block_feature full-width" key={i}>
                            <div className="input__wrapper" data-selector="input-block">
                                <label>{lang === 'en' ? 'Value EN' : 'Значение EN'}</label>
                                <input 
                                    data-selector="input"
                                    name="en" 
                                    type="text" 
                                    onChange={(e) => onEditFeature(e, i)} 
                                    value={item.name.en}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <label>{lang === 'en' ? 'Value RU' : 'Значение RU'}</label>
                                <input 
                                    data-selector="input"
                                    name="ru" 
                                    type="text" 
                                    onChange={(e) => onEditFeature(e, i)} 
                                    value={item.name.ru}/>
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
    


