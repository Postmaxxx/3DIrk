import { TLang, TLangText } from '../../interfaces';
import './featurer.scss'
import { useState, forwardRef, useImperativeHandle, useEffect  } from "react";
import { IInputChecker2, prevent } from '../../assets/js/processors';
import { empty } from '../../assets/js/consts';
import BlockInput, { IBlockInputFunctions } from '../BlockInput/BlockInput';


interface IItem {
    _id: string
    name: TLangText
}


interface IProps {
    lang: TLang
    type?: "input" | "textarea"
    amountChanged?: (newAmount: number) => void
    rules?: IInputChecker2["rules"]
    id?: string
}


export interface IFeaturerFunctions {
    setFeatures: (newFeatures: IItem[]) => void;
    getFeatures: () => IItem[];
    getErrors: () => TLangText[]
}



const Featurer = forwardRef<IFeaturerFunctions, IProps>(({lang, type="input", rules, id, amountChanged}, ref) => {
    useImperativeHandle(ref, () => ({
        setFeatures(newFeatures) {
            setFeatures(newFeatures.map(newFeature => ({item: newFeature, ref: {en: null, ru: null}})) || [])
        },
        getFeatures() {
            return features.map(feature => ({name: feature.item.name, _id: feature.item._id}))
        },
        getErrors() {
            return getErrors()
        }
    }));


    const [features, setFeatures] = useState<{item: IItem, ref: {en: IBlockInputFunctions | null, ru: IBlockInputFunctions | null}}[]>([])

    const onEditFeature = (value: string, lng: string, index: number) => {
        setFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures[index].item.name[lng as TLang] = value
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

    useEffect(() => {
        getErrors() //check for errors
    }, [features.length])


    const onAddFeature = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        setFeatures(prev => [...prev, {item: {_id: '', name: {...empty}}, ref: {en: null, ru: null}}])
    }
    
    
    useEffect(() => {
        amountChanged && amountChanged(features.length)
    }, [features.length])


    const getErrors = (): TLangText[] => {
        const errors: TLangText[] = []
        features.forEach(feature => {
            const errEn = feature.ref.en?.getError()
            const errRu = feature.ref.ru?.getError()
            if (errEn?.error?.en || errEn?.error?.ru ) {
                errors.push({en: errEn.error.en, ru: errEn.error.ru})
            }
            if (errRu?.error?.en || errRu?.error?.ru ) {
                errors.push({en: errRu.error.en, ru: errRu.error.ru})
            }
        })
        return errors
    }


    return (
        <div className="features">
            <div className="features__list">
                {features.map((feature, i) => {
                    return (
                        <div className="block_feature full-width" key={i}>
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Value en', ru: 'Значение en'}}
                                required
                                typeElement={type}
                                id={`feature-${id ? `${id}-` : ''}en-${i}`}
                                rules={rules || {}}
                                initialValue={feature.item.name.en}
                                onChange={(newValue: string) => {onEditFeature(newValue, 'en', i)}}
                                ref={(el) => feature.ref.en = el}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Value ru', ru: 'Значение ru'}}
                                required
                                typeElement={type}
                                id={`feature-${id ? `${id}-` : ''}ru-${i}`}
                                rules={rules || {}}
                                initialValue={feature.item.name.ru}
                                onChange={(newValue: string) => {onEditFeature(newValue, 'ru', i)}}
                                ref={(el) => feature.ref.ru = el}
                            />
                            <button 
                                className="button_blue color_reverse button_feature_delete" 
                                aria-label={lang === 'en' ? 'Delete this item' : 'Удалить этот элемент'} 
                                onClick={(e) => {onDeleteFeature(e, i)}}
                            >
                                X
                            </button>
                        </div>
    
                    )
                })}
            </div>
            <button className='button_blue color_reverse button_feature_add' onClick={onAddFeature}>{lang === 'en' ? '+' : '+'}</button>
        </div>
    )
})


export default Featurer
    


