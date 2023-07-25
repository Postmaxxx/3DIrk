import { TImageSizes, TLang, TLangText } from '../../interfaces';
import './picker.scss'
import { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { prevent } from '../../assets/js/processors';
import { createNewItemId } from '../../../src/assets/js/consts';



interface IProps {
    items: {
        _id: string
        images?: {
            paths: Partial<Record<TImageSizes, string>>
            files: string[]
        }
        url?: {
            full: string
            thumb: string
        }
        name: TLangText
    }[]
    lang: TLang
    multiple?: boolean
    withNew?: boolean
    minSelected?: number //min amount of items can't be unselected
    onEditClick?: (_id: string) => void
    onDeleteClick?: (_id: string) => void
    onItemClick?: (_id: string) => void
}


export interface IPickerFunctions {
    setSelected: (_ids: string[]) => void;
    getSelected: () => string[];
}


const Picker = forwardRef<IPickerFunctions, IProps>(({items, lang, onEditClick, onDeleteClick, onItemClick, multiple=true, withNew=false, minSelected=0}, ref) => {
    useImperativeHandle(ref, () => ({
        setSelected(_ids) {
            const initialSelected = _ids.reduce((acc, item) => {
                return {...acc, [item]: true}
            }, {} as {[key: string]: boolean})
            setSelectedItems(initialSelected)
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
        onItemClick && onItemClick(_id)
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
                        <div className="item__container" key={item._id}>
                            <div className={`image__container ${selectedItems[item._id] ? 'selected' : ''}`} onClick={() => itemClicked(item._id)}>
                                {item.images && <img src={`${item.images.paths.small}/${item.images.files[0]}`} alt={item.name[lang]} />} {/*for fibers*/}
                                {item.url && <img src={item.url.thumb} alt={item.name[lang]} />} {/*for colors*/}
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
                    <div className="item__container">
                        <div className={`image__container ${selectedItems.createNew ? 'selected' : ''}`} onClick={() => itemClicked(createNewItemId)}>
                            +
                        </div>
                    </div>
                }
            </>
        )
    }, [items, lang, selectedItems])

    return (
        <div className="items__container">
            {contentMemo}
        </div>
    )
})


export default Picker