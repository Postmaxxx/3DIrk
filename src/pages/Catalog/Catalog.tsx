import './catalog.scss'
import { IFullState, IModal, TLang } from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import SpliderSingle from 'src/components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 
import Modal from 'src/components/Modal/Modal';
import SpliderPreview from 'src/components/Spliders/Preview/SpliderPreview';
import CategoriesList from 'src/components/CategoriesList/CategoriesList';
import CatalogIntro from 'src/components/CatalogIntro/CatalogIntro';

import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList }  from "../../redux/actions/catalog"

const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategory, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList  }

interface IPropsState {
    lang: TLang,
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Catalog:React.FC<IProps> = ({lang, setState}): JSX.Element => {
	const [modal, setModal] = useState<IModal>({visible: false})

    const showSplideModal = () => {
        setModal({visible: true});
    };

    const closeModal = () => {
        setModal({visible: false});
    }


	const onPortfolioClicked = () => {
		showSplideModal()
    }
    

    useEffect(() => {
        if (!modal.visible) {
            document.querySelector("body")?.classList.remove("noscroll");
        }
    }, [modal.visible])


    return (
        <section className="catalog">
            <div className="container">
                <CatalogIntro />
                <div className="splider_catalog__main">
                    <CategoriesList />
                    <SpliderSingle />
                </div>
            </div>
        </section>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsList, dispatch)
	}
})
  
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Catalog)
/*
                <div className="splider_portfolio__main">
                    <PortfolioList />
                    <SpliderSingle onPortfolioClicked={onPortfolioClicked}/>
                </div>
                <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
                    <div className="splider_portfolio__modal">
                        <SpliderPreview />
                    </div>
                </Modal> 
*/


/*

                <PortfolioIntro />
                <h2>{headerSplider[lang]}</h2>
                <div className="splider_portfolio__main">
                    <PortfolioList />
                    <SpliderSingle onPortfolioClicked={onPortfolioClicked}/>
                </div>
                <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
                    <div className="splider_portfolio__modal">
                        <SpliderPreview />
                    </div>
                </Modal> 
*/