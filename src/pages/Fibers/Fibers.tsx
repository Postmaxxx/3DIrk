import './fibers.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TLang, IFullState, IFibersState, IColorsState, IColor } from "../../interfaces";
import { useEffect, useState } from 'react';
import "@splidejs/react-splide/css";    
import Preloader from '../../components/Preloaders/Preloader';
import { NavLink, useParams } from 'react-router-dom';
import FiberPreview from '../../components/FiberPreview/FiberPreview';
import { allActions } from "../../redux/actions/all";


interface IPropsState {
    lang: TLang,
    fibers: IFibersState
    colors: IColorsState
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}

const Fibers:React.FC<IProps> = ({lang, fibers, colors, setState}):JSX.Element => {
    const paramFiberId = useParams().fiberId || ''    
    
    const [loaded, setLoaded] = useState<boolean>(false)

    
    useEffect(() => {
        if (fibers.load.status === 'idle') {
            setState.fibers.loadFibers()
            setLoaded(false)
        }
        if (colors.load.status === 'idle') {
            setState.colors.loadColors()
            setLoaded(false)
        }
        if (colors.load.status === 'success' && fibers.load.status === 'success') {
            setLoaded(true)
        }
    }, [colors.load.status, fibers.load.status])


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
                    <h1>{lang === 'en' ? 'Materials using for 3D printing' : 'Материалы, используемые в печати'}</h1>
                    {lang === 'en' ? 
                    <div className="block_text">
                        <p>In modern 3D printing, a variety of different materials are used to obtain products with different properties for various operating conditions. The physical characteristics of the printed object as well as its cost will differ, which is why it is crucial to choose the right material for printing.</p>
                        <p>Our company offers you a wide selection of printing materials for various types of products. Below are the materials we currently offer for manufacturing your desired products. We also invite you to familiarize yourself with the list of terms used to describe the materials for a more comfortable and comprehensive understanding of their features.</p> 
                        <p><b>Strength:</b> the specific load that a part can withstand without breaking.</p>
                        <p><b>Printability:</b> a relative indicator that characterizes the bonding strength between layers of the part.</p>
                        <p><b>Stiffness:</b> the ability of a part to resist deformation, the opposite of flexibility (strength and stiffness are not the same, a part can be flexible and withstand high loads before breaking).</p>
                        <p><b>Shrinkage:</b> the amount by which the linear dimensions of a part decrease during cooling. The higher the shrinkage, the more time is required for printing the part due to reduced speed.</p>
                        <p><b>Adhesion:</b> the bonding strength between lines and layers of the material. The higher this value, the closer the strength of the printed part is to that of a molded product.</p>
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
                                return (
                                    <NavLink to={`../../fibers/${fiber.id}`} aria-label={lang === 'en' ? '(About fiber)' : ' (О материале)'} key={fiber.id}>
                                        <FiberPreview {...{fiber}} lang={lang} colors={colors.colors} key={i}/>  
                                    </NavLink>
                                )})}
                        </div>
                    )
                    :
                        <Preloader />
                    }
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
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})

  
    
export default connect(mapStateToProps, mapDispatchToProps)(Fibers)