import { AnyAction, Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useEffect, useMemo, useRef, useState, } from "react";
import "@splidejs/react-splide/css";
import "./splider-preview.scss";
import { IFullState, IImg, IModal, IProduct, IProductState, ISpliderOptions, TLang } from "src/interfaces";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "src/assets/js/ImgWithPreloader";
import { loadProduct, setSelectedImage } from "src/redux/actions/product"
import Modal from "src/components/Modal/Modal";
import ModalImage from "src/components/MessageImage/MessageImage";
const actionsList = { loadProduct, setSelectedImage }


interface IPropsState {
	lang: TLang,
	product: IProductState
}

interface IPropsActions {
    setState: {
        product: typeof actionsList
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
	const [modal, setModal] = useState<IModal>({visible: false})
		
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

	const onImageClick = (slide: IImg) => {
		setModal({visible: true})
	}


	const closeModal = () => {
		setModal({visible: false})
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

	
	/*useEffect(() => {
		showSlide(product.selectedImage);
		document.addEventListener("keyup", modalKeyListener);
		//document.querySelector("body")?.classList.add("noscroll");
		return (() => {
			document.removeEventListener("keyup", modalKeyListener);
		});
	}, [product.selectedImage]);*/




	return (
        <div className="splider_preview">
			<div id="modalMain" className="splide" ref={_splideMain}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide,i) => {
							return (
								<li className="splide__slide" key={i} onClick={() => onImageClick(slide)}>
									<ImgWithPreloader src={slide.url} alt={slide.name[lang]} />
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div id="modalThumbs" className="splide" ref={_splideThumbs}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide,i ) => {
							return (
								<li className="splide__slide" key={i}>
									<ImgWithPreloader src={slide.url} alt={slide.name[lang]} />
								</li>
							);
		
						})}
					</ul>
				</div>
			</div>
			<Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
				<ModalImage props={{path: product.imgs[splideMain.current?.index || 0].url, descr: product.imgs[splideMain.current?.index || 0].name[lang]}}/>
			</Modal> 

        </div>
	);
};



const mapStateToProps = (state: IFullState): IPropsState  => {
	return {
		product: state.product,
		lang: state.base.lang
	};
};



const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		product: bindActionCreators(actionsList, dispatch)
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(SpliderPreview);
