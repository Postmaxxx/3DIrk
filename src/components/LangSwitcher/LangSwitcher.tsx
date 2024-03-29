import "./langSwitcher.scss"
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { IFullState, TLang } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useScrollHider } from "../../hooks/scrollHider";
import { allActions } from "../../redux/actions/all";
import React from 'react'


interface IPropsState {
    lang: TLang
}


interface IPropsActions {
    setState: {
        base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}

const LangSwitcher:React.FC<IProps> = ({lang, setState}): JSX.Element => {

    const _lang = useRef<HTMLButtonElement>(null)
    const {add: addToHider, clear: clearHider} = useScrollHider()

    const handleChangeLang = (): void => {
        if (lang === 'en') {
            window.localStorage.setItem('language', 'ru')
            setState.base.setLangRu()
        } else {
            window.localStorage.setItem('language', 'en')
            setState.base.setLangEn();
        }
    }

    useEffect(() => {
        let savedLang: TLang = (window.localStorage.getItem('language') as TLang);
        savedLang ||= lang;
        savedLang === 'en' ? setState.base.setLangEn() : setState.base.setLangRu()
        if (!_lang.current) return
        addToHider(_lang.current, 50)
		return () => clearHider()
    }, [])


    return (
        <button 
            className={`lang-switcher button_nostyle ${lang === 'en' ? 'en' : 'ru'}`} 
            data-testid='lang-switcher' 
            onClick={handleChangeLang} 
            ref={_lang}  
            aria-label={lang === 'en' ? `Switch language to Russian` : `Изменить язык на Английский`}
        >
            <div className="lang-switcher__text lang_ru" data-lang='en'>EN</div>
            <div className="lang-switcher__text lang_en" data-lang='ru'>RU</div>
        </button>
    )
      
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(allActions.base, dispatch),
	}
	
})
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)