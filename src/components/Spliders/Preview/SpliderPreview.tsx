import * as actions from "src/redux/actions";
import { AnyAction, Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useEffect, useMemo, useRef, } from "react";
import "@splidejs/react-splide/css";
import "./splider-preview.scss";
import { ISpliderOptions, ProjectItemListItem} from "src/interfaces";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "src/assets/js/ImgWithPreloader";
import { IState } from "src/interfaces";





interface ISpliderPreview {
	selectedPortfolio: number
	selectedImage: number
	list: Array<ProjectItemListItem>
    setState: typeof actions
}

const SpliderPreview: React.FC<ISpliderPreview> = ({selectedPortfolio, selectedImage, list, setState}): JSX.Element => {
	const _splideMain = useRef<HTMLDivElement>(null);
	const _splideThumbs = useRef<HTMLDivElement>(null);
	const splideMain = useRef<Splide>();
	const splideThumb = useRef<Splide>();
		
	const optionsThumbs: Partial<ISpliderOptions> = {
		lazyLoad	: false,
		perPage		: 12,
		gap        	: 10,
		rewind     	: false,
		pagination 	: false,
		isNavigation: true,
		focus		: "center",
		breakpoints	: {
			1600: {
				perPage: 10
			}, 
			1241: {
				perPage: 8
			}, 
			992: {
				perPage: 7
			}, 
			768: {
				perPage: 5
			}, 
			480: {
				perPage: 4
			}, 
		},
	};


	const optionsMain: Partial<ISpliderOptions> = {
		lazyLoad: true,
		type      : "fade",
		rewind    : false,
		pagination: false,
		speed: 500,
		wheel: true,
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
            setState.setSelectedPortfolioImage(splideMain.current?.index || 0)
		};
		
	}, []);

	
	useEffect(() => {
		showSlide(selectedImage);
		document.addEventListener("keyup", modalKeyListener);
		document.querySelector("body")?.classList.add("noscroll");
		return (() => {
			document.removeEventListener("keyup", modalKeyListener);
		});
	}, [selectedImage]);



	return (
        <div className="splider_preview">
			<div id="modalMain" className="splide" ref={_splideMain}>
				<div className="splide__track">
					<ul className="splide__list">
						{list[selectedPortfolio].images.map((slide) => {
							return (
								<li className="splide__slide" key={slide.images[0].image}>
									<ImgWithPreloader link={slide.images[slide.images.length - 1].image} alt={slide.descr} />
								</li>
							);
						})
						}
					</ul>
				</div>
			</div>
			<div id="modalThumbs" className="splide" ref={_splideThumbs}>
				<div className="splide__track">
					<ul className="splide__list">
						{list[selectedPortfolio].images.map((slide) => {
							return (
								<li className="splide__slide" key={slide.images[0].image}>
									<ImgWithPreloader link={slide.images[0].image} alt={slide.descr} />
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



const mapStateToProps = (state: IState)  => {
	return {
		selectedPortfolio: state.portfolios.selectedPortfolio,
		selectedImage: state.portfolios.selectedImage,
		list: state.portfolios.list
	};
};


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
	setState: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpliderPreview);
