import './fiber.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import Preloader from '../../components/Preloaders/Preloader';
import { TLang, IFullState, IFiber, IFibersState, IColorsState, IColor, IMessageModal } from "../../interfaces";
import FiberItem from '../../components/FiberItem/FiberItem';
import { allActions } from "../../redux/actions/all";
import Modal from 'src/components/Modal/Modal';
import MessageInfo from 'src/components/MessageInfo/MessageInfo';


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
    
    const [loaded, setLoaded] = useState<boolean>(false)
    const [fiber, setFiber] = useState<IFiber>()
    const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState<IMessageModal>({header: '', status: '', text: []})
    const navigate = useNavigate()

    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success') {
            setLoaded(true)
            const fiberFromShortEnName = fibersState.fibersList.find(item => item.short.name.en === paramFiberNameShortEn)
            setFiber(fiberFromShortEnName)
            setState.fibers.setSelectedFiber(fiberFromShortEnName?._id || '')
        }
    }, [colorsState.load.status, fibersState.load.status, paramFiberNameShortEn])
    


    const onDelete = (item: IFiber) => { 
        setState.fibers.deleteFiber(item._id)
    }



    useEffect(() => {
        if (fibersState.send.status === 'success' || fibersState.send.status === 'error') {
            const errors: string[] = fibersState.send.errors?.map(e => e[lang]) || []
            setMessage({
                header: fibersState.send.status === 'success' ? lang === 'en' ? 'Success' : 'Успех' : lang === 'en' ? 'Error' : 'Ошибка',
                status: fibersState.send.status,
                text: [fibersState.send.message[lang], ...errors]
            })
            setModal(true)
        }
    }, [fibersState.send.status])


    const closeModal = () => {
		setModal(false)
        if (fibersState.send.status === 'success') {
            setState.fibers.setSendFibers({status: 'idle', message: {en: '', ru: ''}})
            navigate('/fibers', { replace: true });
            window.location.reload()
        } else {
            setState.fibers.setSendFibers({status: 'idle', message: {en: '', ru: ''}})
        }
	}




    return (
        <div className="page page_fiber">
            <div className="container_page">
                <div className="container">
                    {loaded && fiber ? 
                        <FiberItem {...{fiber}} lang={lang} colors={colorsState.colors} isAdmin={isAdmin} onDelete={onDelete} />
                    :
                        <Preloader />}
                </div>
            </div>
            <Modal {...{visible: modal, close: closeModal, escExit: true}}>
                <MessageInfo {...{  
                        status: message.status,
                        header: message.header,
                        text: message.text, 
                        buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                        buttonAction: closeModal
                    }}/>
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