import { IColorsState, IFullState, ISendColor, TLang } from '../../../interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback, useState} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { checkAndLoad, errorsChecker, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { colorEmpty, empty, inputsProps, navList, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';
import inputChecker from '../../../../src/assets/js/inputChecker';

interface IPropsState {
    lang: TLang
    colorsState: IColorsState
}

interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ColorCreator: FC<IProps> = ({lang, colorsState, setState}): JSX.Element => {
    const paramColorId = useParams().colorId || ''
    const navigate = useNavigate()
    const _form = useRef<HTMLFormElement>(null)
    const addFileBigRef = useRef<IAddFilesFunctions>(null)
    const addFileSmallRef = useRef<IAddFilesFunctions>(null)
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const [color, setColor] = useState<ISendColor>({...colorEmpty})
    const [submit, setSubmit] = useState<boolean>(false)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const processedContainer = '[data-selector="form-color"]'

    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const focuser = useMemo(() => focusMover(), [lang])


    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (modalRef.current?.getOwner() === 'sender') {
            if (colorsState.send.status === 'success') {
                setState.colors.loadColors() //reload colors if update db was succsessfull
                if (paramColorId) { //return to home pahe
                    navigate(navList.home.to, { replace: true });
                }
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
        if (modalRef.current?.getOwner() === 'filler') {
            navigate(navList.home.to, { replace: true });
        }
	}, [colorsState.send.status, paramColorId])




    useEffect(() => { 
        if (paramColorId && colorsState.load.status === 'success') {//if edit
            setChangeImages(false)
            fillColor(paramColorId)
        } 
    }, [paramColorId, colorsState.load.status])



    useEffect(() => {
        checkAndLoad(colorsState.load.status, setState.colors.loadColors)
    }, [colorsState.load.status])



    const fillColor = (_id: string) => {
        const color = colorsState.colors.find(color => color._id === _id)
        if (!color) {
            messageRef.current?.update({
                header: 'Error',
                status: 'error',
                text: [lang === 'en' ? "Color was not found" : "Цвет не найден"]
            })
            modalRef.current?.openModal('filler')
            return
        }
        setColor(prev => ({...prev, name: {...color.name}}))
    }


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        errChecker.clear()
        prevent(e)
        if (!_form.current) return
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = document.querySelector(processedContainer)?.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        }       
        if (!addFileBigRef.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmallRef.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal("errorChecker")
            return
        }
        
        setColor(prev => ({
            ...prev, 
            _id: paramColorId,
            files: {
                full: addFileBigRef.current?.getFiles()[0] as File,
                thumb: addFileSmallRef.current?.getFiles()[0] as File,
            }
        }))
        setSubmit(true)
    }


    useEffect(() => { //we need to wait until state will be fully updated before submiting
        if (!submit) return
        paramColorId ? setState.colors.editColor(color) : setState.colors.sendColor(color)
        setSubmit(false)
    }, [submit])



    useEffect(() => {
        if (colorsState.send.status === 'success' || colorsState.send.status === 'error') {
            messageRef.current?.update(modalMessageCreator(colorsState.send, lang))
            modalRef.current?.openModal("sender")
            if (colorsState.send.status === 'success') { //clear form if success
                setColor(prev => ({...prev, name: {...empty}, _id: ''}))
                addFileBigRef.current?.clearAttachedFiles()
                addFileSmallRef.current?.clearAttachedFiles()
            }
        }
    }, [colorsState.send.status])



    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }


    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
        errChecker.clearError(e.target) 
        e.target.id === "name_en" && setColor(prev => ({...prev, name: {...prev.name, en: e.target.value}}))
        e.target.id === "name_ru" && setColor(prev => ({...prev, name: {...prev.name, ru: e.target.value}}))
    }



    useEffect(() => {       
        focuser.create({container: processedContainer})
    }, [lang])



    return (
        <div className="page page_creator_color">
            <div className="container_page">
                <div className="container">
                {paramColorId ? 
                <h1>{lang === 'en' ? 'Edit color' : 'Изменение цвета'}</h1>
                :
                <h1>{lang === 'en' ? 'Add new color' : 'Добавление нового цвета'}</h1>}
                    <form ref={_form} data-selector='form-color'>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Name' : 'Название'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    data-selector="input"
                                    id="name_en" 
                                    onChange={onChangeInputs} 
                                    value={color.name.en} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    data-selector="input"
                                    id="name_ru" 
                                    onChange={onChangeInputs}
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={color.name.ru} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
                            </div>
                        </div>
                            {changeImages &&
                                <>
                                    <div className="input-block_header">
                                        <span></span>
                                        <h3 className='lang'>{lang === 'en' ? "FULLSIZE" : "ПОЛНОРАЗМЕР"}</h3>
                                        <h3 className='lang'>{lang === 'en' ? "PREVIEW" : "ПРЕДПРОСМОТР"}</h3>
                                    </div>
                                    <div className="input-block">
                                        <label>{lang === 'en' ? 'Image' : 'Картинка'}:</label>
                                        <div className="input__wrapper">
                                            <AddFiles lang={lang} ref={addFileBigRef} multiple={false} id='files_big'/>
                                        </div>
                                        <div className="input__wrapper">
                                            <AddFiles lang={lang} ref={addFileSmallRef} multiple={false} id='files_small'/>
                                        </div>
                                    </div>
                                </>}
                        {paramColorId && <button className='button_blue change-images' onClick={onChangeImages}>{changeImages ? 'Do not change images' : 'Change all images'}</button>}
                        <button 
                            className='button_blue button_post' 
                            disabled={colorsState.send.status === 'fetching'} 
                            onClick={onSubmit}>
                            {colorsState.send.status === 'fetching' ?
                                <Preloader />
                            :
                                paramColorId ? lang === 'en' ? 'Edit color' : "Изменить цвет" : lang === 'en' ? 'Add color' : "Добавить цвет"
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modalRef} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={messageRef}/>
                </Modal>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    colorsState: state.colors,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)