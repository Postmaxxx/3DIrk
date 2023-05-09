import './portfolio.scss'
import { IFullState, IModal, TLang, TLangText } from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import SpliderSingle from 'src/components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 
import Modal from 'src/components/Modal/Modal';
import SpliderPreview from 'src/components/Spliders/Preview/SpliderPreview';
import PortfolioList from 'src/components/PortfolioList/PortfolioList';
import CatalogIntro from 'src/components/PortfolioIntro/CatalogIntro';



import { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus }  from "../../redux/actions/order"

const actionsList = { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus  }

interface IPropsState {
    lang: TLang,
}

interface IPropsActions {
    setState: {
        order: typeof actionsList
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
        <section className="portfolio">
            <div className="container">
                <CatalogIntro />
                <div className="splider_portfolio__main">
                    <PortfolioList />
                    <SpliderSingle onPortfolioClicked={onPortfolioClicked}/>
                </div>
                <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
                    <div className="splider_portfolio__modal">
                        <SpliderPreview />
                    </div>
                </Modal> 
            </div>
        </section>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    order: state.order,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		order: bindActionCreators(actionsList, dispatch)
	}
})
  
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Catalog)

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