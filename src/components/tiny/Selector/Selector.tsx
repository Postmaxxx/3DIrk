import { TLang, TLangText } from "src/interfaces"
import { useRef, useEffect, useState, useMemo } from "react";
import './selector.scss'


interface IProps {
    id: string
    lang: TLang
    label: TLangText
    defaultData: {
        value: string
        name: TLangText
    }
    dataset: TLangText
    data: {
        value: string
        name: TLangText
    }[]
    saveValue: ({id, e}: {id: string, e: React.ChangeEvent<HTMLSelectElement>}) => void
}


const Selector: React.FC<IProps> = ({lang, id, label, defaultData, data, dataset, saveValue}): JSX.Element => {
    const _select = useRef<HTMLSelectElement>(null)


    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        saveValue({id, e})
    }

    return (
        <div className="selector">
            <label htmlFor={id}>{label[lang]}: </label>
            <select id={id} ref={_select} defaultValue={defaultData.value} onChange={(e) => onChange(e)} data-en={dataset.en} data-ru={dataset.ru}>
                <option key={-1} value={defaultData.value} disabled hidden>{defaultData.name[lang]}</option>
                {data.map((item, i) => <option key={i} value={item.value}>{item.name[lang]}</option>)}
            </select>
        </div>
    )
}


export default Selector