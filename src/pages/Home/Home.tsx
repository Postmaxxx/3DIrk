import NewsBlock from 'src/components/NewsBlock/NewsBlock';
import SpliderMax from 'src/components/Splider/CarouselMax';
import './home.scss'
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IDataLoading, IHeroBlock, IMaxSlide, IState, TLang } from "../../interfaces";
import Preloader from 'src/components/Preloader/Preloader';

/*
const mockHome = [
    {
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
    },
    {
        text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
    },
    {
        text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
    },
    {
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
    }

]
*/
interface IProps {
    lang: TLang
    sliderMax: {
        dataLoading: IDataLoading
        list: Array<IMaxSlide>
    }
    heroBlock: IHeroBlock
    setState: typeof actions
}

/*

                        {props.sliderMax.dataLoading.status === 'success' ? (
                        <SpliderMax />
                        )
                        :
                        (
                            <Preloader />
                        )}
                        */
const Home:React.FC<IProps> = ({lang, sliderMax, heroBlock} : IProps): JSX.Element => {
    return (
        <div className="container_page">
            <div className="container">
                <div className='page_home'>
                    <h1>{lang === 'en' ? 'Header' : 'Заголовок'}</h1>
                    {heroBlock.text[lang].map((item, i) => (
                        <p key={i}>{item.part}</p>
                    ))}
                    <div className="slider__container">
                        <SpliderMax />
                    </div>
                    <h2>{lang === 'en' ? 'Last news' : 'Последние новости'}</h2>
                        <NewsBlock />
                </div>
            </div>
        </div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    sliderMax: state.sliderMax,
    heroBlock: state.components.heroBlock
  })
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Home)