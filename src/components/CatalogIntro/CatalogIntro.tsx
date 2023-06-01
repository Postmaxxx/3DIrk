import { connect } from "react-redux";
import React from "react";
import { IFullState, TLang } from "../../interfaces";
import './catalog-intro.scss'
import catalogPhoto1 from '../../assets/img/catalog/catalog_hero.webp'
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";




interface IPropsState {
    lang: TLang
}



const CatalogIntro:React.FC<IPropsState> = ({lang}): JSX.Element => {
    return (
        <div className="catalog-intro">
            <h1>{lang === 'en' ? 'Our catalog' : 'Наш каталог'}</h1>
            <div className="descr">
                <div className="img__container">
                    <ImgWithPreloader src={catalogPhoto1} alt={lang === 'en' ? 'Catalog image' : 'Фото каталога'}/>

                </div>
                <div className="descr__text">
                    <h2>{lang === 'en' ? 'Subheader' : 'Подзаголовок'}</h2>
                    <ul>
                    {lang === 'en' ? 
                        <>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                        </>
                        :
                        <>
                            <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                            <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                        </> }
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