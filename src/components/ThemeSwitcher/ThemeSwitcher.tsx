import { IState, TTheme } from "src/interfaces";
import "./themeSwitcher.scss"
import { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";


interface IProps {
    theme: TTheme
    setState: typeof actions
}

const ThemeSwitcher: React.FC<IProps> = (props):JSX.Element => {
    const _body: HTMLBodyElement = document.querySelector('body') as HTMLBodyElement;

    const handleChangeTheme = () => {
        if (props.theme === 'light') {
            window.localStorage.setItem('theme', 'dark')
            props.setState.setThemeDark()
        } else {
            window.localStorage.setItem('theme', 'light')
            props.setState.setThemeLight()
        }
    }

    useEffect(() => {
        props.theme === "light" ? _body.classList.remove('dark') : _body.classList.add('dark')
    }, [props.theme])


    useEffect(() => {
        const loadedTheme = window.localStorage.getItem('theme') as TTheme
        loadedTheme === 'dark' ? props.setState.setThemeDark() : props.setState.setThemeLight()  
    }, [])

    return (
        <div className="theme-switcher" onClick={handleChangeTheme}>
            <div className="sun-moon" aria-label='switch the site theme'>
                <div className="shadow"></div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IState) => ({
    theme: state.theme
  })
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher)

