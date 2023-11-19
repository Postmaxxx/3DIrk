import './splider-common.scss'
import Splide from "@splidejs/splide";
import { IImages, ISpliderOptions, TLang } from '../../../interfaces';
import "@splidejs/react-splide/css";
import { useRef, useEffect, MouseEvent, useMemo, useState } from 'react'
import { IModalFunctions } from '../../Modal/Modal';
import ImageModal from '../../ImageModal/ImageModal';
import PicWithPreloader from '../../../../src/assets/js/PicWithPreloader';



interface IProps {
	images: IImages
    imagesPerSlide?: number
    modal: IModalFunctions | null
	lang: TLang
}

interface IContainerSize {
	width: number
	height: number
}



const SpliderCommon: React.FC<IProps> = ({images, imagesPerSlide=1, modal, lang}): JSX.Element => {
	
	const splideCommon = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();
	const [spliderCreated, setSpliderCreated] = useState<boolean>(false);

    const options: Partial<ISpliderOptions> = {
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
		slideFocus: true,
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
 

	const onItemClick = (index: number) => {
		modal?.openModal({
			name: 'spliderCommonModal',
			children: <ImageModal url={`${images.basePath}/${images.sizes[images.sizes.length - 1].subFolder}/${images.files[index]}`}/>
		})
	}



	useEffect(() => {
		containerSize.current = {
			width:  _splideFabric.current.offsetWidth,
			height:  _splideFabric.current.offsetHeight,
		};
		splideCommon.current = new Splide(_splideFabric.current, options);
		splideCommon.current.mount();
		setSpliderCreated(true)
		return () => {
    		splideCommon.current?.destroy();		
		};
	}, []);

	
	const imagesCommon = useMemo(() => {
		return images.files?.map((file, i) => {
			return (
				<li 
					className="splide__slide" 
					key={i} 
					onClick={() => onItemClick(i)} 
					tabIndex={0} 
					onKeyDown={e => {e.code === 'Enter' && onItemClick(i)}} 
					aria-label={lang === 'en' ? `Watch this slide more detailed` : `Посмотреть этот слайд более подробно`}
				>
					<div className="splide__slide-content">
						{spliderCreated && <PicWithPreloader basePath={images.basePath} sizes={images.sizes} image={file} alt={`Image: ${file}`} />}
					</div>
				</li>
			);
		})
	}, [images.files, spliderCreated])


	return (
        <div className='splider_common__wrapper'>
            <div className="splide" ref={_splideFabric} aria-label="The slider of images">
                <div className="splide__track">
                    <ul className="splide__list">
                        {imagesCommon}
                    </ul>
                </div>
            </div>
        </div>
	)
};




export default SpliderCommon;
