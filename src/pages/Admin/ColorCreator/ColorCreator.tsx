import { IColor, IColorsState, IFetch, IFullState, ISendColor, TLang } from 'src/interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback, useState} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { checkAndLoad, errorsChecker, prevent } from 'src/assets/js/processors';
import { colorEmpty, empty, headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from 'src/components/Preloaders/Preloader';

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
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const addFileSmall = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const [color, setColor] = useState<ISendColor>({...colorEmpty})
    const [submit, setSubmit] = useState<boolean>(false)
    const [changeImages, setChangeImages] = useState<boolean>(true)



    const closeModal = useCallback(() => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (colorsState.send.status === 'success') {
            setState.colors.loadColors() //reload colors if update db was succsessfull
            if (paramColorId) {
                navigate('/', { replace: true });
            }
        }
        setState.colors.setSendColors(resetFetch)// clear fetch status
	}, [colorsState.send.status, paramColorId])




    useEffect(() => { 
        if (paramColorId && colorsState.load.status === 'success') {//if edit
            setChangeImages(false)
            fillColor(paramColorId)
        } 
    }, [paramColorId, colorsState.load.status])



    useEffect(() => {
        /*if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }*/
        checkAndLoad(colorsState.load.status, setState.colors.loadColors)

    }, [colorsState.load.status])





    const fillColor = (_id: string) => {
        const color = colorsState.colors.find(color => color._id === _id)
        if (!color) return alert('color not found')
        setColor(prev => ({...prev, name: {...color.name}}))
    }



    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        errChecker.clear()
        prevent(e)
        if (!_form.current) return
        errChecker.check(_form.current.querySelector('#name_en') as HTMLInputElement, 2, 50)
        errChecker.check(_form.current.querySelector('#name_en') as HTMLInputElement, 2, 50)
        
        if (!addFileBig.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmall.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal()
            return
        }
        

        setColor(prev => ({
            ...prev, 
            _id: paramColorId,
            files: {
                full: addFileBig.current?.getFiles()[0] as File,
                thumb: addFileSmall.current?.getFiles()[0] as File,
            }
        }))
        
        setSubmit(true)
    }


    useEffect(() => {
        if (!submit) return
        if (paramColorId) {
            setState.colors.editColor(color)
        } else {
            setState.colors.sendColor(color)
        }  
        setSubmit(false)
    }, [submit])




    useEffect(() => {
        if (colorsState.send.status === 'success' || colorsState.send.status === 'error') {
            const errors: string[] = colorsState.send.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[colorsState.send.status][lang],
                status: colorsState.send.status,
                text: [colorsState.send.message[lang], ...errors]
            })
            modal.current?.openModal()
            if (colorsState.send.status === 'success') { //clear form if success
                setColor(prev => ({...prev, name: {...empty}, _id: ''}))
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }
        }
    }, [colorsState.send.status])




    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }


    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        errChecker.clearError(e.target) 
        e.target.id === "name_en" && setColor(prev => ({...prev, name: {...prev.name, en: e.target.value}}))
        e.target.id === "name_ru" && setColor(prev => ({...prev, name: {...prev.name, ru: e.target.value}}))
    }


    return (
        <div className="page page_color-add">
            <div className="container_page">
                <div className="container">
                {paramColorId ? 
                <h1>{lang === 'en' ? 'Edit color' : 'Изменение цвета'}</h1>
                :
                <h1>{lang === 'en' ? 'Add new color' : 'Добавление нового цвета'}</h1>}
                    <form ref={_form}>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Name' : 'Название'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="name_en" data-ru="Название EN" data-en="Name EN" onChange={onChangeInputs} value={color.name.en} />
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="name_ru" data-ru="Название RU" data-en="Name RU" onChange={onChangeInputs} value={color.name.ru} />
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
                                            <AddFiles lang={lang} ref={addFileBig} multiple={false} id='files_big'/>
                                        </div>
                                        <div className="input__wrapper">
                                            <AddFiles lang={lang} ref={addFileSmall} multiple={false} id='files_small'/>
                                        </div>
                                    </div>
                                </>}
                        {paramColorId && <button className='button_blue change-images' onClick={onChangeImages}>{changeImages ? 'Do not change images' : 'Change all images'}</button>}
                        <button className='button_blue post' disabled={colorsState.send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {colorsState.send.status === 'fetching' ?
                                <Preloader />
                            :
                                paramColorId ? lang === 'en' ? 'Edit color' : "Изменить цвет" : lang === 'en' ? 'Add color' : "Добавить цвет"
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modal} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
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