import { IFetch, IFullState, TLang } from '../../../interfaces';
import './content-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { headerStatus, navList, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import { errorsChecker, prevent } from '../../../assets/js/processors';
import { useNavigate } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';

interface IPropsState {
    lang: TLang
    send: IFetch
}


interface IPropsActions {
    setState: {
        content: typeof allActions.content
    }
}


interface IProps extends IPropsState, IPropsActions {}

const SpliderChanger: FC<IProps> = ({lang, send, setState}): JSX.Element => {
    const navigate = useNavigate()
    const addFiles = useRef<IAddFilesFunctions>(null)
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const closeModalMessage = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        errChecker.clear()
        if (send.status === 'success') {
            addFiles.current?.clearAttachedFiles()
            navigate(navList.home.to, { replace: true });
            setState.content.setSendContent(resetFetch)// clear fetch status
        }
        setState.content.setSendContent(resetFetch)// clear fetch status
	}, [send.status, errChecker])


    useEffect(() => {
        if (send.status === 'idle' || send.status === 'fetching')  return
        const errors: string[] = send.errors?.map(e => e[lang]) || []
        messageRef.current?.update({
            header: headerStatus[send.status][lang],
            status: send.status,
            text: [send.message[lang], ...errors]
        })
		modalRef.current?.openModal()
    }, [send.status])







    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current || !addFiles.current) return

        if (addFiles.current.getFiles().length < 5) {
            errChecker.add(lang === 'en' ? 'Should be at least 5 images' : 'Требуется не менее 5 изображений')
        }

        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal()
            return
        }
        //if no errors
        setState.content.sendSplider(addFiles.current.getFiles())
    }



    return (
        <div className="page page_creator_content">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change splider' : 'Изменение галереи'}</h1> 
                    <form ref={_form}>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                        <AddFiles lang={lang} ref={addFiles} multiple={true} id='allImages'/>
                        <button className='button_blue post' disabled={send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? 'Save splider' : "Сохранить галерею"}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modalRef} onClose={closeModalMessage}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
                </Modal>
            </div>

        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    send: state.content.send,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		content: bindActionCreators(allActions.content, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(SpliderChanger)