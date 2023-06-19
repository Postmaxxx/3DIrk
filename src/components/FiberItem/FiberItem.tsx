import { IColor, IFiber, IModalImg, TLang } from '../../interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'
import SpliderCommon from '../Spliders/Common/SpliderCommon';
import Features from '../Features/Params';
import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal';
import ModalImage from '../MessageImage/MessageImage';
import Delete from '../Delete/Delete';


interface IProps {
	fiber: IFiber
	lang: TLang
	colors: IColor[]
	isAdmin: boolean
	onDelete: (item: IFiber) => void
}

const FiberItem = ({fiber, lang, colors, isAdmin, onDelete}: IProps) => {
	const [modal, setModal] = useState<boolean>(false)
	const [modalImg, setModalImg] = useState<IModalImg>({descr: '', path: ''})


	
    const onImageClick = (e: React.MouseEvent , color: IColor) => {
		console.log(color);
		
        e.stopPropagation()
		setModalImg({descr: color.name[lang], path: color.url.full})
        setModal(true)
    }

    
    const closeModal = () => {
		setModal(false)
	}



    return (
        <div className="fiber__item">
			<h2>{fiber.name[lang]}</h2>
            <div className='fiber__splider__container'>
				<SpliderCommon images={fiber.images} imagesPerSlide={fiber.images.length > 3 ? 3 : 1}/>
            </div>
            <div className="fiber__descr__container">
				<div className="block_text">
					{fiber.text[lang].split('\n').map((textItem, i) => <p key={i}>{textItem}</p>)}
					<div className="features__container">
						<h3>{lang === 'en' ? 'Features' : 'Характеристики'}</h3>
						<Features params={fiber.params} fiber={fiber} lang={lang}/>
					</div>
					<div className="colors">
						<h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
						<div className="colors__container">
							{fiber.colors.map((color, i) => {
								const colorData: IColor | undefined = colors.find(colorItem => colorItem._id === color)
								if (colorData) {
									return (
										<div key={i} className='color__container' onClick={(e) => onImageClick(e, colorData)}>
											<img src={colorData.url.small} alt={colorData.name[lang]} />
										</div>
									)
								}
							})}
						</div>
					</div>
					<div className="proscons">
						<h3>{lang === 'en' ? 'Pros and сons' : 'Плюсы и минусы'}</h3>
						<Proscons {...fiber.proscons} lang={lang}/>
					</div>
					
					<div className="buttons">
						<NavLink
							className="button_blue link_compareList"
							to="/fibers/compare">
								{lang === 'en' ? 'Watch in comparasing' : 'Посмотреть в сравнении'}
						</NavLink>
						{isAdmin ? 
							<Delete<IFiber> remove={onDelete} idInstance={fiber} lang={lang} disabled={false}/>
						:
							null    
						}
					</div>
				</div>
            </div>
			<Modal {...{visible: modal, close: closeModal, escExit: true}}>
				<ModalImage props={{path: modalImg.path, descr: modalImg.descr}}/>
			</Modal> 
        </div>
    )
}

export default FiberItem
