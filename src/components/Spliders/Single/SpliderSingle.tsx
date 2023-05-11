import './splider-single.scss'
import { ICategories, ICategoriesListItem, IDataLoading, IFullState, IProduct, ISpliderOptions, TId, TLang,} from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "src/assets/js/ImgWithPreloader";
import { findBestSuitedImg } from "src/assets/js/findBestSuitedImg";
import InfoPortfolio from 'src/components/InfoPortfolio/InfoPortfolio';
import InfoSlide from 'src/components/InfoSlide/InfoSlide';
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory }  from "src/redux/actions/catalog"
import Preloader from 'src/components/Preloader/Preloader';
import Gallery from 'src/components/Gallery/Gallery';

const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList, loadCategory  }

interface IPropsState {
    categoriesList: ICategoriesListItem[]
	selectedCategory: TId
	selectedProduct: TId
	lang: TLang
	loadingProducts: IDataLoading
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


const PortfolioSplider: React.FC<IProps> = ({lang, selectedCategory, selectedProduct, setState, loadingProducts, categories}): JSX.Element => {
	
	const containerSize = useRef<IContainerSize>({width: 0, height: 0});
	const portfolioSplide = useRef<Splide>();
	const _splideMain = useRef<HTMLDivElement>(null);
	const [newRender, addRender] = useState<number>(0);
	const [productSlides, setProductSlides] = useState<IProduct[][]>([[]])
	const [page, setPage] = useState<number>(0)
	const productsPerSlide = 6;

	const optionsMain: Partial<ISpliderOptions> = {
		lazyLoad: false,
		updateOnMove: true,
		perPage: 1,
		fixedWidth: "100%",
		perMove: 1,
		pagination: true,
		arrows: true,
		drag: false,
		speed: 500,
		wheel: false,
		wheelSleep: 300,
		interval: 0,
		pauseOnHover: true,
		breakpoints: {
			768: {
				wheel: false,
			}, 
		},
	};



	useEffect(() => {
		if (selectedCategory && !categories[selectedCategory]) {
			setState.catalog.loadCategory(selectedCategory)
		}
	},[selectedCategory]);


	
	useEffect(() => {
		if (categories[selectedCategory]?.dataLoading?.status === 'success') {
			const result: IProduct[][] = []
			for (let i = 0; i < categories[selectedCategory].products.length; i += productsPerSlide) {
				result.push(categories[selectedCategory].products.slice(i, i + productsPerSlide))
			}
			setProductSlides(result)
		}
	},[categories[selectedCategory]?.dataLoading?.status, selectedCategory]);


	


	

	useEffect(() => {
		if (!_splideMain.current) return
			containerSize.current = {
				width:  _splideMain.current.offsetWidth,
				height:  _splideMain.current.offsetHeight,
			};
			portfolioSplide.current = new Splide(_splideMain.current, optionsMain);

			portfolioSplide.current.on( 'pagination:updated', function (data, prev, upd) {
				data.list.classList.add( 'splide__pagination--custom' );
				data.items.forEach((item, i) => {
					if (i === 0 || i === data.items.length-1 || (i <= upd.page + 1 && i >= upd.page - 1)) {
						item.button.classList.remove('no-display')
					} else {
						item.button.classList.add('no-display')
					}
					if ((i === upd.page+2 && upd.page+2 < data.items.length-1) || (i === upd.page-2 && upd.page-2 > 0)) {
						item.button.textContent = ' ... ';	
						item.button.classList.remove('no-display')
					} else {
						item.button.textContent = String(item.page + 1);					
					}
				} );
			});

			portfolioSplide.current.on("active", () => {
				setPage(portfolioSplide.current?.index as number)
			});
			portfolioSplide.current.mount();
				
			//const _slides: NodeList = _splideMain.current.querySelectorAll(".splide__slide-container");
			//_slides.forEach(cont => cont.addEventListener("click", onClick));
			//changeCurrentImage(portfolioSplide.current.index);
			
		return () => {
			//_slides.forEach(cont => cont.removeEventListener("click", onClick));
			portfolioSplide.current?.destroy();
		};
	}, [productSlides])




	return (
		<div className="splider_single__container">
            {/*<InfoPortfolio text={list[selectedPortfolio].descr}/>*/}
			<div className="splide splider_single" ref={_splideMain} aria-label="">
				<div className="splide__track">
					<ul className="splide__list">
						{loadingProducts?.status === 'success' ? 
							productSlides.map((products, i): JSX.Element => {
								return (
									<li className="splide__slide" key={i}>
										<Gallery products={products}/>
									</li>
								)
							})
							
						:
							<Preloader />
						}
					</ul>
				</div>
			</div>
            {/*<InfoSlide {...{text: list[selectedPortfolio].images[selectedImage].descr, link: list[selectedPortfolio].images[selectedImage].link}}/>*/}
		</div>
	)

};

/*
categories[selectedCategory]?.products.map((product, index: number) => {
							return (
								<li className="splide__slide" key={product.id}>
									<div className="prosucts__container">
										gffg
										{<ImgWithPreloader link={findBestSuitedImg({images: slide.images, width: containerSize.current?.width, height: containerSize.current?.height}).image} alt={slide.descr}/>}
									</div>
								</li>
								);
								})
								*/


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	loadingProducts: state.catalog.categories[state.catalog.selectedCategory]?.dataLoading,
	categoriesList: state.catalog.categoriesList,
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
