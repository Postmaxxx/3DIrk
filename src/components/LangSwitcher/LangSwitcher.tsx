import "./langSwitcher.scss"
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IState, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";

interface IProps {
    lang: TLang
	mobOpened: boolean
    setState: typeof actions
}

const LangSwitcher:React.FC<IProps> = (props): JSX.Element => {

    const handleChangeLang = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.lang === 'en') {
            window.localStorage.setItem('language', 'ru')
            props.setState.setLangRu()
            e.currentTarget.classList.add('ru')
            e.currentTarget.classList.remove('en')
        } else {
            window.localStorage.setItem('language', 'en')
            props.setState.setLangEn();
            e.currentTarget.classList.add('en')
            e.currentTarget.classList.remove('ru')
        }
    }

    useEffect(() => {
        (window.localStorage.getItem('language') as TLang) === 'en' ? props.setState.setLangEn() : props.setState.setLangRu()
    }, [])


    return (
        <div className={`lang-switcher ${props.lang} ${props.mobOpened || "hide"}`} onClick={handleChangeLang}>
            <div className="lang-switcher__text lang_ru" data-lang='ru'>RU</div>
            <div className="lang-switcher__text lang_en" data-lang='en'>EN</div>
        </div>

        )   
}



const mapStateToProps = (state: IState) => ({
    lang: state.lang,
	mobOpened: state.nav.mobOpened,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)

  /*
              <div className="lang-selector selector_ru"></div>
            <div className="lang-selector selector_en"></div>

            */