import { IContentState, IFetch, IFullState, TLang } from '../../../interfaces';
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
import { checkAndLoad, errorsChecker, filesDownloader, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { useNavigate } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';

interface IPropsState {
    lang: TLang
    content: IContentState
}


interface IPropsActions {
    setState: {
        content: typeof allActions.content
    }
}


interface IProps extends IPropsState, IPropsActions {}

const SpliderChanger: FC<IProps> = ({lang, content, setState}): JSX.Element => {
    const navigate = useNavigate()
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])



    const closeModalMessage = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        errChecker.clear()
        if (content.send.status === 'success') {
            addFilesRef.current?.clearAttachedFiles()
            navigate(navList.home.to, { replace: true });
            setState.content.setSendContent(resetFetch)// clear fetch status
        }
        setState.content.setSendContent(resetFetch)// clear fetch status
	}, [content.send.status, errChecker])




    useEffect(() => {
        if (content.send.status === 'idle' || content.send.status === 'fetching')  return
        messageRef.current?.update(modalMessageCreator(content.send, lang))
		modalRef.current?.openModal('sender')
    }, [content.send.status])


    const fillValues = async () => {
        const files = await filesDownloader(
            content.splider.files.map(file => (`${content.splider.paths.full}/${file}`))
        )
        addFilesRef.current?.replaceFiles(files)
    }

    useEffect(() => {
        checkAndLoad({
			fetchData: content.load,
			loadFunc: setState.content.loadSplider,
            force: false
		})
    }, [])


    useEffect(() => {
        fillValues()
    }, [content.load])



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current || !addFilesRef.current) return

        if (addFilesRef.current.getFiles().length < 5) {
            errChecker.add(lang === 'en' ? 'Should be at least 5 images' : 'Требуется не менее 5 изображений')
        }

        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal()
            return
        }
        //if no errors
        setState.content.sendSplider(addFilesRef.current.getFiles())
    }



    return (
        <div className="page page_creator_content">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Change splider' : 'Изменение галереи'}</h1> 
                    <form ref={_form}>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
                        <button className='button_blue post' disabled={content.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {content.send.status === 'fetching' ? 
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
    content: state.content
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		content: bindActionCreators(allActions.content, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(SpliderChanger)