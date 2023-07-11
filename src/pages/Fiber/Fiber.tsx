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
import { headerStatus, resetFetch, timeModalClosing } from '../../assets/js/consts';
import ErrorMock from '../../components/tiny/ErrorMock/ErrorMock';
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import Features from '../../components/Features/Params';
import Proscons from '../../components/Proscons/Proscons';
import IconEdit from '../../components/tiny/IconEdit/IconEdit';
import Delete from '../../components/Delete/Delete';
import ImageModal, { IImageModalFunctions } from '../../components/ImageModal/ImageModal';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader';
import { checkAndLoad } from '../../assets/js/processors';


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
    //const paramFiberNameShortEn = useParams().fiberName || ''
    const paramFiberId = useParams().fiberId || ''
    const navigate = useNavigate()
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const modal_image = useRef<IModalFunctions>(null)
    const image = useRef<IImageModalFunctions>(null)
    

    const onDelete = (item: IFiber) => { 
        setState.fibers.deleteFiber(item._id)
    }


    useEffect(() => {
        if (fibersState.send.status === 'success' || fibersState.send.status === 'error') {
            const errors: string[] = fibersState.send.errors?.map(e => e[lang]) || []
            message.current?.update({
                header: headerStatus[fibersState.send.status][lang],
                status: fibersState.send.status,
                text: [fibersState.send.message[lang], ...errors]
            })
            modal_message.current?.openModal()
        }
    }, [fibersState.send.status])


    const closeModalMessage = useCallback(() => {
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (fibersState.send.status === 'success') {
            setState.fibers.setSendFibers(resetFetch)
            navigate('/fibers', { replace: true });
            window.location.reload()
        } else {
            setState.fibers.setSendFibers(resetFetch)
        }
	}, [fibersState.send.status])


    const closeModalImage = useCallback(() => {
        modal_image.current?.closeModal()
        setTimeout(() => image.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
	}, [])

    

    const onImageClick = (e: React.MouseEvent , color: IColor) => {
        e.stopPropagation()
        image.current?.update({url: color.url.full, text: color.name[lang]})
        modal_image.current?.openModal()
    }



    useEffect(() => {
       /*if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }*/
        checkAndLoad(colorsState.load.status, setState.colors.loadColors)
    }, [])
    

    useEffect(() => {
        if (fibersState.load.status === 'success') {
            setState.fibers.setSelectedFiber(paramFiberId)
        }
    }, [paramFiberId, fibersState.load.status])


    const renderFiberItem = useMemo(() => {
        const fiber = fibersState.fibersList.find(item => item._id === fibersState.selected)  
        return fiber ? (
            <div className="fiber__item">
            <h2>{fiber.short.name[lang]} ({fiber.name[lang]})</h2>
            <div className='fiber__splider__container'>
                <SpliderCommon images={fiber.images} defaultSize='medium' imagesPerSlide={fiber.images.files?.length > 3 ? 3 : fiber.images.files?.length}/>
            </div>
            <div className="fiber__descr__container">
                <div className="block_text">
                    {fiber.text[lang].split('\n').map((textItem, i) => <p key={i}>{textItem}</p>)}
                    <div className="features__container">
                        <h3>{lang === 'en' ? 'Features' : 'Характеристики'}</h3>
                        <Features params={fiber.params} fiber={fiber} lang={lang}/>
                    </div>
                    <div className="colors">
                        <h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
                        <div className="colors__container">
                            {fiber.colors.map((color, i) => {
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
                            })}
                        </div>
                    </div>
                    <div className="proscons">
                        <h3>{lang === 'en' ? 'Pros and сons' : 'Плюсы и минусы'}</h3>
                        <Proscons {...fiber.proscons} lang={lang}/>
                    </div>
                    
                    <div className="buttons">
                        {isAdmin && 
                            <NavLink className="button_edit" to={`../../admin/fiber-create/${fiber._id}`}>
                                <IconEdit />
                            </NavLink>}
                        <NavLink
                            className="button_blue link_compareList"
                            to="/fibers/compare">
                                {lang === 'en' ? 'Watch in comparasing' : 'Посмотреть в сравнении'}
                        </NavLink>
                        {isAdmin && <Delete<IFiber> remove={onDelete} idInstance={fiber} lang={lang} disabled={fibersState.send.status === 'fetching'}/>}
                    </div>
                </div>
            </div>
        </div>
        )
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
            <Modal escExit={true} ref={modal_message} onClose={closeModalMessage}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
            </Modal>
            <Modal escExit={true} ref={modal_image} onClose={closeModalImage}>
				<ImageModal ref={image} />
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