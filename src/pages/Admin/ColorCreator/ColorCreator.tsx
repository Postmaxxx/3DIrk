import { IColorsState, IFullState, TLang } from '../../../interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { checkAndLoad, errorsChecker, filesDownloader, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { defaultSelectItem, inputsProps, resetFetch, statuses } from '../../../assets/js/consts';
import Preloader from '../../../components/Preloaders/Preloader';
import inputChecker from '../../../../src/assets/js/inputChecker';
import Picker, { IPickerFunctions } from '../../../../src/components/Picker/Picker';
import Selector, { ISelectorFunctions } from '../../../../src/components/Selector/Selector';
import { IModalFunctions } from '../../../../src/components/Modal/ModalNew';
import MessageNew from '../../../../src/components/Message/MessageNew';

interface IPropsState {
    lang: TLang
    colorsState: IColorsState
    isAdmin: boolean
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        colors: typeof allActions.colors
    }
}

interface IProps extends IPropsState, IPropsActions {}


const ColorCreator: FC<IProps> = ({lang, colorsState, isAdmin, modal, setState}): JSX.Element => {
    const _formColor = useRef<HTMLFormElement>(null)
    const addFileBigRef = useRef<IAddFilesFunctions>(null)
    const addFileSmallRef = useRef<IAddFilesFunctions>(null)
    const colorPickerRef = useRef<IPickerFunctions>(null)
    const _nameEn = useRef<HTMLInputElement>(null)
    const _nameRu = useRef<HTMLInputElement>(null)
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])
    const focuser = useMemo(() => focusMover(), [lang])
    const selectorRef = useRef<ISelectorFunctions>(null)


    const closeModal = useCallback(() => {
        if (modal?.getName() === 'colorSend') {
            if (colorsState.send.status === 'success') {
                checkAndLoad({//reload colors if update db was succsessfull
                    fetchData: colorsState.load,
                    loadFunc: setState.colors.loadColors,
                    force: true
                })
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
        errChecker.clear()
        modal?.closeCurrent()
	}, [colorsState.send.status])

    const statusesList = useMemo(() => {
        return Object.values(statuses)
    }, []) 



    useEffect(() => { //get last version of colors
        checkAndLoad({
			fetchData: colorsState.load,
			loadFunc: setState.colors.loadColors,
            force: true
		})
    }, [isAdmin])



    useEffect(() => {
        colorsState.load.status === 'success' && colorPickerRef.current?.setSelected()
    }, [colorsState.load.status, colorPickerRef.current])



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
        if (errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        }       
        if (!addFileBigRef.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileSmallRef.current?.getFiles().length) {
            errChecker.add(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        if (errChecker.amount() > 0) {
            modal?.openModal({ //if error/success - show modal about send order
                name: 'errorChecker',
                onClose: closeModal,
                children: <MessageNew {...errChecker.result()} buttonClose={{action: closeModal, text: 'Close'}}/>
            })
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
            modal?.openModal({ //if error/success - show modal about send order
                name: 'colorSend',
                onClose: closeModal,
                children: <MessageNew {...modalMessageCreator(colorsState.send, lang)} buttonClose={{action: closeModal, text: 'Close'}}/>
            })
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
                    <form className='form_full form_add-color' ref={_formColor}>
                        <div className="block_text">
                            <h2 className='section-header full-width'>{lang === 'en' ? 'Select color to edit' : 'Выберите цвет для редактирования'}</h2>           
                        </div>
                        <div className="picker picker_colors">
                            {colorsState.load.status === 'success' ? 
                                <Picker 
                                    ref={colorPickerRef} 
                                    items={colorsState.colors} 
                                    lang={lang} 
                                    multiple={false}
                                    withNew={true}
                                    onItemClick={onColorSelected}
                                    minSelected={1}
                                    markInactive={true}/>
                            :
                                <Preloader />}
                        </div>

                        <div className="block_text">
                            <h2>{lang === 'en' ? 'Add information' : 'Добавьте информацию'}</h2>
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <div className="block_input" data-selector="input-block">
                                <label htmlFor="name_en">{lang === 'en' ? 'Name en' : 'Название en'}</label>
                                <input 
                                    ref={_nameEn}
                                    data-selector="input"
                                    id="name_en" 
                                    onChange={onChangeInputs} 
                                    onKeyDown={focuser.next}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
                            </div>
                            <div className="block_input" data-selector="input-block">
                                <label htmlFor="name_ru">{lang === 'en' ? 'Name ru' : 'Название ru'}</label>
                                <input 
                                   ref={_nameRu}
                                   data-selector="input"
                                   id="name_ru" 
                                   onChange={onChangeInputs}
                                   onKeyDown={focuser.next}
                                   onBlur={(e) => inputChecker({lang, min:inputsProps.color.min, max:inputsProps.color.max, el: e.target})}/>
                            </div>
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
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
                        </div>

                        <div className="block_text">
                            <h2>{lang === 'en' ? 'Add image full-size' : 'Добавьте полноразмерное изображение'}</h2>
                        </div>
                        <div className="form__inputs">
                            <AddFiles lang={lang} ref={addFileBigRef} multiple={false} id='files_big'/>
                        </div>

                        <div className="block_text">
                            <h2>{lang === 'en' ? 'Add image thumb-size' : 'Добавьте миниатюру'}</h2>
                        </div>
                        <div className="form__inputs">
                            <AddFiles lang={lang} ref={addFileSmallRef} multiple={false} id='files_small'/>
                        </div>


                        <button 
                            className='button_blue button_light' 
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
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    colorsState: state.colors,
    isAdmin: state.user.isAdmin,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(ColorCreator)