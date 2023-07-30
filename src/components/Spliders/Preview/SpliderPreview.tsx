import { AnyAction, Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useEffect, useRef} from "react";
import "@splidejs/react-splide/css";
import "./splider-preview.scss";
import { IFullState, ISpliderOptions, TImageSizes, TLang } from "../../../interfaces";
import Splide from "@splidejs/splide";
import ImgWithPreloader from "../../../assets/js/ImgWithPreloader";
import { allActions } from "../../../redux/actions/all";
import { IModalFunctions } from "../../../../src/components/Modal/ModalNew";
import ImageModalNew from "../../../../src/components/ImageModal/ImageModalNew";




interface IPropsState {
	lang: TLang,
    modal: IModalFunctions | null
}


interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}


interface IProps extends IPropsState, IPropsActions {
	images: {
		paths: Partial<Record<TImageSizes, string>>
		files: string[]
	}
	sizePreview?: TImageSizes
	sizeMain?: TImageSizes
}


const SpliderPreview: React.FC<IProps> = ({ modal, images, sizePreview='preview', sizeMain='medium'}): JSX.Element => {
	const _splideMain = useRef<HTMLDivElement>(null);
	const _splideThumbs = useRef<HTMLDivElement>(null);
	const splideMain = useRef<Splide>();
	const splideThumb = useRef<Splide>();

	
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


	const onImageClick = (e: React.MouseEvent , filename: string) => {
        if (!filename) return
        e.stopPropagation()
		modal?.openModal({
			name: 'spliderPreview',
			children: <ImageModalNew url={`${images.paths.full}/${filename}`}/>
		})
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
		};
		
	}, []);


	return (
        <div className="splider_preview">
			<div id="spliderMain" className="splide" ref={_splideMain}>
				<div className="splide__track">
					<ul className="splide__list">
						{images.files.map((filename,i) => {
							return (
								<li className="splide__slide" key={filename} onClick={(e) => onImageClick(e, filename)}>
									<ImgWithPreloader src={`${images.paths[sizeMain]}/${filename}`} alt={filename} />
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div id="spliderThumbs" className="splide" ref={_splideThumbs}>
				<div className="splide__track">
					<ul className="splide__list">
						{images.files.map((filename, i) => {
							return (
								<li className="splide__slide" key={filename}>
									<ImgWithPreloader src={`${images.paths[sizePreview]}/${filename}`} alt={filename} />
								</li>
							);
		
						})}
					</ul>
				</div>
			</div>
        </div>
	);
};



const mapStateToProps = (state: IFullState): IPropsState  => {
	return {
		lang: state.base.lang,
		modal: state.base.modal.current
	};
};




const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(SpliderPreview);
