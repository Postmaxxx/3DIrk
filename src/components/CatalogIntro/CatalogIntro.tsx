import { connect } from "react-redux";
import React from "react";
import { IFullState, TLang } from "src/interfaces";
import './catalog-intro.scss'
import { catalogBlock } from "src/assets/js/data";



interface IPropsState {
    lang: TLang
}



const CatalogIntro:React.FC<IPropsState> = ({lang}): JSX.Element => {
    return (
        <div className="catalog-intro">
            <h1>{catalogBlock.header[lang]}</h1>
            <div className="descr">
                <img src={catalogBlock.img.url} alt={catalogBlock.img.name[lang]} />
                <div className="descr__text">
                    <h2>{catalogBlock.subheader[lang]}</h2>
                    <ul>
                            {catalogBlock.text[lang].map((textItem, i) => {
                                return <li key={i}>{textItem.part}</li>
                            })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
})




export default connect(mapStateToProps)(CatalogIntro);