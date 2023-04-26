import NewsBlock from 'src/components/NewsBlock/NewsBlock';
import SpliderMax from 'src/components/Splider/CarouselMax';
import './home.scss'
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IDataLoading, IMaxSlide, IState, TLang } from "../../interfaces";
import Preloader from 'src/components/Preloader/Preloader';




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
                    <h1>Header</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                    <div className="slider__container">
                        <SpliderMax />
                    </div>
                    <h2>Last news</h2>
                    <NewsBlock />
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