import NewsBlock from '../../components/NewsBlock/NewsBlock';
import SpliderMax from '../../components/CarouselMax/CarouselMax';
import './home.scss'
import { connect } from "react-redux";
import { IFullState, TLang } from "../../interfaces";

interface IPropsState {
    lang: TLang
}

interface IPropsActions {
}

interface IProps extends IPropsState, IPropsActions {}

const Home:React.FC<IProps> = ({lang} : IProps): JSX.Element => {
    console.log('home re');
    
    return (
        <div className='page page_home'>
            <div className="container_page">
                <div className="container">
                    <div className='page_home'>
                        <div className="block_text">
                            <h1>{lang === 'en' ? 'Header' : 'Заголовок'}</h1>
                            {lang === 'en' ? 
                                <>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                                </>
                            :
                                <>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                </>    
                            }
                        </div>
                        <div className="slider__container">
                            <SpliderMax />
                        </div>
                        <NewsBlock />
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState):IPropsState => ({
    lang: state.base.lang,
})
  
export default connect(mapStateToProps)(Home)