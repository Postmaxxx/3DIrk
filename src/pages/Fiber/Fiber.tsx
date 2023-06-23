import './fiber.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { TLang, IFullState, IFiber, IFibersState, IColorsState } from "../../interfaces";
import FiberItem from '../../components/FiberItem/FiberItem';
import { allActions } from "../../redux/actions/all";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import ErrorMock from 'src/components/tiny/ErrorMock/ErrorMock';


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


const Fiber:React.FC<IProps> = ({lang, fibersState, colorsState, setState, isAdmin}):JSX.Element => {
    const paramFiberNameShortEn = useParams().fiberId || ''
    const navigate = useNavigate()
    
    const [loaded, setLoaded] = useState<boolean>(false)
    const [fiber, setFiber] = useState<IFiber>()
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)


    useEffect(() => {
        /*if (colorsState.load.status === 'success' && fibersState.load.status === 'success') {
            setLoaded(true)
            const fiberFromShortEnName = fibersState.fibersList.find(item => item.short.name.en === paramFiberNameShortEn)
            setFiber(fiberFromShortEnName)
            setState.fibers.setSelectedFiber(fiberFromShortEnName?._id || '')
        }*/
        if (fibersState.load.status === 'success') {
            const fiberId = fibersState.fibersList.find(item => item.short.name.en === paramFiberNameShortEn)
        }
    }, [fibersState.load.status, paramFiberNameShortEn])
    


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
            modal.current?.openModal()
        }
    }, [fibersState.send.status])


    const closeModal = () => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (fibersState.send.status === 'success') {
            setState.fibers.setSendFibers(resetFetch)
            navigate('/fibers', { replace: true });
            window.location.reload()
        } else {
            setState.fibers.setSendFibers(resetFetch)
        }
	}

    useEffect(() => {
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }
    }, [])



    return (
        <div className="page page_fiber">
            <div className="container_page">
                <div className="container">
                    {fibersState.load.status === 'success' && <FiberItem {...{fiber}} lang={lang} colors={colorsState.colors} isAdmin={isAdmin} onDelete={onDelete} />}
                    {fibersState.load.status === 'fetching' && <Preloader />}
                    {fibersState.load.status === 'error' && <ErrorMock lang={lang} comp={{en: 'fiber', ru: 'материала'}} />}

                </div>
            </div>
            <Modal escExit={true} ref={modal} onClose={closeModal}>
                <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
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