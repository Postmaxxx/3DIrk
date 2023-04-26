import "./langSwitcher.scss"
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IState, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";

interface IProps {
    lang: TLang
    setState: typeof actions
}

const LangSwitcher:React.FC<IProps> = (props): JSX.Element => {

    const handleChangeLang= () => {
        if (props.lang === 'En') {
            window.localStorage.setItem('language', 'Ru')
            props.setState.setLangRu()
        } else {
            window.localStorage.setItem('language', 'En')
            props.setState.setLangEn();
        }
    }

    useEffect(() => {
        (window.localStorage.getItem('language') as TLang) === 'En' ? props.setState.setLangEn() : props.setState.setLangRu()
    }, [])


    return (
        <div className="lang-switcher" onClick={handleChangeLang}>
            <span>{props.lang === 'En' ? 'En' : 'Ru'}</span>
        </div>
        )
}



const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)