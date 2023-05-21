import { IColor, IFiber, IModal, ISpliderOptions, TLang } from 'src/interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'
import Splide from "@splidejs/splide";
import { useRef, useState, useEffect, MouseEventHandler, MouseEvent } from 'react'
import Modal from '../Modal/Modal';
import ModalImage from '../MessageImage/MessageImage';

interface IContainerSize {
	width: number
	height: number
}

interface IProps {
	fiber: IFiber
	lang: TLang
	colors: IColor[]
}

interface modalImg {
	descr: string 
	path: string
}



const FiberItem = ({fiber, lang, colors}: IProps) => {
	

    const fabricSplide = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();
	const [modal, setModal] = useState<IModal>({visible: false})
	const [modalImg, setModalImg] = useState<modalImg>({descr: '', path: ''})

    const options: Partial<ISpliderOptions> = {
        type   : 'loop',
        perPage: 3,
        gap: '5%',
		lazyLoad: false,
		updateOnMove: true,
		perMove: 1,
		pagination: true,
		arrows: true,
		drag: true,
		speed: 500,
		autoplay: true,
		interval: 5000,
		pauseOnHover: true,
		breakpoints: {
			768: {
				wheel: false,
				perPage: 2,
			}, 
			480: {
				perPage: 1,
			}, 
		},
	};
 
	const handleImgClick = (e: MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLImageElement).tagName === 'IMG') {
			const id = Number(((e.target as HTMLImageElement).id));
			setModal({visible: true})
			setModalImg({path: fiber.imgs[id].url, descr: fiber.imgs[id].name[lang]})
		}
	}

	const closeModal = () => {
		setModal({visible: false})
	}


	useEffect(() => {
		containerSize.current = {
			width:  _splideFabric.current.offsetWidth,
			height:  _splideFabric.current.offsetHeight,
		};
		fabricSplide.current = new Splide(_splideFabric.current, options);
		fabricSplide.current.mount();		
		return () => {
    		fabricSplide.current?.destroy();		
		};
	}, []);

	


    return (
        <div className="fiber__item">
			<h2>{fiber.name[lang]}</h2>
            <div className='fiber__splide__container' onClick={(e) => handleImgClick(e)}>
                <div className="splide" ref={_splideFabric} aria-label="The carousel">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {fiber.imgs.map((img, i) => {
                                return (
                                    <li className="splide__slide" key={i} data-path={img.url}>
                                        <div className="splide__slide-container">
                                            <img src={img.url} alt={img.name[lang]} id={String(i)} />
                                        </div>
                                    </li>
                                );
                            })
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="fiber__descr__container">
				<div className="block_text">
					{fiber.text[lang].map((textItem, i) => <p key={i}>{textItem.part}</p>)}
					<div className="features__container">
						<h3>{lang === 'en' ? 'Features' : 'Характеристики'}</h3>
						<div className="features">
							{fiber.features.map((feature, i) => (
								<div className="feature" key={i}>
									<span>{feature.name[lang]}: </span>
									<span className='feature__value'>{feature.value[lang]}</span>
								</div>
							))}
						</div>
					</div>
					<div className="colors">
						<h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
						<div className="colors__container">
							{fiber.colors.map((color, i) => {
								const colorData: IColor | undefined = colors.find(colorItem => colorItem.id === color)
								if (colorData) {
									return <div key={i} className={`color ${colorData.value === 'mixed' ? "color_mixed" : ""}`} style={{backgroundColor: `#${colorData.value}`}} title={colorData.name[lang]}></div>
								}
							})}
						</div>
					</div>
					<div className="proscons">
						<h3>{lang === 'en' ? 'Best for' : 'Применение'}</h3>
						<Proscons {...fiber.proscons} lang={lang}/>
					</div>
				</div>
            </div>
			<Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
				<ModalImage props={{path: modalImg.path, descr: modalImg.descr}}/>
			</Modal> 
        </div>
    )
}

export default FiberItem
//{fiber.img.map(image => <img src={image.url} alt={image.alt} key={image.path} />)}
/*
					<ModalImage props={{path: modal.path, descr: modal.descr}}/>
*/