import { connect } from "react-redux";
import { IState, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import "./themeSwitcher.scss"
import { Dispatch } from "redux";


interface IProps {
    lang: TLang
    theme: TTheme
    setState: typeof actions
};


const ThemeSwitcher:React.FC<IProps> = (props) => {

    const handleChange= (themeNew: string) => {
        if (themeNew === 'toggle') {
            props.theme === 'light' ? 
                (document.querySelector('body') as HTMLElement).classList.add('dark')
            :
                (document.querySelector('body') as HTMLElement).classList.remove('dark')
            
            props.setState.setThemeToggle();
        }

    }

    return (
        <div className="theme-switcher">
            <label aria-label='switch the site theme'>
                <input type="checkbox" onClick={() => handleChange('toggle')}/>
            </label>
        </div>
        )
}


const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    theme: state.theme
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher)
