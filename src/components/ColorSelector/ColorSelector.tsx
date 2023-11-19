import './color-selector.scss'
import { IColor, TLang } from "../../interfaces";
import { useState } from 'react'
import { IModalFunctions } from '../Modal/Modal';
import ImageModal from '../ImageModal/ImageModal';
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

    
    const onCurrentClick = (): void => {
        setExpanded(prev => !prev)
    }

    const onOptionClick = (id: IColor['_id']): void => {
        setSelectedColor(colors.find(color => color._id === id))
        setExpanded(false)
        onSelect(id)
    }


    const onImageClick = (e: React.MouseEvent | React.KeyboardEvent , color: IColor): void => {
        e.stopPropagation()
        modal?.openModal({
            name: 'colorSelector',
            children: <ImageModal url={color.urls.full}/>
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
                    role='button'
                    onKeyDown={e => {e.code === 'Enter' && onCurrentClick()}} 
                    aria-label={lang === 'en' ? 'Select the color' : 'Выберите цвет'}>
                    {selectedColor ? 
                        <>
                            <div className="img-wrapper">
                                <img src={selectedColor.urls.thumb} alt={selectedColor.name[lang]} />
                            </div>
                            <span aria-label={lang === 'en' ? 'Selected color' : 'Выбранный цвет'}>{selectedColor.name[lang]}</span>
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
                                role='button'
                                onKeyDown={e => {e.code === 'Enter' && onOptionClick(color._id)}}
                                aria-label={lang === 'en' ? `Select color: ${color.name.en}` : `Выбрать цвет: ${color.name.en}`}
                            >
                                <div 
                                    className="img-wrapper" 
                                    onClick={(e) => onImageClick(e, color)} 
                                    tabIndex={expanded ? 0 : -1} 
                                    role='button'
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
