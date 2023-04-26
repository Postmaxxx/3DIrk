import { IFiber } from 'src/interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'
import Splide from "@splidejs/splide";
import { useRef, useState, useEffect, MouseEventHandler, MouseEvent } from 'react'
import Modal from '../Modal/Modal';
import ModalImage from '../ModalImage/ModalImage';

interface IContainerSize {
	width: number
	height: number
}

interface IOptions {
	type   : string
	perPage: number
	gap: string
	lazyLoad: boolean
	updateOnMove: boolean
	perMove: number
	pagination: boolean
	arrows: boolean
	drag: boolean
	speed: number
	autoplay: boolean
	interval: number
	pauseOnHover: boolean
	breakpoints: {
		[key: number]: {
			wheel: boolean
		}
	}
}

interface IModal {
	visible: boolean
	descr: string
	path: string;
}

const FiberItem = ({fiber}: {fiber: IFiber}) => {

    const fabricSplide = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();
	const [modal, setModal] = useState<IModal>({visible: false, descr: '', path: ''})


    const options: IOptions = {
        type   : 'loop',
        perPage: 3,
        gap: '5%',
		lazyLoad: false,
		updateOnMove: true,
		//perPage: 2,
		//fixedWidth: "100%",
		perMove: 1,
		pagination: true,
		arrows: true,
		drag: true,
		speed: 500,
		autoplay: true,
		interval: 5000,
		pauseOnHover: true,
		//rewind: true,
		breakpoints: {
			768: {
				wheel: false,
			}, 
		},
	};
 
	const handleImgClick = (e: MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLImageElement).tagName === 'IMG') {
			const id = Number(((e.target as HTMLImageElement).id));
			//console.log(fiber.imgs[id].url);
			setModal(prev => ({...prev, visible: true, path: fiber.imgs[id].url, descr: fiber.imgs[id].alt}))
		}
		
	}

	const closeModal = () => {
		setModal(prev => ({...prev, visible: false}))
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
                                            <img src={img.url} alt={img.alt} id={String(i)} />
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
                <h3>{fiber.header}</h3>
                {fiber.text.map((textItem, i) => <p key={i}>{textItem}</p>)}
                <Proscons proscons={fiber.proscons}/>
            </div>
				<Modal {...{visible: modal.visible, close: closeModal}}>
					<ModalImage props={{path: modal.path, descr: modal.descr}}/>
				</Modal> 
        </div>
    )
}

export default FiberItem
//{fiber.img.map(image => <img src={image.url} alt={image.alt} key={image.path} />)}
/*
					<ModalImage props={{path: modal.path, descr: modal.descr}}/>
*/