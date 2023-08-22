import './color-selector.scss'
import { IColor, TLang } from "../../interfaces";
import { useState } from 'react'
import { IModalFunctions } from '../Modal/ModalNew';
import ImageModalNew from '../ImageModal/ImageModalNew';
import { useEffect } from 'react'


interface IPropsState {
    colors: IColor[]
    lang: TLang
    onSelect: (id: IColor['_id']) => void
    modal: IModalFunctions | null
}


const ColorSelector: React.FC<IPropsState> = ({lang, modal, colors, onSelect}): JSX.Element => {
    const [currentColor, setCurrentColor] = useState<IColor>()
    const [expanded, setExpanded] = useState<boolean>(false)

    useEffect(() => {
        setCurrentColor(undefined)
    }, [colors])

    
    const onCurrentClick = () => {
        setExpanded(prev => !prev)
    }

    const onOptionClick = (id: IColor['_id']) => {
        setCurrentColor(colors.find(color => color._id === id))
        setExpanded(false)
        onSelect(id)
    }


    const onImageClick = (e: React.MouseEvent , color: IColor) => {
        e.stopPropagation()
        modal?.openModal({
            name: 'colorSelector',
            children: <ImageModalNew url={color.urls.full}/>
        })
    }




    return (
        <div className="selector block_input">
            <label>{lang === 'en' ? 'Color' : 'Цвет'}: </label>
            <div className={`selector_color ${expanded ? 'expanded' : ''}`}>
                <div className="color current" onClick={onCurrentClick}>
                    {currentColor ? 
                        <>
                            <div className="img-cont">
                                <img src={currentColor.urls.thumb} alt={currentColor.name[lang]} />
                            </div>
                            <span>{currentColor.name[lang]}</span>
                        </>
                        :
                        <span>{lang === 'en' ? 'Choose the color' : 'Выберите цвет'} </span>
                    }
                </div>
                <div className='list'>
                    {colors.map(color => {
                        return (
                            <div className="color" key={color._id} onClick={() => onOptionClick(color._id)} >
                                <div className="img-cont" onClick={(e) => onImageClick(e, color)}>
                                    <img src={color.urls.thumb} alt={color.name[lang]} />
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" xmlSpace="preserve">
                                        <path d="M774.8,193.8H622.5c-16.9,0-30.6,13.7-30.6,30.6c0,16.9,13.7,30.6,30.6,30.6H703L556,402l43.3,43.3l146.3-146.3l-0.7,78.6c0,16.9,13.7,30.6,30.6,30.6s30.6-13.7,30.6-30.6V224.4c0-9.1-3.8-16.4-9.7-21.4C791,197.3,783.3,193.8,774.8,193.8L774.8,193.8z M928.8,867.5c0,33.7-27.4,61.3-61.3,61.3h-735c-33.8,0-61.3-27.6-61.3-61.3v-735c0-33.8,27.4-61.3,61.3-61.3h735c33.8,0,61.3,27.4,61.3,61.3V867.5L928.8,867.5z M867.5,10h-735C64.8,10,10,64.8,10,132.5v735C10,935.2,64.8,990,132.5,990h735c67.7,0,122.5-54.8,122.5-122.5v-735C990,64.8,935.2,10,867.5,10L867.5,10z M400.7,554.8L254.3,701.2l0.7-78.7c0-16.8-13.7-30.6-30.6-30.6s-30.6,13.8-30.6,30.6v153.1c0,9.2,3.8,16.5,9.7,21.4c5.5,5.5,13.3,9.2,21.8,9.2h152.3c16.9,0,30.6-13.8,30.6-30.6S394.4,745,377.5,745H297L444,598L400.7,554.8L400.7,554.8z M775.6,591.9c-16.9,0-30.6,13.8-30.6,30.6l0.7,78.7L599.3,554.8L556,598L703,745h-80.5c-16.9,0-30.6,13.8-30.6,30.6s13.7,30.6,30.6,30.6h152.3c8.5,0,16.3-3.7,21.8-9.2c5.9-4.9,9.7-12.3,9.7-21.4V622.5C806.3,605.7,792.5,591.9,775.6,591.9L775.6,591.9z M377.5,255c16.9,0,30.6-13.7,30.6-30.6c0-16.9-13.7-30.6-30.6-30.6H225.2c-8.5,0-16.2,3.5-21.8,9.2c-5.9,5-9.7,12.3-9.7,21.4v153.1c0,16.9,13.7,30.6,30.6,30.6s30.6-13.7,30.6-30.6l-0.7-78.6l146.3,146.3L444,402L297,255H377.5L377.5,255z"/>
                                    </svg>
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
