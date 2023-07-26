import './splider-single.scss'
import { ICatalogState, IFullState, IProduct, IProductShort, ISpliderOptions, TId, TLang,} from "../../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Splide from "@splidejs/splide";
import Preloader from '../../../components/Preloaders/Preloader';
import Gallery from '../../../components/Gallery/Gallery';
import { allActions } from "../../../redux/actions/all";


interface IPropsState {
	lang: TLang
	catalogState: ICatalogState
}


interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}



interface IProps extends IPropsState, IPropsActions {}

const SpliderSingle: React.FC<IProps> = ({lang, catalogState, setState}): JSX.Element => {
	
	const spliderSingle = useRef<Splide>();
	const _splideMain = useRef<HTMLDivElement>(null);
	const [productSlides, setProductSlides] = useState<IProductShort[][]>([[]])
	const [productsPerSlide, setProductsPerSlide] = useState<number>(6)
	const [page, setPage] = useState<number>(0)

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



	/*useEffect(() => {
		//setState.catalog.loadCategory({_id: catalog.category._id, from: 0, to: productsPerSlide})	
	},[catalogState.category._id]);*/


	
	useEffect(() => {
		if (catalogState.category.loadCategory.status !== 'success') return
		const result: IProductShort[][] = []
		for (let i = 0; i < catalogState.category.products.length; i += productsPerSlide) {
			result.push(catalogState.category.products.slice(i, i + productsPerSlide))
		}
		setProductSlides(result)
		
	},[catalogState.category.loadCategory.status, catalogState.category._id]);
	
	
	
	

	
	
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
			setPage(spliderSingle.current?.index as number)
		});

		spliderSingle.current.mount();
		
		spliderSingle.current?.go(page);

		
		return () => {
			spliderSingle.current?.destroy();
		};
	}, [productSlides])




	return (
		<div className="splider_single__container">
			{catalogState.category.loadCategory.status === 'success' ? 
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
	catalogState: state.catalog
})



const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(SpliderSingle);
