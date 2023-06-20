import { IFetch, IFullState, IMessageModal, ISendColor, TLang } from 'src/interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useState, useCallback, memo } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import MessageInfo from 'src/components/MessageInfo/MessageInfo';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import { resetFetch, clearModalMessage } from 'src/assets/js/consts';
import { modalCreator } from 'src/components/Modal/modalCreator';
import { messageCreator } from 'src/components/MessageInfo/messageCreator';
import ModalNew, { IModalFunctions } from 'src/components/Modal/ModalNew';

interface IPropsState {
    lang: TLang
    sendColor: IFetch
}

interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ColorCreator: FC<IProps> = ({lang, sendColor, setState}): JSX.Element => {

    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const addFileSmall = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)


    const closeModal = () => {
        modal.current?.closeModal()
        
        //message.update(clearModalMessage)
        if (sendColor.status === 'success') {
            setState.colors.loadColors()
        }
        setState.colors.setSendColors(resetFetch)// clear fetch status
	}

    const isErrors = useMemo(() => errorsChecker({lang, min:2, max: 50}), [lang])

    //const modal = modalCreator({onClose: closeModal})
    const message = messageCreator({buttonText: lang === 'en' ? 'Close' : "Закрыть", buttonAction: closeModal})
    
    const messageComp = message.create()
    //const modalComp = modal.create(messageComp)



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_name_en.current || !_name_ru.current || !modal.current) return
        
        isErrors.check(_name_en.current)
        isErrors.check(_name_ru.current)
        
        if (!addFileBig.current?.getFiles().length) {
            isErrors.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmall.current?.getFiles().length) {
            isErrors.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (isErrors.result().length > 0) {
            /*message.update({                        
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: [...isErrors.result()]
            })*/
            
            //modal.open()

            modal.current.openModal()
            
            return
            isErrors.clear()
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
        if (sendColor.status === 'success' || sendColor.status === 'error') {
            const errors: string[] = sendColor.errors?.map(e => e[lang]) || []
            /*message.update({                        
                header: sendColor.status === 'success' ? lang === 'en' ? 'Success' : 'Успех' : lang === 'en' ? 'Errors' : 'Ошибки',
                status: sendColor.status,
                text: [sendColor.message[lang], ...errors]
            })
            modal.open()
            if (sendColor.status === 'success') {
                _name_en.current.value = ''
                _name_ru.current.value = ''
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }*/
        }
    }, [sendColor.status])

    console.log('color rendered');
    
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
                    <label htmlFor="header_en">{lang === 'en' ? 'Name' : 'Название'}:</label>
                    <div className="input__wrapper">
                        <input type="text" id="header_en" ref={_name_en} data-ru="Название EN" data-en="Name EN"/>
                    </div>
                    <div className="input__wrapper">
                        <input type="text" id="header_ru" ref={_name_ru} data-ru="Название RU" data-en="Name RU"/>
                    </div>
                </div>
                <div className="input-block_header">
                    <span></span>
                    <h3 className='lang'>{lang === 'en' ? "FULLSIZE" : "ПОЛНОРАЗМЕР"}</h3>
                    <h3 className='lang'>{lang === 'en' ? "PREVIEW" : "ПРЕДПРОСМОТР"}</h3>
                </div>
                <div className="input-block">
                    <label htmlFor="url_big">{lang === 'en' ? 'Image' : 'Картинка'}:</label>
                    <div className="input__wrapper">
                        <AddFiles lang={lang} ref={addFileBig} multiple={false} id='big'/>
                    </div>
                    <div className="input__wrapper">
                        <AddFiles lang={lang} ref={addFileSmall} multiple={false} id='small'/>
                    </div>
                </div>
                <button className='button_blue post' disabled={false} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Add color' : "Добавить цвет"}</button>
            </form>
        </div>)
    , [lang])


    return (
        <div className="page page_color-add">
            <div className="container_page">
                {render}
                <ModalNew escExit={true} onClose={closeModal} ref={modal}>
                    {messageComp}
                </ModalNew>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    sendColor: state.colors.send,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)