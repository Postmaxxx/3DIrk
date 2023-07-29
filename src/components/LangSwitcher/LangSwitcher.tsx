import "./langSwitcher.scss"
import { useEffect, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { IFullState, TLang, TTheme } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useScrollHider } from "../../hooks/scrollHider";
import { allActions } from "../../redux/actions/all";


interface IPropsState {
    lang: TLang
	mobOpened: boolean
}


interface IPropsActions {
    setState: {
        base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}

const LangSwitcher:React.FC<IProps> = ({lang, mobOpened, setState}): JSX.Element => {

    const _lang = useRef<HTMLDivElement>(null)
    const {add: addToHider, clear: clearHider} = useScrollHider()

    const handleChangeLang = () => {
        if (lang === 'en') {
            window.localStorage.setItem('language', 'ru')
            setState.base.setLangRu()
        } else {
            window.localStorage.setItem('language', 'en')
            setState.base.setLangEn();
        }
    }

    useEffect(() => {
        (window.localStorage.getItem('language') as TLang) === 'en' ? setState.base.setLangEn() : setState.base.setLangRu()
        if (!_lang.current) return
        addToHider(_lang.current, 50)
		return () => clearHider()
    }, [])


    return (
        <div className={`lang-switcher ${mobOpened ? '' : 'hide'} ${lang === 'en' ? 'ru' : 'en'}`} onClick={handleChangeLang} ref={_lang}>
            <div className="lang-switcher__text lang_ru" data-lang='ru'>EN</div>
            <div className="lang-switcher__text lang_en" data-lang='en'>RU</div>
        </div>
    )
      
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(allActions.base, dispatch),
	}
	
})
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)