import { IFullState, TLang } from 'src/interfaces'
import './preloader.scss'
import { connect } from "react-redux";

interface IPropsState {
    lang: TLang
}

interface IPreloader {
    wide?: boolean
}

interface IProps extends IPropsState, IPreloader{}


const Preloader:React.FC<IProps> = ({lang, wide}): JSX.Element => {
    return wide ? 
        <div className="preloader_w" title={lang === 'en' ? 'Please wait' : 'Пожалуйста, подождите'} aria-role="alert" aria-roledescription={lang === 'en' ? 'Please wait' : 'Пожалуйста, подождите'}>
            <div className="dash dash_1"></div>
            <div className="dash dash_2"></div>
            <div className="dash dash_3"></div>
            <div className="dash dash_4"></div>
        </div>
        : 
        <div className='preloader' title={lang === 'en' ? 'Please wait' : 'Пожалуйста, подождите'} aria-rile></div>
    
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
})

  
    
export default connect(mapStateToProps, )(Preloader)