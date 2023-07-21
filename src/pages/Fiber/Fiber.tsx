import './fiber.scss'
import { NavLink, useNavigate, useParams  } from 'react-router-dom';
import { useEffect, useRef, useMemo,useCallback, FC } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { TLang, IFullState, IFiber, IFibersState, IColorsState, IColor } from "../../interfaces";
import { allActions } from "../../redux/actions/all";
import Modal, { IModalFunctions } from '../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../components/Message/Message';
import { navList, resetFetch, timeModalClosing } from '../../assets/js/consts';
import ErrorMock from '../../components/ErrorMock/ErrorMock';
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import Features from '../../components/Params/Params';
import Proscons from '../../components/Proscons/Proscons';
import IconEdit from '../../components/IconEdit/IconEdit';
import Delete from '../../components/Delete/Delete';
import ImageModal, { IImageModalFunctions } from '../../components/ImageModal/ImageModal';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { checkAndLoad, modalMessageCreator } from '../../assets/js/processors';

interface IPropsState {
    lang: TLang,
    fibersState: IFibersState
    colorsState: IColorsState
    isAdmin: boolean
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Fiber: FC<IProps> = ({lang, fibersState, colorsState, setState, isAdmin}):JSX.Element => {
    const paramFiberId = useParams().fiberId || ''
    const navigate = useNavigate()
    const modalMessageRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const modalImageRef = useRef<IModalFunctions>(null)
    const imageRef = useRef<IImageModalFunctions>(null)
    

    const onDelete = (item: IFiber) => { 
        setState.fibers.deleteFiber(item._id)
    }


    useEffect(() => {
        if (fibersState.send.status === 'success' || fibersState.send.status === 'error') {
            messageRef.current?.update(modalMessageCreator(fibersState.send, lang))
            modalMessageRef.current?.openModal()
        }
    }, [fibersState.send.status])


    const closeModalMessage = useCallback(() => {
        modalMessageRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        setState.fibers.setSendFibers(resetFetch)
        if (fibersState.send.status === 'success') {
            navigate(navList.fibers.to, { replace: true });
            window.location.reload()
        }
	}, [fibersState.send.status])


    const closeModalImage = useCallback(() => {
        modalImageRef.current?.closeModal()
        setTimeout(() => imageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
	}, [])

    
    const onImageClick = (e: React.MouseEvent , color: IColor) => {
        e.stopPropagation()
        imageRef.current?.update({url: color.url.full, text: color.name[lang]})
        modalImageRef.current?.openModal()
    }


    useEffect(() => {
        checkAndLoad(colorsState.load.status, setState.colors.loadColors)
    }, [])
    

    useEffect(() => {
        if (fibersState.load.status === 'success') {
            setState.fibers.setSelectedFiber(paramFiberId)
        }
    }, [paramFiberId, fibersState.load.status]) 


    const firberColors = useCallback((fiber: IFiber) => {
        return fiber.colors.map((color, i) => {
            const colorData: IColor | undefined = colorsState.colors.find(colorItem => colorItem._id === color)
            if (colorData) {
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
    }, [])


    const renderFiberItem = useMemo(() => {
        const fiber = fibersState.fibersList.find(item => item._id === fibersState.selected)  
        return fiber ? (
            <div className="fiber__item">
                <h2>{fiber.short.name[lang]} ({fiber.name[lang]})</h2>
                <div className='fiber__splider__container'>
                    <SpliderCommon images={fiber.images} defaultSize='small' imagesPerSlide={fiber.images.files?.length > 3 ? 3 : fiber.images.files?.length}/>
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
                            {isAdmin && 
                                <NavLink className="button_edit" to={`../..${navList.account.admin.fiber.to}/${fiber._id}`}>
                                    <IconEdit />
                                </NavLink>}
                            <NavLink
                                className="button_blue link_compareList"
                                to={navList.fibers.compare.to}>
                                    {lang === 'en' ? 'Watch in comparasing' : 'Посмотреть в сравнении'}
                            </NavLink>
                            {isAdmin && <Delete<IFiber> remove={onDelete} idInstance={fiber} lang={lang} disabled={fibersState.send.status === 'fetching'}/>}
                        </div>
                    </div>
                </div>
            </div>)
        :
            <ErrorMock lang={lang} comp={{en: 'fiber, fiber not found', ru: 'материала, данный материал не найден'}} />
    }, [paramFiberId, lang, fibersState.load.status, colorsState.load.status, fibersState.selected, isAdmin])




    return (
        <div className="page page_fiber">
            <div className="container_page">
                <div className="container">
                    {fibersState.load.status === 'success' && renderFiberItem}
                    {fibersState.load.status === 'fetching' && <Preloader />}
                    {fibersState.load.status === 'error' && <ErrorMock lang={lang} comp={{en: 'fiber', ru: 'материала'}}/>}
                </div>
            </div>
            <Modal escExit={true} ref={modalMessageRef} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
            </Modal>
            <Modal escExit={true} ref={modalImageRef} onClose={closeModalImage}>
				<ImageModal ref={imageRef} />
            </Modal>
            
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState  => ({
    lang: state.base.lang,
    fibersState: state.fibers,
    colorsState: state.colors,
    isAdmin: state.user.isAdmin
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Fiber)