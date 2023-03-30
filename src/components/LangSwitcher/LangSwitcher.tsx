import "./langSwitcher.scss"
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IState, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";

interface IProps {
    lang: TLang
    setState: typeof actions
}

const LangSwitcher:React.FC<IProps> = (props) => {

    const handleChange= () => {
        props.lang === 'En' ? props.setState.setLangRu() : props.setState.setLangEn();
        
    }


    return (
        <div className="lang-switcher">
            <label aria-label='switch the site language'>
                <input type="checkbox" onClick={handleChange}/>
            </label>
        </div>
        )
}



const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(LangSwitcher)