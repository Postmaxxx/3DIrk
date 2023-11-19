import { TLang, TLangText } from '../../interfaces';
import './featurer.scss'
import { useState, forwardRef, useImperativeHandle, useEffect  } from "react";
import { IInputChecker, prevent } from '../../assets/js/processors';
import { empty } from '../../assets/js/consts';
import BlockInput, { IBlockInputFunctions } from '../BlockInput/BlockInput';


interface IItem {
    _id: string
    name: TLangText
    value?: string
}


interface IProps {
    lang: TLang
    type?: "input" | "textarea"
    amountChanged?: (newAmount: number) => void
    rules?: IInputChecker["rules"]
    rulesValue?: IInputChecker["rules"]
    id?: string
    withValue?: boolean
	inputType?: "text" | "tel" | "email" | "date"
    inputValueType?: "text" | "tel" | "email" | "date"
}


export interface IFeaturerFunctions {
    setFeatures: (newFeatures: IItem[]) => void;
    getFeatures: () => IItem[];
    getErrors: () => TLangText[]
    getLength: () => number
}

interface IFeature {
    item: IItem, 
    ref: {
        en: IBlockInputFunctions | null, ru: IBlockInputFunctions | null, 
        mult: IBlockInputFunctions | null
    }
}


const Featurer = forwardRef<IFeaturerFunctions, IProps>(({lang, type="input", rules, rulesValue, id, withValue, inputType, inputValueType, amountChanged}, ref) => {
    useImperativeHandle(ref, () => ({
        setFeatures(newFeatures) {
            setFeatures(newFeatures.map(newFeature => ({item: newFeature, ref: {en: null, ru: null, mult: null}})) || [])
        },
        getFeatures() {
            return features.map(feature => ({name: feature.item.name, value: feature.item.value, _id: feature.item._id}))
        },
        getErrors() {
            return getErrors()
        },
        getLength() {
            return features.length
        }
    }));


    const [features, setFeatures] = useState<IFeature[]>([])

    const onEditFeature = (value: string, prop: 'en' | 'ru' | 'value', index: number): void => {
        setFeatures(prev => {
            const newFeatures: IFeature[] = [...prev];
            if (prop === 'value') {
                newFeatures[index].item[prop] = value
            } else {
                newFeatures[index].item.name[prop] = value
            }
            return newFeatures
        })
    }

    const onDeleteFeature = (e: React.MouseEvent<HTMLButtonElement>, index: number): void => {
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


    const onAddFeature = (e: React.MouseEvent<HTMLButtonElement>): void => {
        prevent(e)
        setFeatures(prev => [...prev, {item: {_id: '', name: {...empty}}, ref: {en: null, ru: null, mult: null}}])
    }
    
    
    useEffect(() => {
        amountChanged && amountChanged(features.length)
    }, [features.length])


    const getErrors = (): TLangText[] => {
        const errors: TLangText[] = []
        features.forEach(feature => {
            const errEn = feature.ref.en?.getError()
            const errRu = feature.ref.ru?.getError()
            const errMult = feature.ref.mult?.getError()
            if (errEn?.error?.en || errEn?.error?.ru ) {
                errors.push({en: errEn.error.en, ru: errEn.error.ru})
            }
            if (errRu?.error?.en || errRu?.error?.ru ) {
                errors.push({en: errRu.error.en, ru: errRu.error.ru})
            }
            if (errMult?.error?.en || errMult?.error?.ru ) {
                errors.push({en: errMult.error.en, ru: errMult.error.ru})
            }
        })
        return errors
    }


    return (
        <div className={`features ${withValue ? 'features_value' : ''}`}>
            <div className="features__list">
                {features.map((feature, i) => {
                    return (
                        <div className="block_feature full-width" key={i}>
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name en', ru: 'Название en'}}
                                required
                                typeElement={type}
                                id={`feature-${id ? `${id}-` : ''}en-${i}`}
                                rules={rules || {}}
                                initialValue={feature.item.name.en}
                                onChange={(newValue: string) => {onEditFeature(newValue, 'en', i)}}
                                ref={(el) => feature.ref.en = el}
                                inputType={inputType}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name ru', ru: 'Название ru'}}
                                required
                                typeElement={type}
                                id={`feature-${id ? `${id}-` : ''}ru-${i}`}
                                rules={rules || {}}
                                initialValue={feature.item.name.ru}
                                onChange={(newValue: string) => {onEditFeature(newValue, 'ru', i)}}
                                ref={(el) => feature.ref.ru = el}
                                inputType={inputType}
                            />
                            {withValue && <BlockInput
                                lang={lang}
                                labelText={{en: 'Value', ru: 'Значение'}}
                                required
                                typeElement={type}
                                id={`feature-${id ? `${id}-` : ''}mult-${i}`}
                                rules={rulesValue || {}}
                                initialValue={feature.item.value}
                                onChange={(newValue: string) => {onEditFeature(newValue, 'value', i)}}
                                ref={(el) => feature.ref.mult = el}
                                inputType={inputValueType}
                            />}
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
    


