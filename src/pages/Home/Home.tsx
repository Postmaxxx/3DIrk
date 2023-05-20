import NewsBlock from 'src/components/NewsBlock/NewsBlock';
import SpliderMax from 'src/components/CarouselMax/CarouselMax';
import './home.scss'
import { connect } from "react-redux";
import { IFullState, TLang } from "../../interfaces";
import { heroBlock } from 'src/assets/js/data';
import ModalController from 'src/components/Modal/modalController';

interface IPropsState {
    lang: TLang
}

interface IPropsActions {
}

interface IProps extends IPropsState, IPropsActions {}

/*

                        {props.sliderMax.dataLoading.status === 'success' ? (
                        <SpliderMax />
                        )
                        :
                        (
                            <Preloader />
                        )}
                        */
const Home:React.FC<IProps> = ({lang} : IProps): JSX.Element => {
    return (
        <section className='home'>
            <div className="container_page">
                <div className="container">
                    <div className='page_home'>
                        <h1>{lang === 'en' ? 'Header' : 'Заголовок'}</h1>
                        <div className="block_text">
                            {heroBlock.text[lang].map((item, i) => (
                                <p key={i}>{item.part}</p>
                            ))}
                        </div>
                        <div className="slider__container">
                            {/*<SpliderMax />*/}
                        </div>
                        <NewsBlock />
                    </div>
                </div>
            </div>
        </section>
    )
}




const mapStateToProps = (state: IFullState):IPropsState => ({
    lang: state.base.lang,
})
  
export default connect(mapStateToProps)(Home)