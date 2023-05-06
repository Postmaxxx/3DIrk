import './portfolio.scss'
import { IModal, IState, TLang, TLangText, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import SpliderSingle from 'src/components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 
import Modal from 'src/components/Modal/Modal';
import SpliderPreview from 'src/components/Spliders/Preview/SpliderPreview';
import PortfolioList from 'src/components/PortfolioList/PortfolioList';
import PortfolioIntro from 'src/components/PortfolioIntro/PortfolioIntro';

interface IProps {
    lang: TLang
    headerSplider: TLangText
    setState: typeof actions
}

const Portfolio:React.FC<IProps> = ({lang, setState, headerSplider}): JSX.Element => {
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
        //props.setState.getPortfolios()
        if (!modal.visible) {
            document.querySelector("body")?.classList.remove("noscroll");
            console.log('closed');
        }
    }, [modal.visible])


    return (
        <section className="portfolio">
            <div className="container">
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
            </div>
        </section>
    )
}



const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    headerSplider: state.components.portfolios.headerSplider
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)