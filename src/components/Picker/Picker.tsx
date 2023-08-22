import { IImages, TLang, TLangText } from '../../interfaces';
import './picker.scss'
import { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { prevent } from '../../assets/js/processors';
import { createNewItemId } from '../../../src/assets/js/consts';
import iconPlus from '../../assets/img/icon_plus.svg'
import PicWithPreloader from '../../../src/assets/js/PicWithPreloader';


interface IProps {
    items: {
        _id: string
        images?: IImages
        urls?: {
            full: string
            thumb: string 
        }
        name: TLangText
        active?: boolean
    }[]
    lang: TLang
    markInactive?: boolean //mark inavtive
    multiple?: boolean //is it possible to choose more than 1 tiem
    withNew?: boolean //show img for new item
    minSelected?: number //min amount of items can't be unselected
    simulateClickOnSelect?: boolean //simulate manula select behavior when use setSelected
    onEditClick?: (_id: string) => void
    onDeleteClick?: (_id: string) => void
    onItemClick?: (_id: string) => void
}


export interface IPickerFunctions {
    setSelected: (_ids?: string[]) => void; //[ids to select], if blank - select new
    getSelected: () => string[];
}


const Picker = forwardRef<IPickerFunctions, IProps>(({items, lang, onEditClick, onDeleteClick, onItemClick, multiple=true, withNew=false, minSelected=0, markInactive=false, simulateClickOnSelect=false}, ref) => {
    useImperativeHandle(ref, () => ({
        setSelected(_ids) {
            if (!_ids) {
                setSelectedItems({[createNewItemId]: true}) 
                simulateClickOnSelect && onItemClick && onItemClick('')
                return
            }
            const initialSelected = _ids.reduce((acc, item) => {
                return {...acc, [item]: true}
            }, {} as {[key: string]: boolean})
            setSelectedItems(initialSelected)
            simulateClickOnSelect && _ids.forEach(_id => {onItemClick && onItemClick(_id) })
        },
        getSelected() {
            return Object.entries(selectedItems)?.filter(item => item[1])?.map(item => item[0]).map(el => (el === createNewItemId ? '' : el)) //return '' instead of createNewItemId 
        },
    }));



    const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({}) //obj is faster than [].find...

    

    const itemClicked = (_id: string) => {
        if (multiple) {
            setSelectedItems(prev => {
                return (prev[_id] && Object.values(prev)?.filter(value => value)?.length > minSelected) ? {...prev, [_id]: !prev[_id]} : {...prev, [_id]: true}
            })
        } else {
            minSelected ? setSelectedItems({[_id]: true}) : setSelectedItems(prev => ({[_id]: !prev[_id]}))
        }
        if (onItemClick) {
            _id === createNewItemId ? onItemClick('') : onItemClick(_id)
        }
    }


    const onDeleteItem = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        onDeleteClick && onDeleteClick(_id)
    }

   const onEditItem = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        onEditClick && onEditClick(_id)
    }


    const contentMemo = useMemo(() => {
        return (
            <>
                {items.map((item) => {
                    return (
                        <div className={`picker__item ${selectedItems[item._id] ? 'selected' : ''} ${markInactive && !item.active ? 'inactive' : ''}`} key={item._id}>
                            <div 
                                className="image" 
                                onClick={() => itemClicked(item._id)}>
                                    {item.images && <PicWithPreloader basePath={item.images.basePath} sizes={item.images.sizes} image={item.images.files[0]} alt={item.name[lang]}/>} {/*for fibers*/}

                                    {/*item.images && <img src={`${item.images.basePath}/${item.images.sizes}`} alt={item.name[lang]} />} {/*for fibers*/}
                                    {item.urls && <img src={item.urls?.thumb} alt={item.name[lang]} />} {/*for colors*/}
                            </div>
                            <span>{item.name[lang]}</span>
                            <div className="buttons_control">
                                {onEditClick && <button className="button_blue edit" onClick={(e) => onEditItem(e, item._id)}>E</button>}
                                {onDeleteClick && <button className="button_blue delete" onClick={(e) => onDeleteItem(e, item._id)}>X</button>}
                            </div>
                        </div>
                    )
                })}
                {withNew && 
                    <div className={`picker__item ${selectedItems.createNew ? 'selected' : ''}`}>
                        <div className="image" onClick={() => itemClicked(createNewItemId)}>
                            <img src={iconPlus} alt={lang === 'en' ? "Create new" : 'Создать новый'} />
                        </div>
                        <span>{lang === 'en' ? 'Add new' : 'Создать'}</span>
                    </div>
                }
            </>
        )
    }, [items, lang, selectedItems])

    return (
        <div className="picker">
            {contentMemo}
        </div>
    )
})


export default Picker