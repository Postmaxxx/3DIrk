import { TLang, TLangText } from "src/interfaces"
import { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import './selector.scss'
import { empty } from "src/assets/js/consts";


interface IItem {
    value: string
    name: TLangText
}


interface IProps {
    id: string
    lang: TLang
    label?: TLangText
    defaultData: IItem
    dataset: TLangText
    data?: IItem[]
    saveValue?: ({id, e}: {id: string, e: React.ChangeEvent<HTMLSelectElement>}) => void
}


export interface ISelectorFunctions {
    setData: (elements: IItem[]) => void;
    getValue: () => IItem;
    setValue: (element: IItem) => void;
}

const Selector = forwardRef<ISelectorFunctions, IProps>(({lang, id, label, defaultData, dataset, data, saveValue}, ref) => {
    useImperativeHandle(ref, () => ({
        setData(elements) {
            setItems(elements)     
            reset()
        },
        getValue() {
            return item
        },
        setValue(element) {
            setItem(element)
        },
    }));

    const [items, setItems] = useState<IItem[]>(data || [])
    const [item, setItem] = useState<IItem>({...defaultData})
    const select = useRef<HTMLSelectElement>(null)

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {        
        setItem({value: e.target.value, name: (items.find(el => el.value === e.target.value) as IItem).name})
        saveValue && saveValue({id, e})
    }
    
    const reset = () => {
        if (select.current) {
            select.current.selectedIndex = -1
            setItem({value: '', name: {...empty}})
        }
    }


    return (
        <div className="selector">
            {label && <label htmlFor={id}>{label[lang]}: </label>}
            <select ref={select} id={id} defaultValue={item.value} onChange={(e) => onChange(e)} data-en={dataset.en} data-ru={dataset.ru}>
                <option key={-1} value={item.value} disabled hidden>{item.name[lang]}</option>
                {items.map((el, i) => <option key={i} value={el.value}>{el.name[lang]}</option>)}
            </select>
        </div>
    )
})


export default Selector