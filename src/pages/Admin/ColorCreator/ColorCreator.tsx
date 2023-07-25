import { IColorsState, IFullState, TLang } from '../../../interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { checkAndLoad, errorsChecker, filesDownloader, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { defaultSelectItem, inputsProps, resetFetch, statuses, timeModalClosing } from '../../../assets/js/consts';
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Preloader from '../../../components/Preloaders/Preloader';
import inputChecker from '../../../../src/assets/js/inputChecker';
import Picker, { IPickerFunctions } from '../../../../src/components/Picker/Picker';
import Selector, { ISelectorFunctions } from '../../../../src/components/Selector/Selector';

interface IPropsState {
    lang: TLang
    colorsState: IColorsState
    isAdmin: boolean
}

interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ColorCreator: FC<IProps> = ({lang, colorsState, isAdmin, setState}): JSX.Element => {
    const _formColor = useRef<HTMLFormElement>(null)
    const addFileBigRef = useRef<IAddFilesFunctions>(null)
    const addFileSmallRef = useRef<IAddFilesFunctions>(null)
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const colorPickerRef = useRef<IPickerFunctions>(null)
    const _nameEn = useRef<HTMLInputElement>(null)
    const _nameRu = useRef<HTMLInputElement>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const focuser = useMemo(() => focusMover(), [lang])
    const selectorRef = useRef<ISelectorFunctions>(null)


    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (modalRef.current?.getOwner() === 'sender') {
            if (colorsState.send.status === 'success') {
                checkAndLoad({//reload colors if update db was succsessfull
                    fetchData: colorsState.load,
                    loadFunc: setState.colors.loadColors,
                    force: true
                })
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
	}, [colorsState.send.status])

    const statusesList = useMemo(() => {
        return Object.values(statuses)
    }, []) 

    
    useEffect(() => { //get last version of colors
        checkAndLoad({
			fetchData: colorsState.load,
			loadFunc: setState.colors.loadColors,
            force: false
		})
    }, [colorsState.load.status])

    
    useEffect(() => { //get last version of colors
        checkAndLoad({
			fetchData: colorsState.load,
			loadFunc: setState.colors.loadColors,
            force: true
		})
    }, [isAdmin])



    const fillValues = async (_id: string) => {//fill values based on selected color
        if (!_nameEn.current || !_nameRu.current || !selectorRef.current) return
        const selectedColor = colorsState.colors.find(item => item._id === _id)
        if (selectedColor) { //color exists
            const filesBig = await filesDownloader([selectedColor.url.full])
            const filesSmall = await filesDownloader([selectedColor.url.thumb])
            addFileBigRef.current?.replaceFiles(filesBig)
            addFileSmallRef.current?.replaceFiles(filesSmall)
            selectorRef.current.setValue(selectedColor.active ? statuses.active.value : statuses.suspended.value)
        } else { //new color
            addFileBigRef.current?.clearAttachedFiles()
            addFileSmallRef.current?.clearAttachedFiles()
            selectorRef.current.setValue('active')
        }
        _nameEn.current.value = selectedColor?.name?.en || ''
        _nameRu.current.value = selectedColor?.name?.ru || ''
    }



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        errChecker.clear()
        prevent(e)
        if (!_formColor.current || !_nameEn.current || !_nameRu.current || !selectorRef.current || !colorPickerRef.current) return       
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = _formColor.current.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        }       
        if (!addFileBigRef.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmallRef.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal("errorChecker")
            return
        }

        const color = {
            _id: colorPickerRef.current.getSelected()[0] || '',
            name: {
                en: _nameEn.current.value,
                ru: _nameRu.current.value,
            },
            files: {
                full: addFileBigRef.current?.getFiles()[0] as File,
                thumb: addFileSmallRef.current?.getFiles()[0] as File,
            },
            active: selectorRef.current.getValue() === 'active' ? true : false
        }
        setState.colors.sendColor(color)
    }




    useEffect(() => {
        if (colorsState.send.status === 'success' || colorsState.send.status === 'error') {
            messageRef.current?.update(modalMessageCreator(colorsState.send, lang))
            modalRef.current?.openModal("sender")
            if (colorsState.send.status === 'success') { //clear form if success
                addFileBigRef.current?.clearAttachedFiles()
                addFileSmallRef.current?.clearAttachedFiles()
            }
        }
    }, [colorsState.send.status])



    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
    }



    useEffect(() => {       
        if (!_formColor.current) return
        focuser.create({container: _formColor.current, itemsSelector: '[data-selector="select"], [data-selector="input"]'})
    }, [lang])



    const onColorSelected = async (_id: string) => {
        fillValues(_id)
    }


    return (
        <div className="page page_creator_color">
            <div className="container_page">
                <div className="container">
                <h1>{lang === 'en' ? 'Edit colors' : 'Изменение цветов'}</h1>
                    <form ref={_formColor}>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'SELECT COLOR TO EDIT' : 'ВЫБЕРЕТЕ ЦВЕТ ДЛЯ РЕДАКТИРОВАНИЯ'}</h2>           
                        <div className="colors-picker">
                            {colorsState.load.status === 'success' ? 
                                <Picker 
                                    ref={colorPickerRef} 
                                    items={colorsState.colors} 
                                    lang={lang} 
                                    multiple={false}
                                    withNew={true}
                                    onItemClick={onColorSelected}
                                    minSelected={1}/>
                            :
                                <Preloader />}
                        </div>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Name' : 'Название'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    ref={_nameEn}
                                    data-selector="input"
                                    id="name_en" 
                                    onChange={onChangeInputs} 
                                    onKeyDown={focuser.next}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    ref={_nameRu}
                                    data-selector="input"
                                    id="name_ru" 
                                    onChange={onChangeInputs}
                                    onKeyDown={focuser.next}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
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
                                <AddFiles lang={lang} ref={addFileBigRef} multiple={false} id='files_big'/>
                            </div>
                            <div className="input__wrapper">
                                <AddFiles lang={lang} ref={addFileSmallRef} multiple={false} id='files_small'/>
                            </div>
                        </div>
                        <Selector 
                            lang={lang} 
                            id='selector_status' 
                            label={{en: 'Color status: ', ru: 'Состояние цвета: '}}
                            data={statusesList}
                            onBlur={(e) => inputChecker({lang, notExact: '', el: e.target})}
                            defaultData={{...defaultSelectItem}}
                            saveValue={onChangeInputs}
                            ref={selectorRef}
                        />
                        <button 
                            className='button_blue button_post' 
                            disabled={colorsState.send.status === 'fetching'} 
                            onClick={onSubmit}>
                            {colorsState.send.status === 'fetching' ?
                                <Preloader />
                            :
                                lang === 'en' ? 'Save changes' : "Сохранить изменения" 
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
    isAdmin: state.user.isAdmin
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)