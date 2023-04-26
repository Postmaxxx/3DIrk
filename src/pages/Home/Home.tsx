import NewsBlock from 'src/components/NewsBlock/NewsBlock';
import SpliderMax from 'src/components/Splider/CarouselMax';
import './home.scss'
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IDataLoading, IMaxSlide, IState, TLang } from "../../interfaces";
import Preloader from 'src/components/Preloader/Preloader';


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

interface IProps {
    lang: TLang
    sliderMax: {
        dataLoading: IDataLoading
        list: Array<IMaxSlide>
    }
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
const Home:React.FC<IProps> = (props): JSX.Element => {
    return (
        <div className="container_page">
            <div className="container">
                <div className='page_home'>
                    <h1>{props.lang === 'En' ? 'Header' : 'Заголовок'}</h1>
                    {mockHome.map((text, i) => (
                        <p key={i}>{text.text}</p>
                    ))}
                    <div className="slider__container">
                        <SpliderMax />
                    </div>
                    <h2>{props.lang === 'En' ? 'Last news' : 'Последние новости'}</h2>
                        <NewsBlock {...{lang: props.lang}}/>
                </div>
            </div>
        </div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    sliderMax: state.sliderMax,
  })
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Home)