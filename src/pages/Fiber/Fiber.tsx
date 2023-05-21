import './fiber.scss'
import FiberItem from 'src/components/FiberItem/FiberItem';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor } from "../../interfaces";
import { useEffect, useState } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from 'src/components/Preloaders/Preloader';
import { loadFibers }  from "../../redux/actions/fibers"
import { loadColors }  from "../../redux/actions/colors"

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
    const [loaded, setLoaded] = useState<boolean>(false)

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
        }
    }, [colors.dataLoading?.status, fibers.dataLoading?.status])


    return (
        <section className="fiber">
            <div className="container_page">
                <div className="container">
                    <div className="fiber">
                        <h1>{lang === 'en' ? 'Materials using for 3D printing' : 'Материалы, используемые в печати'}</h1>
                        {loaded  ? (
                            <div className="fibers__container">
                                {fibers.fibersList.map((fiber, i) => {
                                    return <FiberItem {...{fiber}} lang={lang} colors={colors.colors} key={i}/>})}
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
    colors: state.colors
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(actionsListFibers, dispatch),
		colors: bindActionCreators(actionsListColors, dispatch)
	}
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)