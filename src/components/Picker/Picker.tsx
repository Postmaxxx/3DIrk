import { IImgWithThumb, TImageSizes, TLang, TLangText } from 'src/interfaces';
import './picker.scss'
import { useEffect, useState, forwardRef, useImperativeHandle  } from "react";
import { prevent } from 'src/assets/js/processors';



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
    onEditClick?: (_id: string) => void
    onDeleteClick?: (_id: string) => void
}


export interface IPickerFunctions {
    setSelected: (_ids: string[]) => void;
    getSelected: () => string[];
}


const Picker = forwardRef<IPickerFunctions, IProps>(({items, lang, onEditClick, onDeleteClick}, ref) => {
    useImperativeHandle(ref, () => ({
        setSelected(_ids) {
            const initialSelected = _ids.reduce((acc, item) => {
                return {...acc, [item]: true}
            }, {} as {[key: string]: boolean})
            setSelectedItems(initialSelected)
        },
        getSelected() {
            return Object.entries(selectedItems).filter(item => item[1]).map(item => item[0])
        },
    }));

    const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({}) //obj is faster than [].find...


    const onItemClick = (id: string) => {
        setSelectedItems(prev => ({...prev, [id]: !prev[id]}))
    }

    const onDeleteItem = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        onDeleteClick && onDeleteClick(_id)
    }

    const onEditItem = (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        prevent(e)
        onEditClick && onEditClick(_id)
    }

    return (
        <div className="items__container">
            {items.map((item) => {
                return (
                    <div className="item__container" key={item._id}>
                        <div className={`image__container ${selectedItems[item._id] ? 'selected' : ''}`} onClick={() => onItemClick(item._id)}>
                            {item.images && <img src={`${item.images.paths.small}/${item.images.files[0]}`} alt={item.name[lang]} />} {/*for fibers*/}
                            {item.url && <img src={item.url.thumb} alt={item.name[lang]} />} {/*for colors*/}
                        </div>
                        <span>{item.name[lang]}</span>
                        <div className="buttons_control">
                            <button className="button_blue edit" onClick={(e) => onEditItem(e, item._id)}>E</button>
                            <button className="button_blue delete" onClick={(e) => onDeleteItem(e, item._id)}>X</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
})


export default Picker