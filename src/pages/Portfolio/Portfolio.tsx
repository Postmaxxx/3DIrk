import './portfolio.scss'
import portfolioHeroImg from '../../assets/img/portfolio_hero.jpg'
import { IState, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Gallery from 'src/components/Gallery/Gallery';
import { useEffect, useState } from "react";


interface IProps {
    lang: TLang
    setState: typeof actions
}

const Portfolio:React.FC<IProps> = (props) => {

    useEffect(() => {
        props.setState.setPortfolios()
    }, [])


    return (
        <section className="portfolio">
            <div className="container">
                <div className="portfolio__hero">
                    <h1>{props.lang === 'Ru' ? "Галерея наших работ" : "Our portfolio"}</h1>
                    <div className="hero__descr">
                        <img src={portfolioHeroImg} alt="Portfolio Hero Image" />
                        <div className="hero__descr__text">
                            <h2>{props.lang === 'Ru' ? "Подзаголовок" : "Subheader"}</h2>
                            <ul>
                                {props.lang === 'Ru' ? <>
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
                <div className="portfolio__gallery">
                    <Gallery />
                </div>


            </div>
        </section>
    )
}



const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)