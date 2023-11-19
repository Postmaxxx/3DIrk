import { TLang, TLangText } from "../../interfaces"
import { useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import './block-selector.scss'
import { defaultSelectItem, empty } from "../../assets/js/consts";


export interface IItem {
    value: string
    name: TLangText
}


interface IProps {
    id: string
    lang: TLang
    labelText: TLangText
    defaultData?: IItem
    data?: IItem[]
    required?: boolean
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
    saveValue?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    saveItem?: (itemNew: IItem) => void
    onClick?: (e: React.MouseEvent<HTMLSelectElement>) => void
}


export interface ISelectorFunctions {
    setData: (elements: IItem[]) => void;
    getValue: () => string;
    getItem: () => IItem;
    setItem: (element: IItem) => void;
    setValue: (value: string) => void;
    getError: () => {
		error: TLangText | null,
		name: TLangText 
	}
	getErrorText: (lng: TLang) => string | null
    setChanged: (changed: boolean) => void
}

    interface IStore {
        items: IItem[]
        item: IItem,
        value: string
    }

const BlockSelector = forwardRef<ISelectorFunctions, IProps>(({lang, id, labelText, defaultData={...defaultSelectItem}, data=[], required, onBlur, saveValue, saveItem,  onClick}, ref) => {
    useImperativeHandle(ref, () => ({
        setData(elements) {
            setStore(prev => ({...prev, items: elements}))
        },
        getItem() {
            return store.item
        },
        getValue() {
            return store.value
        },
        setItem(element) { //altough element can be not in items
            setStore(prev => ({...prev, item: element}))
        },
        setValue(value) { //select item if item.value === value
            setStore(prev => ({...prev, value: value}))
            if (!_select.current) return
            if (value) {
                _select.current.selectedIndex = store.items.findIndex(el => el.value === value) + 1  
            } else {
                _select.current.selectedIndex = 0
            }
        },
        getError() {
            let err: TLangText | null = null;
			if (_select.current) {
				err = checkOnErrors()
			} 
			return {error: err, name: labelText}
        },
        getErrorText(lng) {
			if (_select.current) {
				const err = checkOnErrors()
				return err ? `${labelText[lng]}: ${err[lng]}` : null
			} 
			return null
		},
        setChanged(changed) {
            setChanged(changed)
        }
    }));


    const [store, setStore] = useState<IStore>({items: data || [], item: defaultData || {value: '', name: {...empty}}, value: ''})
    const _select = useRef<HTMLSelectElement>(null)
	const [error, setError] = useState<TLangText | null>(null)
	const [changed, setChanged] = useState<boolean>(false)


    const onChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setChanged(true)       
        var itemNew: IItem = {value: e.target.value, name: (store.items.find(el => el.value === e.target.value) as IItem)?.name || {en: '', ru: ''}}
        setStore(prev => {
            return {
                ...prev, 
                item: itemNew,
                value: e.target.value
            }
        })
        saveItem && saveItem(itemNew)
        saveValue && saveValue(e)
        e.target.parentElement?.classList.remove('incorrect-value') 
    }

     
    const options: JSX.Element[] = useMemo(() => {
        return store.items.map((el, i) => <option key={i} value={el.value}>{el.name[lang]}</option>)
    }, [store.items, lang])
    

    const checkOnErrors = (): TLangText | null => {
        let err: TLangText | null = null
        if (!changed) {
            err = {en: "not selected", ru: 'не выбрано'}
        } 
        setError(err)
        return err
    }


    const onBlurSelect: React.FocusEventHandler<HTMLSelectElement> = (e): void => {
		checkOnErrors()
        onBlur && onBlur(e)
    }

    const onClickSelect: React.MouseEventHandler<HTMLSelectElement> = (e): void => {
		setError(null)
        onClick && onClick(e)
    }
  
    return (
        <div className={`block_selector block_input ${error ? "incorrect-value" : ""}`} data-selector="input-block">
            <label htmlFor={id}>{labelText[lang]}{required && '*'}</label>
            <select 
                data-selector="select"
                ref={_select} 
                id={id} 
                defaultValue={store.value} 
                onChange={onChange} 
                onBlur={onBlurSelect}
                onClick={onClickSelect}>
                    <option key={-1} value={store.item.value} disabled hidden>{store.item.name[lang]}</option>
                    {options}
            </select>
			{error && <span id={`${id}_error`} aria-description={lang === 'en' ? 'Error text' : 'Текст ошибки'} data-content="errorText">{lang === 'en' ? 'Error: ' : 'Ошибка: '}{error[lang]}</span>}	
        </div>
    )
})


export default BlockSelector