import './fiber.scss'
import siteLogo from "../../assets/img/logo.png"
import FiberItem from 'src/components/FiberItem/FiberItem';
import * as actions from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFiber, IDataLoading, IState, TLang } from "../../interfaces";
import { useEffect } from 'react';


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
        //props.setState.loadDataFibers({lang: 'En'})
    }, [props.fibers.dataLoading.status])


    return (
        <div className="container_page">
            <div className="container">
                <div className="fiber">
                    <h1>Материалы, используемые в печати</h1>
                    {props.fibers.dataLoading.status === 'success' && (
                        <div className="fibers__container">
                            {props.fibers.list.map((fiber) => <FiberItem {...{fiber}} key={fiber.header}/>)}
                        </div>
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
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)