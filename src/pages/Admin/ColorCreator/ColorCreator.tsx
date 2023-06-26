import { IColor, IColorsState, IFetch, IFullState, ISendColor, TLang } from 'src/interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback, useState} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { errorsChecker, prevent } from 'src/assets/js/processors';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import { useNavigate, useParams } from 'react-router-dom';

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
    const _name_en = useRef<HTMLInputElement>(null)
    const _name_ru = useRef<HTMLInputElement>(null)
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const addFileSmall = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
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
        if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
            setState.colors.loadColors()
        }
    }, [colorsState.load.status])





    const fillColor = (_id: string) => {
        if (!_name_en.current || !_name_ru.current) return
        const color = colorsState.colors.find(color => color._id === _id)
        if (!color) return alert('color not found')
        _name_en.current.value = color.name.en
        _name_ru.current.value = color.name.ru
    }



    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_name_en.current || !_name_ru.current) return
        
        errChecker.check(_name_en.current, 2, 50)
        errChecker.check(_name_ru.current, 2, 50)
        
        if (!addFileBig.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmall.current?.getFiles().length && changeImages) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (errChecker.amount() > 0) {
            message.current?.update(errChecker.result())
            modal.current?.openModal()
            errChecker.clear()
            return
        }
        
        const color: ISendColor = {
            _id: paramColorId,
            name: {
                en: _name_en.current.value,
                ru: _name_ru.current.value,
            },
            files: {
                full: addFileBig.current?.getFiles()[0] as File,
                small: addFileBig.current?.getFiles()[0] as File,
            }
        }

        
        if (paramColorId) {
            setState.colors.editColor(color, changeImages)
        } else {
            setState.colors.sendColor(color)
        }  
    }












    useEffect(() => {
        if (!_name_en.current || !_name_ru.current) return
        if (colorsState.send.status === 'success' || colorsState.send.status === 'error') {
            const errors: string[] = colorsState.send.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[colorsState.send.status][lang],
                status: colorsState.send.status,
                text: [colorsState.send.message[lang], ...errors]
            })
            modal.current?.openModal()
            if (colorsState.send.status === 'success') { //clear form if success
                _name_en.current.value = ''
                _name_ru.current.value = ''
                addFileBig.current?.clearAttachedFiles()
                addFileSmall.current?.clearAttachedFiles()
            }
        }
    }, [colorsState.send.status])




    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }



    const render = useMemo(() => (
        <div className="container">
            {paramColorId ? 
            <h1>{lang === 'en' ? 'Edit color' : 'Изменение цвета'}</h1>
            :
            <h1>{lang === 'en' ? 'Add new color' : 'Добавление нового цвета'}</h1>}
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
                <button className='button_blue post' disabled={colorsState.send.status === 'fetching'} onClick={e => onSubmit(e)}>{paramColorId ? lang === 'en' ? 'Edit color' : "Изменить цвет" : lang === 'en' ? 'Add color' : "Добавить цвет"}</button>
            </form>
        </div>), [lang, colorsState.send.status, changeImages])


    return (
        <div className="page page_color-add">
            <div className="container_page">
                {render}
                <Modal escExit={true} ref={modal} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
                </Modal>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    colorsState: state.colors
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)