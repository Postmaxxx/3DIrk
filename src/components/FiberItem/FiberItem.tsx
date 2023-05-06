import { IFiber, IModal, ISpliderOptions, TLang } from 'src/interfaces'
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
	fiber: IFiber,
	lang: TLang
}

interface modalImg {
	descr: string 
	path: string
}



const FiberItem = ({fiber, lang}: IProps) => {

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
			//console.log(fiber.imgs[id].url);
			setModal({visible: true})
			setModalImg({path: fiber.imgs[id].url, descr: fiber.imgs[id].alt[lang]})
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
            <div className='fiber__splide__container' onClick={(e) => handleImgClick(e)}>
                <div className="splide" ref={_splideFabric} aria-label="The carousel">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {fiber.imgs.map((img, i) => {
                                return (
                                    <li className="splide__slide" key={img.path} data-path={img.path}>
                                        <div className="splide__slide-container">
                                            <img src={img.url} alt={img.alt[lang]} id={String(i)} />
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
					<h3>{fiber.header[lang]}</h3>
					{fiber.text[lang].map((textItem, i) => <p key={i}>{textItem.part}</p>)}
						<Proscons {...fiber.proscons} lang={lang}/>

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