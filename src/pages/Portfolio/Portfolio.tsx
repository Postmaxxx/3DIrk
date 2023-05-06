import './portfolio.scss'
import portfolioHeroImg from '../../assets/img/portfolio_hero.jpg'
import { IModal, IState, TLang, TTheme } from "src/interfaces";
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

interface IProps {
    lang: TLang
    setState: typeof actions
}

const Portfolio:React.FC<IProps> = ({lang, setState}): JSX.Element => {
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
                <div className="portfolio__hero">
                    <h1>{lang === 'ru' ? "Галерея наших работ" : "Our portfolio"}</h1>
                    <div className="hero__descr">
                        <img src={portfolioHeroImg} alt="Portfolio Hero Image" />
                        <div className="hero__descr__text">
                            <h2>{lang === 'ru' ? "Подзаголовок" : "Subheader"}</h2>
                            <ul>
                                {lang === 'ru' ? <>
                                    <li>АВПВА ва пва ваып рвыап ваыпрва опрвап авып варпл двыап ва олвып лвапрвлаыопр выаплдравылыпв пвыа плывап ывалпрывадп апы варп ылвапры лвадпрыв апрываплравыпл </li>
                                    <li>АВПВА ва пва ваып рвыап ваыпрва опрвап авып варпл</li>
                                    <li>АВПВА ва пва ваып рвыап ваыпрва опрвап авып варпл</li>
                                    <li>АВПВА ва пва ваып рвыап ваыпрва опрвап авып варпл</li>
                                    <li>АВПВА ва пва ваып рвыап ваыпрва опрвап авып варпл</li>
                                </>
                                :
                                <>
                                    <li>Very important point about printing Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore reiciendis cum dicta pariatur ratione cumque.</li>
                                    <li>Very important point about printing</li>
                                    <li>Very important point about printing</li>
                                    <li>Very important point about printing</li>
                                    <li>Very important point about printing</li>
                                </>
                            }
                            </ul>
                        </div>
                    </div>
                </div>
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
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)