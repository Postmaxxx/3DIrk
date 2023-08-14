import NewsBlock from '../../components/NewsBlock/NewsBlock';
import './home.scss'
import { connect } from "react-redux";
import { IContentState, IFullState, TLang } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { allActions } from '../../redux/actions/all';
import { useEffect } from "react";
import Preloader from '../../components/Preloaders/Preloader';
import { checkAndLoad } from '../../assets/js/processors';
import { IModalFunctions } from '../../../src/components/Modal/ModalNew';
import CarouselMaxAdaptive from '../../../src/components/CarouselMax/CarouselMaxAdaptive';

interface IPropsState {
    lang: TLang
    contentState: IContentState
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        content: typeof allActions.content,
    }
}

interface IProps extends IPropsState, IPropsActions {}

const Home:React.FC<IProps> = ({lang, contentState, setState, modal} : IProps): JSX.Element => {

    useEffect(() => {
        checkAndLoad({
			fetchData: contentState.load,
			loadFunc: setState.content.loadCarousel,
			force: false
		})
    }, [contentState.load.status])



    return (
        <div className='page page_home'>
            <div className="container_page">
                <div className="container">
                    <section className="intro">
                        <div className="block_text">
                            {lang === 'en' ? 
                                <>
                                    <h1>Header</h1>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                                </>
                            :
                                <>
                                    <h1>Заголовок</h1>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                    <p>ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра</p>
                                </>    
                            }
                        </div>
                    </section>
                    <div className="slider__container">
                        {contentState.load.status === 'success' && contentState?.carousel?.images?.files?.length > 0 && <CarouselMaxAdaptive content={contentState.carousel} modal={modal}/>}
                        {contentState.load.status === 'fetching' && <Preloader />}
                    </div>
                    {/*<NewsBlock />*/}
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState):IPropsState => ({
    lang: state.base.lang,
    contentState: state.content,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		content: bindActionCreators(allActions.content, dispatch),
	}
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Home)