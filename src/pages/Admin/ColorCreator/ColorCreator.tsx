import { IColorsState, IFullState, TLang } from '../../../interfaces';
import './color-creator.scss'
import {  useRef, useMemo, FC, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { filesDownloader, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { defaultSelectItem, inputsProps, resetFetch, statuses } from '../../../assets/js/consts';
import Preloader from '../../../components/Preloaders/Preloader';
import { inputChecker } from '../../../../src/assets/js/processors';
import Picker, { IPickerFunctions } from '../../../../src/components/Picker/Picker';
import Selector, { ISelectorFunctions } from '../../../components/BlockSelector/BlockSelector';
import { IModalFunctions } from '../../../../src/components/Modal/ModalNew';
import MessageNew from '../../../../src/components/Message/MessageNew';
import Uploader from '../../../../src/components/Preloaders/Uploader';
import BlockInput, { IBlockInputFunctions } from '../../../components/BlockInput/BlockInput';

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
    const addFileFullRef = useRef<IAddFilesFunctions>(null)
    const addFileThumbRef = useRef<IAddFilesFunctions>(null)
    const colorPickerRef = useRef<IPickerFunctions>(null)
    const _nameEn = useRef<IBlockInputFunctions>(null)
    const _nameRu = useRef<IBlockInputFunctions>(null)
    const _selectorStatusRef = useRef<ISelectorFunctions>(null)



    const closeModal = useCallback(async () => {
        if (await modal?.getName() === 'colorSend') {
            if (colorsState.send.status === 'success') {
                setState.colors.loadColors()
            }
            setState.colors.setSendColors(resetFetch)// clear fetch status
        }
        modal?.closeCurrent()
	}, [colorsState.send.status])




    const statusesList = useMemo(() => {
        return Object.values(statuses)
    }, []) 



    useEffect(() => { //get last version of colors
        setState.colors.loadColors()
    }, [isAdmin])



    useEffect(() => {
        colorsState.load.status === 'success' && colorPickerRef.current?.setSelected()
    }, [colorsState.load.status, colorPickerRef.current])



    const fillValues = async (_id: string) => {//fill values based on selected color
        if (!_nameEn.current || !_nameRu.current || !_selectorStatusRef.current) return
        const selectedColor = colorsState.colors.find(item => item._id === _id)
        if (selectedColor) { //color exists
            const fileFull = await filesDownloader([selectedColor.urls.full])
            const fileThumb = await filesDownloader([selectedColor.urls.thumb])
            addFileFullRef.current?.replaceFiles(fileFull)
            addFileThumbRef.current?.replaceFiles(fileThumb)
            _selectorStatusRef.current.setValue(selectedColor.active ? statuses.active.value : statuses.suspended.value)
        } else { //new color
            addFileFullRef.current?.clearAttachedFiles()
            addFileThumbRef.current?.clearAttachedFiles()
            _selectorStatusRef.current.setItem({...defaultSelectItem})
            _selectorStatusRef.current.setValue('')
        }
        _nameEn.current.setValue(selectedColor?.name?.en || '')
        _nameRu.current.setValue(selectedColor?.name?.ru || '')
    }



    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_formColor.current || !_nameEn.current || !_nameRu.current || !_selectorStatusRef.current || !colorPickerRef.current) return     
        
        //check errors
        const errors: string[] = [_nameEn, _nameRu, _selectorStatusRef]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]

        if (!addFileFullRef.current?.getFiles().length) {
            errors.push(lang === 'en' ? 'File fullsize is missed' : 'Отсутствует файл полноразмера')
        }
        if (!addFileThumbRef.current?.getFiles().length) {
            errors.push(lang === 'en' ? 'File preview is missed' : 'Отсутствует файл предпросмотра')
        }
        
        if (errors.length > 0) { //show modal with error
            return modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModal,
                children: <MessageNew 
                    header={lang === 'en' ? 'Errors was found' : 'Найдены ошибки'}
                    status={'error'}
                    text={errors}
                    buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
                />
            })
        }
            
        
        const color = {
            _id: colorPickerRef.current.getSelected()[0] || '',
            name: {
                en: _nameEn.current.getValue() || 'Error',
                ru: _nameRu.current.getValue() || 'Error',
            },
            files: {
                full: addFileFullRef.current?.getFiles()[0] as File,
                thumb: addFileThumbRef.current?.getFiles()[0] as File,
            },
            active: _selectorStatusRef.current.getValue() === 'active' ? true : false
        }
        setState.colors.sendColor(color)
    }




    useEffect(() => {
        if (colorsState.send.status === 'success' || colorsState.send.status === 'error') {
            modal?.closeName('colorSending');
            modal?.openModal({ //if error/success - show modal about send order
                name: 'colorSend',
                onClose: closeModal,
                children: <MessageNew {...modalMessageCreator(colorsState.send, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
            if (colorsState.send.status === 'success') { //clear form if success
                addFileFullRef.current?.clearAttachedFiles()
                addFileThumbRef.current?.clearAttachedFiles()
            }
        }
        if (colorsState.send.status === 'fetching') {
            modal?.openModal({
                name: 'colorSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending color, please wait..." : "Отправка цвета, пожалуйста ждите..."}/>
            })
        }
    }, [colorsState.send.status])


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
                            <h3 className='section-header full-width'>{lang === 'en' ? 'Select color to edit' : 'Выберите цвет для редактирования'}</h3>           
                        </div>
                        {colorsState.load.status === 'success' ? 
                            <Picker 
                                type='colors'
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

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add information' : 'Добавьте информацию'}</h3>
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name en', ru: 'Название en'}}
                                required
                                id="name_en"
                                rules={{min:inputsProps.color.min, max:inputsProps.color.max}}
                                ref={_nameEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Name ru', ru: 'Название ru'}}
                                required
                                id="name_ru"
                                rules={{min:inputsProps.color.min, max:inputsProps.color.max}}
                                ref={_nameRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <Selector 
                                lang={lang} 
                                id='selector_status' 
                                labelText={{en: 'Color status: ', ru: 'Состояние цвета: '}}
                                data={statusesList}
                                ref={_selectorStatusRef}
                            />
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add image full-size' : 'Добавьте полноразмерное изображение'}</h3>
                        </div>
                        <div className="form__inputs">
                            <AddFiles lang={lang} ref={addFileFullRef} multiple={false} id='files_big'/>
                        </div>

                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add image thumb-size' : 'Добавьте миниатюру'}</h3>
                        </div>
                        <div className="form__inputs">
                            <AddFiles lang={lang} ref={addFileThumbRef} multiple={false} id='files_small'/>
                        </div>


                        <button 
                            className='button_blue button_light' 
                            disabled={colorsState.send.status === 'fetching'} 
                            onClick={onSubmit}>
                            {lang === 'en' ? 'Save changes' : "Сохранить изменения" }
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