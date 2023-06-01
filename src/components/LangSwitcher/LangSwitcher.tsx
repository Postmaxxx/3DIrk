import "./langSwitcher.scss"
import { useEffect } from "react";
import { connect } from "react-redux";
import { IFullState, TLang, TTheme } from "../../interfaces";
import { setLangEn, setLangRu }  from "../../redux/actions/base"
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";


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

    const handleChangeLang = (e: React.MouseEvent<HTMLDivElement>) => {
        if (lang === 'en') {
            window.localStorage.setItem('language', 'ru')
            setState.base.setLangRu()
            e.currentTarget.classList.add('ru')
            e.currentTarget.classList.remove('en')
        } else {
            window.localStorage.setItem('language', 'en')
            setState.base.setLangEn();
            e.currentTarget.classList.add('en')
            e.currentTarget.classList.remove('ru')
        }
    }

    useEffect(() => {
        (window.localStorage.getItem('language') as TLang) === 'en' ? setState.base.setLangEn() : setState.base.setLangRu()
    }, [])


    return (
        <div className={`lang-switcher ${lang} ${mobOpened || "hide"}`} onClick={handleChangeLang}>
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