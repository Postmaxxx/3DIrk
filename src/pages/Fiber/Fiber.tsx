import './fiber.scss'
import FiberItem from 'src/components/FiberItem/FiberItem';
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IDataLoading, IState, TLang, IFibersBlock } from "../../interfaces";
import { useEffect } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from 'src/components/Preloader/Preloader';

interface IProps {
    lang: TLang
    fibersBlock: IFibersBlock
    setState: typeof actions
}

const Fiber:React.FC<IProps> = ({lang, fibersBlock, setState} : IProps) => {

    useEffect(() => {
        //setState.loadDataFibers2({lang: lang})
        setState.loadDataFibers()
    }, [lang])


    return (
        <section className="fiber">
            <div className="container_page">
                <div className="container">
                    <div className="fiber">
                        <h1>{fibersBlock.header[lang]}</h1>
                        {fibersBlock.dataLoading.status === 'success' ? (
                            <div className="fibers__container">
                                {fibersBlock.fibersList.map((fiber, i) => <FiberItem {...{fiber}} lang={lang} key={i}/>)}
                            </div>
                        ):
                        (
                            <Preloader />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    fibersBlock: state.components.fibersBlock,
})
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)