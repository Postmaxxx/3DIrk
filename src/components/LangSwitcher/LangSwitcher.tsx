import "./langSwitcher.scss"
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { IFullState, TLang, TTheme } from "../../interfaces";
import { setLangEn, setLangRu }  from "../../redux/actions/base"
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useScrollHider } from "src/hooks/scrollHider";


const actionsList = {setLangEn, setLangRu}


interface IPropsState {
    lang: TLang
	mobOpened: boolean
}

interface IPropsActions {
	setState: {
		base: typeof actionsList
	}
}

interface IProps extends IPropsState, IPropsActions {}


const LangSwitcher:React.FC<IProps> = ({lang, mobOpened, setState}): JSX.Element => {

    const _lang = useRef<HTMLDivElement>(null)
    const langHider = useScrollHider()   

    const handleChangeLang = (e: React.MouseEvent<HTMLDivElement>) => {
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
        langHider.add(_lang.current, 50)

		return () => langHider.remove()
    }, [])



    useEffect(() => {
        if (lang === 'en') {
            _lang.current?.classList.add('ru')
            _lang.current?.classList.remove('en')
        } else {
            _lang.current?.classList.add('en')
            _lang.current?.classList.remove('ru')
        }

        mobOpened ? _lang.current?.classList.remove('hide') : _lang.current?.classList.add('hide')
    }, [lang, mobOpened])


    return (
        <div className='lang-switcher' onClick={handleChangeLang} ref={_lang}>
            <div className="lang-switcher__text lang_ru" data-lang='ru'>RU</div>
            <div className="lang-switcher__text lang_en" data-lang='en'>EN</div>
        </div>
    )   
}




const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(actionsList, dispatch)
	}
	
})
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)