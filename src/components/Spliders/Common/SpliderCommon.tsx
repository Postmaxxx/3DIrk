import './splider-common.scss'
import Splide from "@splidejs/splide";
import ImgWithPreloader from '../../../assets/js/ImgWithPreloader';
import { IImgWithThumb, ISpliderOptions, TImageSizes } from '../../../interfaces';
import "@splidejs/react-splide/css";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import { IImageModalFunctions } from '../../ImageModal/ImageModal';
import { useRef, useEffect, MouseEvent } from 'react'
import ImageModal from '../../ImageModal/ImageModal';
import { timeModalClosing } from '../../../assets/js/consts';



interface IProps {
	images: {
		paths: Partial<Record<TImageSizes, string>>
        files: string[]
	}
    imagesPerSlide: number
	defaultSize?: TImageSizes
}

interface IContainerSize {
	width: number
	height: number
}



const SpliderCommon: React.FC<IProps> = ({images, defaultSize='full', imagesPerSlide=1}): JSX.Element => {
	
	const splideCommon = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();
    const modal_image = useRef<IModalFunctions>(null)
    const image = useRef<IImageModalFunctions>(null)

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
			image.current?.update({url: `${images.paths.full}/${images.files[id]}`, text: images.files[id]})
			modal_image.current?.openModal()
		}
	}


    const closeModalImage = () => {
        modal_image.current?.closeModal()
        setTimeout(() => image.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
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
                        {images.files?.map((file, i) => {
                            return (
                                <li className="splide__slide" key={i} data-path={images.paths.full}>
                                    <div className="splide__slide-container">
										<ImgWithPreloader src={images.paths[defaultSize] ? `${images.paths[defaultSize]}/${file}` : `${images.paths.full}/${file}`} alt={file} id={String(i)}/>
                                    </div>
                                </li>
                            );
                        })
                        }
                    </ul>
                </div>
            </div>
			<Modal escExit={true} ref={modal_image} onClose={closeModalImage}>
				<ImageModal ref={image} />
            </Modal>
        </div>
	)
};




export default SpliderCommon;
