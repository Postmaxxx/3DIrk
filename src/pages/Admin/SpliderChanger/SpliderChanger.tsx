import { IFetch, IFullState, INewsItem, TLang } from 'src/interfaces';
import './splider-changer.scss'
import { FC, useRef, useMemo, useCallback, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { empty, headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from 'src/components/Preloaders/Preloader';

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
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)

    
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])


    const closeModalMessage = useCallback(() => {
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        errChecker.clear()
        if (send.status === 'success') {
            addFiles.current?.clearAttachedFiles()
            navigate('/', { replace: true });
            setState.content.setSendContent(resetFetch)// clear fetch status
        }
        setState.content.setSendContent(resetFetch)// clear fetch status
	}, [send.status, errChecker])


    useEffect(() => {
        if (send.status === 'idle' || send.status === 'fetching')  return
        const errors: string[] = send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[send.status][lang],
            status: send.status,
            text: [send.message[lang], ...errors]
        })
		modal_message.current?.openModal()
    }, [send.status])







    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current || !addFiles.current) return

        if (addFiles.current.getFiles().length < 5) {
            errChecker.add(lang === 'en' ? 'Should be at least 5 images' : 'Требуется не менее 5 изображений')
        }

        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal_message.current?.openModal()
            return
        }

        //if no errors
        setState.content.sendSplider(addFiles.current.getFiles())
    }



    return (
        <div className="page page_splider-change">
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
                <Modal escExit={true} ref={modal_message} onClose={closeModalMessage}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
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