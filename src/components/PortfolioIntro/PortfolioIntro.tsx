import * as actions from "src/redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { IImg, IState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import './portfolio-intro.scss'

interface IProps {
    lang: TLang
    header: TLangText
    subheader: TLangText
    headerSplider: TLangText
    text: TLangTextArr
    img: IImg
}


const PortfolioIntro:React.FC<IProps> = ({lang, header, subheader, text, headerSplider, img}): JSX.Element => {
    return (
        <div className="portfolio-intro">
            <h1>{header[lang]}</h1>
            <div className="descr">
                <img src={img.path} alt={img.alt[lang]} />
                <div className="descr__text">
                    <h2>{subheader[lang]}</h2>
                    <ul>
                            {text[lang].map((textItem, i) => {
                                return <li key={i}>{textItem.part}</li>
                            })}
                    </ul>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IState)  => {
	return {
		header: state.components.portfolios.header,
		subheader: state.components.portfolios.subheader,
		headerSplider: state.components.portfolios.headerSplider,
		text: state.components.portfolios.text,
		img: state.components.portfolios.img,
        lang: state.lang
	};
};



export default connect(mapStateToProps)(PortfolioIntro);