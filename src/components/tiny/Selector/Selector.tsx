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
    setItem: (value: string) => void;
}



const Selector = forwardRef<ISelectorFunctions, IProps>(({lang, id, label, defaultData, dataset, data, saveValue}, ref) => {
    useImperativeHandle(ref, () => ({
        setData(elements) {
            setStore(prev => ({...prev, items: elements, item: {name: {...empty}, value: ''}}))
        },
        getValue() {
            return store.item
        },
        setValue(element) { //altough element can be absent in items
            setStore(prev => ({...prev, item: element}))
        },
        setItem(value) { //select item if item.value === value
            setStore(prev => ({...prev, value: value}))
        },
    }));


    interface IStore {
        items: IItem[]
        item: IItem,
        value: string
    }

    const [store, setStore] = useState<IStore>({items: data || [], item: defaultData || {value: '', name: {...empty}}, value: ''})
    const select = useRef<HTMLSelectElement>(null)

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {        
        setStore(prev => ({...prev, item: {value: e.target.value, name: (prev.items.find(el => el.value === e.target.value) as IItem).name}}))
        saveValue && saveValue({id, e})
    }

    useEffect(() => {
        if (!select.current) return
        select.current.selectedIndex = store.items.findIndex(el => el.value === store.value) + 1
    }, [store.value])
    




    return (
        <div className="selector">
            {label && <label htmlFor={id}>{label[lang]}: </label>}
            <select ref={select} id={id} defaultValue={store.item.value} onChange={(e) => onChange(e)} data-en={dataset.en} data-ru={dataset.ru}>
                <option key={-1} value={store.item.value} disabled hidden>{store.item.name[lang]}</option>
                {store.items.map((el, i) => <option key={i} value={el.value}>{el.name[lang]}</option>)}
            </select>
        </div>
    )
})


export default Selector