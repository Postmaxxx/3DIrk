import './color-selector.scss'
import { IColor, TLang } from "../../interfaces";
import { useState } from 'react'
import { IModalFunctions } from '../Modal/ModalNew';
import ImageModalNew from '../ImageModal/ImageModalNew';
import { useEffect } from 'react'
import svgs from '../additional/svgs';


interface IPropsState {
    selectorId?: string
    colors: IColor[]
    lang: TLang
    onSelect: (id: IColor['_id']) => void
    modal: IModalFunctions | null
}


const ColorSelector: React.FC<IPropsState> = ({selectorId, lang, modal, colors, onSelect}): JSX.Element => {
    const [selectedColor, setSelectedColor] = useState<IColor>()
    const [expanded, setExpanded] = useState<boolean>(false)

    useEffect(() => {
        setSelectedColor(undefined)
    }, [colors])

    
    const onCurrentClick = () => {
        setExpanded(prev => !prev)
    }

    const onOptionClick = (id: IColor['_id']) => {
        setSelectedColor(colors.find(color => color._id === id))
        setExpanded(false)
        onSelect(id)
    }


    const onImageClick = (e: React.MouseEvent | React.KeyboardEvent , color: IColor) => {
        e.stopPropagation()
        modal?.openModal({
            name: 'colorSelector',
            children: <ImageModalNew url={color.urls.full}/>
        })
    }




    return (
        <div className="selector selector_color block_input"> 
            <span className='selector_color__label'>{lang === 'en' ? 'Color' : 'Цвет'}: </span> 
            <div className={`selector_color__selector ${expanded ? 'expanded' : ''}`} id={selectorId ?? 'selector_color'}>
                <div 
                    className="selector_color__color color_selected" 
                    onClick={onCurrentClick} 
                    tabIndex={0} 
                    onKeyDown={e => {e.code === 'Enter' && onCurrentClick()}} 
                    aria-label={lang === 'en' ? 'Select color' : 'Выберите цвет'}>
                    {selectedColor ? 
                        <>
                            <div className="img-cont">
                                <img src={selectedColor.urls.thumb} alt={selectedColor.name[lang]} />
                            </div>
                            <span>{selectedColor.name[lang]}</span>
                        </>
                        :
                        <span className='color__placeholder'>{lang === 'en' ? 'Choose the color' : 'Выберите цвет'} </span>
                    }
                </div>
                <div className='selector_color__list'>
                    {colors.map(color => {
                        return (
                            <div 
                                className="selector_color__color" 
                                key={color._id} 
                                onClick={() => onOptionClick(color._id)} 
                                tabIndex={expanded ? 0 : -1} 
                                onKeyDown={e => {e.code === 'Enter' && onOptionClick(color._id)}}
                                aria-label={lang === 'en' ? `Select color: ${color.name.en}` : `Выбрать цвет: ${color.name.en}`}
                            >
                                <div 
                                    className="img-cont" 
                                    onClick={(e) => onImageClick(e, color)} 
                                    tabIndex={expanded ? 0 : -1} 
                                    onKeyDown={e => {e.code === 'Enter' && onImageClick(e, color)}}
                                    aria-label={lang === 'en' ? `Watch this color ${color.name.en} more detailed` : `Посмотреть этот цвет ${color.name.en} подробнее`}
                                >
                                    <img src={color.urls.thumb} alt={color.name[lang]} />
                                    {svgs().iconExpand}
                                </div>
                                <span className='color__name'>{color.name[lang]}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )


}


export default ColorSelector;
