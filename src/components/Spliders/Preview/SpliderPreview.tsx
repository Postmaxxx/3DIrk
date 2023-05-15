import { AnyAction, Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useEffect, useMemo, useRef, } from "react";
import "@splidejs/react-splide/css";
import "./splider-preview.scss";
import { IFullState, IImg, IProductState, ISpliderOptions, TLang } from "src/interfaces";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "src/assets/js/ImgWithPreloader";
import { loadProduct, setSelectedImage } from "src/redux/actions/product"
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
		
	const optionsThumbs: Partial<ISpliderOptions> = {
		lazyLoad	: false,
		perPage		: 5,
		gap        	: 10,
		rewind     	: false,
		pagination 	: false,
		isNavigation: true,
		focus		: "center",
		//trimSpace: true,
		direction   : 'ttb',
		wheel       : true,
		releaseWheel: true,
		height: '80%',
		breakpoints	: {
			1600: {
				perPage: 4
			}, 
			1241: {
				perPage: 4
			}, 
			992: {
				perPage: 4
			}, 
			768: {
				perPage: 5	,
				direction   : 'ltr',
				height: 'auto',
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


    const showSlide = (slideToGo: number | string) => {
		splideThumb.current?.go(slideToGo);
	};


	function modalKeyListener (e: KeyboardEvent) {
		e.keyCode === 37 && showSlide("<");
		e.keyCode === 39 && showSlide(">");
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
            setState.product.setSelectedImage(splideMain.current?.index || 0)
		};
		
	}, []);

	
	useEffect(() => {
		showSlide(product.selectedImage);
		document.addEventListener("keyup", modalKeyListener);
		//document.querySelector("body")?.classList.add("noscroll");
		return (() => {
			document.removeEventListener("keyup", modalKeyListener);
		});
	}, [product.selectedImage]);



	return (
        <div className="splider_preview">
			<div id="modalThumbs" className="splide" ref={_splideThumbs}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide) => {
							return (
								<li className="splide__slide" key={slide.url}>
									<ImgWithPreloader src={slide.url} alt={slide.name[lang]} />
								</li>
							);
		
						})

						}
					</ul>
				</div>
			</div>
			<div id="modalMain" className="splide" ref={_splideMain}>
				<div className="splide__track">
					<ul className="splide__list">
						{product.imgs.map((slide) => {
							return (
								<li className="splide__slide" key={slide.url}>
									<ImgWithPreloader src={slide.url} alt={slide.name[lang]} />
								</li>
							);
						})
						}
					</ul>
				</div>
			</div>

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
