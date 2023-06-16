import './splider-common.scss'
import Splide from "@splidejs/splide";
import { findBestSuitedImg } from "../../../assets/js/findBestSuitedImg";
import ImgWithPreloader from '../../../assets/js/ImgWithPreloader';
import { IImg, IImgWithThumb, IModalImg, ISpliderOptions, TLang } from '../../../interfaces';
import "@splidejs/react-splide/css";
import Modal from '../../../components/Modal/Modal';
import ModalImage from '../../../components/MessageImage/MessageImage';
import { useRef, useState, useEffect, MouseEvent } from 'react'



interface IProps {
	lang: TLang
	images: IImgWithThumb[]
    imagesPerSlide: number
}

interface IContainerSize {
	width: number
	height: number
}




const SpliderCommon: React.FC<IProps> = ({lang, images, imagesPerSlide=1}): JSX.Element => {
	
	const splideCommon = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();
	const [modal, setModal] = useState<boolean>(false)
	const [modalImg, setModalImg] = useState<IModalImg>({descr: '', path: ''})

    const options: Partial<ISpliderOptions> = {
        //type   : 'loop',
        perPage: imagesPerSlide,
        gap: '5%',
		rewind: true,
		lazyLoad: true,
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
                pagination: false,
			}, 
			480: {
				perPage: 1,
			}, 
		},
	};
 
	const handleImgClick = (e: MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLImageElement).tagName === 'IMG') {
			const id = Number(((e.target as HTMLImageElement).id));
			setModal(true)
			setModalImg({path: images[id].full, descr: images[id].fileName})
		}
	}

	const closeModal = () => {
		setModal(false)
	}


	useEffect(() => {
		containerSize.current = {
			width:  _splideFabric.current.offsetWidth,
			height:  _splideFabric.current.offsetHeight,
		};
		splideCommon.current = new Splide(_splideFabric.current, options);
		splideCommon.current.mount();		
		return () => {
    		splideCommon.current?.destroy();		
		};
	}, []);

	


	return (
        <div className='splider_common__wrapper' onClick={(e) => handleImgClick(e)}>
            <div className="splide" ref={_splideFabric} aria-label="The carousel">
                <div className="splide__track">
                    <ul className="splide__list">
                        {images.map((img, i) => {
                            return (
                                <li className="splide__slide" key={i} data-path={img.full}>
                                    <div className="splide__slide-container">
										<ImgWithPreloader src={img.medium || img.thumb} alt={img.fileName} id={String(i)}/>
                                    </div>
                                </li>
                            );
                        })
                        }
                    </ul>
                </div>
            </div>
            <Modal {...{visible: modal, close: closeModal, escExit: true}}>
				<ModalImage props={{path: modalImg.path, descr: modalImg.descr}}/>
			</Modal> 
        </div>
	)

};



  

export default SpliderCommon;
