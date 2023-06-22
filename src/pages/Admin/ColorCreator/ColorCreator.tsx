import { IFetch, IFullState, ISendColor, TLang } from 'src/interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';

interface IPropsState {
    lang: TLang
    send: IFetch
}

interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ColorCreator: FC<IProps> = ({lang, send, setState}): JSX.Element => {
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const addFileSmall = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    

    const closeModal = () => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (send.status === 'success') {
            setState.colors.loadColors() //reload colors if update db was succsessfull
        }
        setState.colors.setSendColors(resetFetch)// clear fetch status
	}

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_name_en.current || !_name_ru.current) return
        
        errChecker.check(_name_en.current, 2, 50)
        errChecker.check(_name_ru.current, 2, 50)
        
        if (!addFileBig.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmall.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (errChecker.result().length > 0) {
            message.current?.update({                        
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: [...errChecker.result()]
            })
            modal.current?.openModal()
            errChecker.clear()
            return
        }
        
        const color: ISendColor = {
            name: {
                en: _name_en.current.value.trim(),
                ru: _name_ru.current.value.trim(),
            },
            files: {
                full: addFileBig.current?.getFiles()[0] as File,
                small: addFileBig.current?.getFiles()[0] as File,
            }
        }
        
        setState.colors.sendColor(color)
    }


    useEffect(() => {
        if (!_name_en.current || !_name_ru.current) return
        if (send.status === 'success' || send.status === 'error') {
            const errors: string[] = send.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[send.status][lang],
                status: send.status,
                text: [send.message[lang], ...errors]
            })
            modal.current?.openModal()
            if (send.status === 'success') { //clear form if success
                _name_en.current.value = ''
                _name_ru.current.value = ''
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }
        }
    }, [send.status])


    const render = useMemo(() => (
        <div className="container">
            <h1>{lang === 'en' ? 'Add new color' : 'Добавление нового цвета'}</h1>
            <form>
                <div className="input-block_header">
                    <span></span>
                    <h3 className='lang'>EN</h3>
                    <h3 className='lang'>RU</h3>
                </div>
                <div className="input-block">
                    <label>{lang === 'en' ? 'Name' : 'Название'}:</label>
                    <div className="input__wrapper">
                        <input type="text" id="name_en" ref={_name_en} data-ru="Название EN" data-en="Name EN"/>
                    </div>
                    <div className="input__wrapper">
                        <input type="text" id="name_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"/>
                    </div>
                </div>
                <div className="input-block_header">
                    <span></span>
                    <h3 className='lang'>{lang === 'en' ? "FULLSIZE" : "ПОЛНОРАЗМЕР"}</h3>
                    <h3 className='lang'>{lang === 'en' ? "PREVIEW" : "ПРЕДПРОСМОТР"}</h3>
                </div>
                <div className="input-block">
                    <label>{lang === 'en' ? 'Image' : 'Картинка'}:</label>
                    <div className="input__wrapper">
                        <AddFiles lang={lang} ref={addFileBig} multiple={false} id='files_big'/>
                    </div>
                    <div className="input__wrapper">
                        <AddFiles lang={lang} ref={addFileSmall} multiple={false} id='files_small'/>
                    </div>
                </div>
                <button className='button_blue post' disabled={send.status === 'fetching'} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Add color' : "Добавить цвет"}</button>
            </form>
        </div>), [lang, send.status])


    return (
        <div className="page page_color-add">
            <div className="container_page">
                {render}
                <Modal escExit={true} ref={modal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
                </Modal>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    send: state.colors.send,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)