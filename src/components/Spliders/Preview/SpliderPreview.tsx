import { AnyAction, Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useEffect, useMemo, useRef, useState, } from "react";
import "@splidejs/react-splide/css";
import "./splider-preview.scss";
import { IFullState, IImg, IImgWithThumb, IProduct, ISpliderOptions, TLang } from "../../../interfaces";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "../../../assets/js/ImgWithPreloader";

import Modal, { IModalFunctions } from "../../../components/Modal/Modal";
import { allActions } from "../../../redux/actions/all";
import ImageModal, { IImageModalFunctions } from "../../ImageModal/ImageModal";




interface IPropsState {
	lang: TLang,
	product: IProduct
}


interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}


interface IProps extends IPropsState, IPropsActions {}

interface IContainerSize {
	width: number
	height: number
}


const SpliderPreview: React.FC<IProps> = ({ lang, product, setState}): JSX.Element => {
	const _splideMain = useRef<HTMLDivElement>(null);
	const _splideThumbs = useRef<HTMLDivElement>(null);
	const splideMain = useRef<Splide>();
	const splideThumb = useRef<Splide>();
	//const [modal, setModal] = useState<boolean>(false)
	const modal_image = useRef<IModalFunctions>(null)
    const imageModal = useRef<IImageModalFunctions>(null)
		
	const optionsThumbs: Partial<ISpliderOptions> = {
		lazyLoad	: false,
		perPage		: 5,
		gap        	: '5%',
		rewind     	: false,
		pagination 	: false,
		isNavigation: true,
		focus		: "center",
		//trimSpace: true,
		direction   : 'ltr',
		wheel       : true,
		releaseWheel: true,
		height: '100%',
		breakpoints	: {
			1600: {
				perPage: 5
			}, 
			1241: {
				perPage: 5
			}, 
			992: {
				perPage: 4
			}, 
			768: {
				perPage: 3	,
				direction   : 'ltr',
				height: 'auto',
				gap: '5%'
			}, 
			480: {
				perPage: 3
			}, 
		},
	};


	const optionsMain: Partial<ISpliderOptions> = {
		lazyLoad: true,
		type      : "fade",
		rewind    : false,
		pagination: false,
		speed: 500,
		wheel: false,
		wheelSleep: 300,
		breakpoints	: {
			768: {
				wheel: false
			}, 
		}
	};


    /*const showSlide = (slideToGo: number | string) => {
		splideThumb.current?.go(slideToGo);
	};*/


	/*function modalKeyListener (e: KeyboardEvent) {
		e.keyCode === 37 && showSlide("<");
		e.keyCode === 39 && showSlide(">");
	}*/


	const onImageClick = (e: React.MouseEvent , slide: IImgWithThumb) => {
        if (!slide) return
        e.stopPropagation()
		/*<Modal {...{visible: modal, close: closeModal, escExit: true}}>
		<ModalImage props={{path: product.imgs[splideMain.current?.index || 0].url, descr: product.imgs[splideMain.current?.index || 0].name[lang]}}/>
	</Modal> */
        imageModal.current?.update({url: slide.full, text: slide.fileName})
        modal_image.current?.openModal()
    }


	useEffect(() => {
        if (!_splideThumbs.current || !_splideMain.current) return
		splideThumb.current = new Splide(_splideThumbs.current, optionsThumbs);
		splideMain.current = new Splide(_splideMain.current, optionsMain);
		splideMain.current.sync(splideThumb.current);
		splideMain.current.mount();
		splideThumb.current.mount();
        
		return () => {
			splideThumb.current?.destroy();
			splideMain.current?.destroy();
            //setState.product.setSelectedImage(splideMain.current?.index || 0)
		};
		
	}, []);


	

    const closeModalImage = () => {
        modal_image.current?.closeModal()
	}



	return (
        <div className="splider_preview">
			<div id="spliderMain" className="splide" ref={_splideMain}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide,i) => {
							return (
								<li className="splide__slide" key={i} onClick={(e) => onImageClick(e, slide)}>
									<ImgWithPreloader src={slide.medium || slide.full} alt={slide.fileName} />
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div id="spliderThumbs" className="splide" ref={_splideThumbs}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide,i ) => {
							return (
								<li className="splide__slide" key={i}>
									<ImgWithPreloader src={slide.thumb} alt={slide.fileName} />
								</li>
							);
		
						})}
					</ul>
				</div>
			</div>
			<Modal escExit={true} ref={modal_image} onClose={closeModalImage}>
				<ImageModal ref={imageModal} />
            </Modal>

        </div>
	);
};



const mapStateToProps = (state: IFullState): IPropsState  => {
	return {
		product: state.catalog.category.product,
		lang: state.base.lang
	};
};




const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(SpliderPreview);
