import './fibers.scss'
import FiberItem from 'src/components/FiberItem/FiberItem';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor } from "../../interfaces";
import { useEffect, useState } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from 'src/components/Preloaders/Preloader';
import { loadFibers }  from "../../redux/actions/fibers"
import { loadColors }  from "../../redux/actions/colors"
import { useParams } from 'react-router-dom';

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

const Fibers:React.FC<IProps> = ({lang, fibers, colors, setState}):JSX.Element => {
    const paramFiberId = useParams().fiberId || ''    
    

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

    useEffect(() => {
        if (!loaded || !paramFiberId) return
        const fiberToScroll = Array.from(document.querySelectorAll('[data-fiberid]')).find((_fiber) => (_fiber as HTMLElement).dataset.fiberid === paramFiberId)
        if (!fiberToScroll) return
        const offset = 100;
        const targetScrollPosition = fiberToScroll.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }, [loaded])


    return (
        <div className="page page_fibers">
            <div className="container_page">
                <div className="container">
                    <div className="fiber">
                        <h1>{lang === 'en' ? 'Materials using for 3D printing' : 'Материалы, используемые в печати'}</h1>
                        {lang === 'en' ? 
                        <div className="block_text">

                        </div>
                        : 
                        <div className="block_text">
                            <p>В современной 3D печати используется множество различных материалов, позволяющих получить продукт с различными свойствами для разных условий эксплуатации. Отличаться будут как физическте характеристики печатаемого образца, так и его стоимость, вот почему так важно правильно выбрать материал для печати. </p>
                            <p>Наша кампания предлагае Вам широкий выбор материалов для печати для самых различных видов продукции. Ниже представлены материалы, из которых на данный момент мы предлагаем вам изготовить желаемую продукцию. Также мы предлагаем Вам ознакомиться со списком терминов, используемых в описании к материалам, для бьолее комфортного и полного понимания особенностей материалов.</p> 
                            <p><b>Прочность:</b> удельная нагрузка, которую может воспринять деталь без разрушения.</p>
                            <p><b>Спекаемость:</b> относительный показатель, характеризующий силу склеивания слоёв детали между собой.</p>
                            <p><b>Жёсткость:</b>  способность детали противостоять деформации, противоположность гибкости (прочность и жёсткость не одно и то же, деталь может быть гибкой и выдерживать большие нагрузки до разрушения).</p>
                            <p><b>Усадка:</b> величина, на которую уменьшаются линейные размеры детали при остывании, чем выше усадка, тем больше времени требуется на печать детали, в следствие снижения скорости.</p>
                            <p><b>Cпекание:</b> сила склеивания линий и слоёв материала между собой, чем выше эта величина, тем ближе прочность печатной детали к прочности литого изделия.</p>

                        </div>}
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
    
export default connect(mapStateToProps, mapDispatchToProps)(Fibers)