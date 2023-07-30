import './fiber.scss'
import { NavLink, useNavigate, useParams  } from 'react-router-dom';
import { useEffect, useMemo,useCallback, FC } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { TLang, IFullState, IFiber, IFibersState, IColorsState, IColor } from "../../interfaces";
import { allActions } from "../../redux/actions/all";
import { navList, resetFetch } from '../../assets/js/consts';
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import Features from '../../components/Params/Params';
import Proscons from '../../components/Proscons/Proscons';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { checkAndLoad, modalMessageCreator } from '../../assets/js/processors';
import ErrorFetch from '../../components/ErrorFetch/ErrorFetch';
import { IModalFunctions } from '../../../src/components/Modal/ModalNew';
import MessageNew from '../../../src/components/Message/MessageNew';
import ImageModalNew from '../../../src/components/ImageModal/ImageModalNew';

interface IPropsState {
    lang: TLang,
    fibersState: IFibersState
    colorsState: IColorsState
    isAdmin: boolean
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Fiber: FC<IProps> = ({lang, fibersState, colorsState, setState, modal, isAdmin}):JSX.Element => {
    const paramFiberId = useParams().fiberId || ''
    const navigate = useNavigate()
    

    useEffect(() => {
        if (modal?.getName() === 'fiberSend') {
            if (fibersState.send.status === 'success' || fibersState.send.status === 'error') {
                modal?.openModal({ //if error/success - show modal about send order
                    name: 'fiberSend',
                    onClose: closeModal,
                    children: <MessageNew {...modalMessageCreator(fibersState.send, lang)} buttonClose={{action: closeModal, text: 'Close'}}/>
                })
            }
            setState.fibers.setSendFibers(resetFetch)// clear fetch status
        }
    }, [fibersState.send.status])


    const closeModal = useCallback(() => {
        if (modal?.getName() === 'fiberSend') {
            setState.fibers.setSendFibers(resetFetch)
            if (fibersState.send.status === 'success') {
                navigate(navList.fibers.to, { replace: true });
                window.location.reload()
            }
        }
        modal?.closeCurrent()
	}, [fibersState.send.status])


    
    const onImageClick = (e: React.MouseEvent , color: IColor) => {
        e.stopPropagation()
        modal?.openModal({
            name: 'onFiberImageClick',
            children: <ImageModalNew url={color.url.full}/>
        })
    }


    useEffect(() => {
        checkAndLoad({
			fetchData: colorsState.load,
			loadFunc:  setState.colors.loadColors,
		})
    }, [])
    

    useEffect(() => {
        if (fibersState.load.status === 'success') {
            setState.fibers.setSelectedFiber(paramFiberId)
        }
    }, [paramFiberId, fibersState.load.status]) 


    const firberColors = useCallback((fiber: IFiber) => {
        return fiber.colors.map((color, i) => {
            const colorData: IColor | undefined = colorsState.colors.find(colorItem => colorItem._id === color)
            if (colorData && colorData.active) {
                return (
                    <div key={i} className='color__container' onClick={(e) => onImageClick(e, colorData)}>
                        <div className="img-container">
                            <ImgWithPreloader src={colorData.url.thumb} alt={colorData.name[lang]}/>
                        </div>
                        <span className='color__descr'>{colorData.name[lang]}</span>
                    </div>
                )
            }
        })
    }, [colorsState.colors])


    const renderFiberItem = useMemo(() => {
        const fiber = fibersState.fibersList.find(item => item._id === fibersState.selected)  
        return fiber ? (
            <div className="fiber__item">
                <h2>{fiber.short.name[lang]} ({fiber.name[lang]})</h2>
                <div className='fiber__splider__container'>
                    <SpliderCommon images={fiber.images} defaultSize='small' imagesPerSlide={fiber.images.files?.length > 3 ? 3 : fiber.images.files?.length} modal={modal}/>
                </div>
                <div className="fiber__descr__container">
                    <div className="block_text">
                        {fiber.text[lang].split('\n').map((textItem, i) => <p key={textItem}>{textItem}</p>)}
                        <div className="features__container">
                            <h3>{lang === 'en' ? 'Features' : 'Характеристики'}</h3>
                            <Features params={fiber.params} fiber={fiber} lang={lang}/>
                        </div>
                        <div className="colors">
                            <h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
                            <div className="colors__container">
                                {firberColors(fiber)}
                            </div>
                        </div>
                        <div className="proscons">
                            <h3>{lang === 'en' ? 'Pros and сons' : 'Плюсы и минусы'}</h3>
                            <Proscons {...fiber.proscons} lang={lang}/>
                        </div>
                        
                        <div className="buttons">
                            <NavLink
                                className="button_blue link_compareList"
                                to={navList.fibers.compare.to}>
                                    {lang === 'en' ? 'Watch in comparasing' : 'Посмотреть в сравнении'}
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>)
        :
            <ErrorFetch lang={lang} fetchData={{status: 'error', message: {en: 'Fiber not found', ru: 'Данный материал не найден'}}} />
    }, [paramFiberId, lang, fibersState.load.status, colorsState.load.status, fibersState.selected, isAdmin])




    return (
        <div className="page page_fiber">
            <div className="container_page">
                <div className="container">
                    {fibersState.load.status === 'success' && renderFiberItem}
                    {fibersState.load.status === 'fetching' && <Preloader />}
                    {fibersState.load.status === 'error' && <ErrorFetch fetchData={fibersState.load} lang={lang} />}
                </div>
            </div>           
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibersState: state.fibers,
    colorsState: state.colors,
    isAdmin: state.user.isAdmin,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)