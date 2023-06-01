import './color-picker.scss'
import { ICartState, IColor, IModal, IModalImg, TLang } from "../../../interfaces";
import { useState, useEffect, useRef } from 'react'
import Modal from '../../../components/Modal/Modal';
import ModalImage from '../../../components/MessageImage/MessageImage';


interface IPropsState {
    colors: IColor[]
    lang: TLang
    onSelect: (id: IColor['id']) => void
}




const ColorPicker: React.FC<IPropsState> = ({lang, colors, onSelect}): JSX.Element => {

    const [currentColor, setCurrentColor] = useState<IColor>()
    const [expanded, setExpanded] = useState<boolean>(false)
	const [modal, setModal] = useState<IModal>({visible: false})
	const [modalImg, setModalImg] = useState<IModalImg>({descr: '', path: ''})

    const onCurrentClick = () => {
        setExpanded(prev => !prev)
    }

    const onOptionClick = (id: IColor['id']) => {
        setCurrentColor(colors.find(color => color.id === id))
        setExpanded(false)
        onSelect(id)
    }


    const onImageClick = (e: React.MouseEvent , color: IColor) => {
        e.stopPropagation()
		setModalImg({descr: color.name[lang], path: color.url})
        setModal({visible: true})
    }

    
    const closeModal = () => {
		setModal({visible: false})
	}

    return (
        <div className={`color-picker ${expanded ? 'expanded' : ''}`}>
            <div className="option current" onClick={onCurrentClick}>
                {currentColor ? 
                    <>
                        <div className="img__container">
                            <img src={currentColor.url} alt={currentColor.name[lang]} />
                        </div>
                        <span>{currentColor.name[lang]}</span>
                    </>
                    :
                    <span>{lang === 'en' ? 'Choose the fiber before' : 'Сначала выберите материал'} </span>
                }
            </div>
            <div className='list'>
                {colors.map(color => {
                    return (
                        <div className="option" key={color.id} onClick={() => onOptionClick(color.id)} >
                            <div className="img__container" >
                                <img src={color.url} alt={color.name[lang]} />
                            </div>
                            <span>{color.name[lang]}</span>
                            <span onClick={(e) => onImageClick(e, color)}>{lang === 'en' ? '(details)' : '(детальнее)'}</span>
                        </div>
                    )
                })}
            </div>
            <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
				<ModalImage props={{path: modalImg.path, descr: modalImg.descr}}/>
			</Modal> 
        </div>
    )


}



  

export default ColorPicker;
