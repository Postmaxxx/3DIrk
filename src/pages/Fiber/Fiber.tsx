import './fiber.scss'
import { loadFibers }  from "../../redux/actions/fibers"
import { loadColors }  from "../../redux/actions/colors"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { TLang, IFullState, IFiber, IFibersState, IColorsState, IColor } from "../../interfaces";
import FiberItem from 'src/components/FiberItem/FiberItem';

const actionsListFibers = { loadFibers }
const actionsListColors = { loadColors }

interface IPropsState {
    lang: TLang,
    fibers: IFibersState
    colors: IColorsState
}

interface IPropsActions {
    setState: {
        fibers: typeof actionsListFibers
        colors: typeof actionsListColors
    }
}

interface IProps extends IPropsState, IPropsActions {}

const Fiber:React.FC<IProps> = ({lang, fibers, colors, setState}):JSX.Element => {
    const paramFiberId = useParams().fiberId || ''
    
    const [loaded, setLoaded] = useState<boolean>(false)
    const [fiber, setFiber] = useState<IFiber>()
    

    useEffect(() => {
        if (fibers.dataLoading.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
        if (colors.dataLoading.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
        if (colors.dataLoading.status === 'success' && fibers.dataLoading.status === 'success') {
            setLoaded(true)
            setFiber(fibers.fibersList.find(item => item.id === paramFiberId))
        }
    }, [colors.dataLoading?.status, fibers.dataLoading?.status, paramFiberId])
    

    return (
        <div className="page page_fiber">
            <div className="container_page">
                <div className="container">
                    {loaded && fiber ? 
                        <FiberItem {...{fiber}} lang={lang} colors={colors.colors} />
                    :
                        <Preloader />}
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibers: state.fibers,
    colors: state.colors
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(actionsListFibers, dispatch),
		colors: bindActionCreators(actionsListColors, dispatch)
	}
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)