import './fiber.scss'
import FiberItem from 'src/components/FiberItem/FiberItem';
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFiber, IDataLoading, IState, TLang } from "../../interfaces";
import { useEffect } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from 'src/components/Preloader/Preloader';

interface IProps {
    lang: TLang
    fibers: {
        dataLoading: IDataLoading
        list: Array<IFiber>
    }
    setState: typeof actions
}

const Fiber:React.FC<IProps> = (props) => {

    useEffect(() => {
        props.setState.loadDataFibers({lang: props.lang})
    }, [props.lang])


    return (
        <div className="container_page">
            <div className="container">
                <div className="fiber">
                    <h1>{props.lang === 'En' ? 'Materials using for 3D printing' : 'Материалы, используемые в печати'}</h1>
                    {props.fibers.dataLoading.status === 'success' ? (
                        <div className="fibers__container">
                            {props.fibers.list.map((fiber) => <FiberItem {...{fiber}} key={fiber.header}/>)}
                        </div>
                    ):
                    (
                        <Preloader />
                    )}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    fibers: state.fibers,
})
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)