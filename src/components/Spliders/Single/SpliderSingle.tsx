import './splider-single.scss'
import { ICategories, ICategoriesList, IDataLoading, IFullState, ISpliderOptions, TId, TLang,} from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "src/assets/js/ImgWithPreloader";
import { findBestSuitedImg } from "src/assets/js/findBestSuitedImg";
import InfoPortfolio from 'src/components/InfoPortfolio/InfoPortfolio';
import InfoSlide from 'src/components/InfoSlide/InfoSlide';
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategoriey, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList }  from "src/redux/actions/catalog"

const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategoriey, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList  }

interface IPropsState {
    list: ICategoriesList[]
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	loading: IDataLoading
	categories: ICategories
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}

interface IContainerSize {
	width: number
	height: number
}

interface IPortfolioSplider {
	list: Array<ProjectItemListItem>
	selectedPortfolio: number
	selectedImage: number
	onPortfolioClicked: () => void
    setState: typeof actions
}

const PortfolioSplider: React.FC<IProps> = ({list, selectedPortfolio, selectedImage, setState, onPortfolioClicked}): JSX.Element => {
	
	const containerSize = useRef<IContainerSize>({width: 0, height: 0});
	const portfolioSplide = useRef<Splide>();
	const _splideMain = useRef<HTMLDivElement>(null);
	const [firstRender, setFirstRender] = useState<boolean>(true);

	const optionsMain: Partial<ISpliderOptions> = {
		lazyLoad: false,
		updateOnMove: true,
		perPage: 1,
		fixedWidth: "100%",
		perMove: 1,
		pagination: true,
		arrows: true,
		drag: true,
		speed: 500,
		wheel: true,
		wheelSleep: 300,
		interval: 15000,
		pauseOnHover: true,
		breakpoints: {
			768: {
				wheel: false,
			}, 
		},
	};

    
	const changeCurrentImage = (selectedImage: number) => {
		setState.setSelectedPortfolioImage(selectedImage);
	};


	const goToImage = (imageToGo: number) => {
		if (!portfolioSplide.current) return
		portfolioSplide.current.go(imageToGo);
	};

	const additionalRender = () => {
		setFirstRender(false);
	};

	const onClick = () => {
		onPortfolioClicked()
	}

	useEffect(() => {
        if (!_splideMain.current) return
		containerSize.current = {
			width:  _splideMain.current.offsetWidth,
			height:  _splideMain.current.offsetHeight,
		};
		portfolioSplide.current = new Splide(_splideMain.current, optionsMain);
		portfolioSplide.current.mount();	
			
		portfolioSplide.current.on("active", () => {changeCurrentImage(portfolioSplide.current?.index as number);});
			
		const _slides: NodeList = _splideMain.current.querySelectorAll(".splide__slide-container");
		_slides.forEach(cont => cont.addEventListener("click", onClick));
		changeCurrentImage(portfolioSplide.current.index);
		return () => {
			
			_slides.forEach(cont => cont.removeEventListener("click", onClick));
			portfolioSplide.current?.destroy();
		};
	}, [selectedPortfolio]);


	useEffect(() => {
		goToImage(selectedImage);
	}, [selectedImage]);
	

	useEffect(() => {
		additionalRender();
	},[]);


	

	return (
		<div className="splider_single__container">
            <InfoPortfolio text={list[selectedPortfolio].descr}/>
			<div className="splide splider_single" ref={_splideMain} aria-label="The carousel with thumbnails. Click the image to expand.">
				<div className="splide__track">
					<ul className="splide__list">
						{list[selectedPortfolio].images.map((slide, index: number) => {
							return (
								<li className="splide__slide" key={selectedPortfolio * 1000 + index}>
									<div className="splide__slide-container">
										{<ImgWithPreloader link={findBestSuitedImg({images: slide.images, width: containerSize.current?.width, height: containerSize.current?.height}).image} alt={slide.descr}/>}
									</div>
								</li>
							);
						})
						}
					</ul>
				</div>
			</div>
            <InfoSlide {...{text: list[selectedPortfolio].images[selectedImage].descr, link: list[selectedPortfolio].images[selectedImage].link}}/>
		</div>
	)

};



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	loading: state.catalog.categories[state.catalog.selectedCategory].dataLoading,
	list: state.catalog.categoriesList,
	selectedCategory: state.catalog.selectedCategory,
	categories: state.catalog.categories,
	selectedProduct: state.catalog.selectedProduct
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsList, dispatch)
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioSplider);
