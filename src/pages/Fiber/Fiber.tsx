import './fiber.scss'
import FiberItem from 'src/components/FiberItem/FiberItem';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState } from "../../interfaces";
import { useEffect } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from 'src/components/Preloader/Preloader';
import { loadFibers }  from "../../redux/actions/fibers"
import { fibersBlock } from 'src/assets/js/data';

const actionsList = { loadFibers }

interface IPropsState {
    lang: TLang,
    fibers: IFibersState
}

interface IPropsActions {
    setState: {
        fibers: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}

const Fiber:React.FC<IProps> = ({lang, fibers, setState}):JSX.Element => {
    console.log(fibers);
    
    useEffect(() => {
        if (fibers.dataLoading.status !== 'success') {
            setState.fibers.loadFibers()
        }
    }, [])


    return (
        <section className="fiber">
            <div className="container_page">
                <div className="container">
                    <div className="fiber">
                        <h1>{fibersBlock.header[lang]}</h1>
                        {fibers.dataLoading.status === 'success' ? (
                            <div className="fibers__container">
                                {fibers.fibersList.map((fiber, i) => <FiberItem {...{fiber}} lang={lang} key={i}/>)}
                            </div>
                        )
                        :
                            <Preloader />
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}


const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibers: state.fibers,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(actionsList, dispatch)
	}
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)