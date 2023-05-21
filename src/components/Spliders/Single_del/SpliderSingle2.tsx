import './splider-single2.scss'
import { ICategories, ICategoriesListItem, IDataLoading, IFullState, IProduct, ISpliderOptions, TId, TLang,} from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Splide from "@splidejs/splide";
import { findBestSuitedImg } from "src/assets/js/findBestSuitedImg";
import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedProduct, loadCategoriesList, loadCategory, setPage, setCategory } from "src/redux/actions/catalog"
import Preloader from 'src/components/Preloaders/Preloader';
import Gallery from 'src/components/Gallery/Gallery';

const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedProduct, loadCategoriesList, loadCategory, setPage, setCategory  }

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

const SpliderSingle2: React.FC<IProps> = ({lang, selectedCategory, setState, loadingProducts, categories}): JSX.Element => {
	
	const spliderSingle = useRef<Splide>();
	const _splideMain = useRef<HTMLDivElement>(null);
	const [productSlides, setProductSlides] = useState<IProduct[][]>([[]])
	const [productsPerSlide, setProductsPerSlide] = useState<number>(6)

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
		if (categories[selectedCategory]?.dataLoading?.status !== 'success') return
		const result: IProduct[][] = []
		for (let i = 0; i < categories[selectedCategory].products.length; i += productsPerSlide) {
			result.push(categories[selectedCategory].products.slice(i, i + productsPerSlide))
		}
		setProductSlides(result)
		
	},[categories[selectedCategory]?.dataLoading?.status, selectedCategory]);
	
	
	
	

	
	
	useEffect(() => {
		if (!_splideMain.current) return

		if (document.body.offsetWidth < 993) {
			setProductsPerSlide(4)
		}
		
		
		spliderSingle.current = new Splide(_splideMain.current, optionsMain);
		
		spliderSingle.current.on( 'pagination:updated', function (data, prev, upd) {
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
		
		spliderSingle.current.on("move", () => {
			setState.catalog.setPage(spliderSingle.current?.index as number)
		});

		spliderSingle.current.mount();

		spliderSingle.current?.go(categories[selectedCategory].page);

		
		return () => {
			spliderSingle.current?.destroy();
		};
	}, [productSlides])




	return (
		<div className="splider_single__container">
			{loadingProducts?.status === 'success' ? 
				<div className="splide splider_single" ref={_splideMain} aria-label="">
					<div className="splide__track">
						<ul className="splide__list">
							{productSlides.map((products, i): JSX.Element => {
								return (
									<li className="splide__slide" key={i}>
										<Gallery products={products}/>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			:
				<Preloader />}
		</div>
	)

};


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	loadingProducts: state.catalog.categories[state.catalog.selectedCategory]?.dataLoading,
	categoriesList: state.catalog.categoriesList,
	selectedCategory: state.catalog.selectedCategory,
	categories: state.catalog.categories,
	selectedProduct: state.catalog.selectedProduct,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsList, dispatch)
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(SpliderSingle2);
