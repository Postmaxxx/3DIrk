import { IColorsState, IFiberParam, IFibersState, IFullState, ISendFiber, TLang } from '../../../interfaces';
import './fiber-creator.scss'
import { FC, Fragment, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import BlockSelector, { ISelectorFunctions } from '../../../components/BlockSelector/BlockSelector';
import { IFiberProperties, fibersProperties } from '../../../assets/data/fibersProperties';
import Preloader from '../../../components/Preloaders/Preloader';
import { defaultSelectItem, inputsProps, resetFetch, selector, statuses } from '../../../assets/js/consts';
import { filesDownloader, modalMessageCreator, prevent } from '../../../assets/js/processors';
import Picker, { IPickerFunctions } from '../../../components/Picker/Picker';
import Featurer, { IFeaturerFunctions } from '../../../components/Featurer/Featurer';
import { IModalFunctions } from '../../../components/Modal/Modal';
import Message from '../../../components/Message/Message';
import Uploader from '../../../../src/components/Preloaders/Uploader';
import BlockInput, { IBlockInputFunctions } from '../../../components/BlockInput/BlockInput';

interface IPropsState {
    lang: TLang
    fibersState: IFibersState
    colorsState: IColorsState
    isAdmin: boolean
    modal: IModalFunctions | null
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}


interface IProps extends IPropsState, IPropsActions {}


const FiberCreator: FC<IProps> = ({lang, fibersState, setState, isAdmin, modal, colorsState}): JSX.Element => {
    const colorPickerRef = useRef<IPickerFunctions>(null)
    const fiberPickerRef = useRef<IPickerFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _pros = useRef<HTMLDivElement>(null)
    const _cons = useRef<HTMLDivElement>(null)
    const _spec = useRef<HTMLDivElement>(null)
    const _descr = useRef<HTMLDivElement>(null)
    const prosRef = useRef<IFeaturerFunctions>(null)
    const consRef = useRef<IFeaturerFunctions>(null)
    const _status = useRef<ISelectorFunctions>(null)
    const _nameShortEn = useRef<IBlockInputFunctions>(null)
    const _nameShortRu = useRef<IBlockInputFunctions>(null)
    const _nameEn = useRef<IBlockInputFunctions>(null)
    const _nameRu = useRef<IBlockInputFunctions>(null)
    const _textShortEn = useRef<IBlockInputFunctions>(null)
    const _textShortRu = useRef<IBlockInputFunctions>(null)
    const _textEn = useRef<IBlockInputFunctions>(null)
    const _textRu = useRef<IBlockInputFunctions>(null)
    const data10 = useMemo(() => selector["10"], [])
    const data5 = useMemo(() => selector["5"], [])
    const data3 = useMemo(() => selector["3"], [])
    const statusesList = useMemo(() => (Object.values(statuses)), []) 
    const [properties, setProperties] = useState<{item: IFiberProperties, ref: ISelectorFunctions | IBlockInputFunctions | null}[]>(
        fibersProperties.map(fiber => ({item: fiber, ref: null}))
    )


    const closeModal = useCallback(async () => {
        if (await modal?.getName() === 'fiberSendStatus') {
            if (fibersState.send.status === 'success') {
                window.location.reload()
                fillValues('')
            }
            setState.fibers.setSendFibers(resetFetch)// clear fetch status
        }
        modal?.closeCurrent()
	}, [fibersState.send.status, colorsState.send.status])



    
    useEffect(() => {
        if (fibersState.send.status === 'success' || fibersState.send.status === 'error') {
            modal?.closeName('fiberSending');
            modal?.openModal({
                name: 'fiberSendStatus',
                onClose: closeModal,
                children: <Message {...modalMessageCreator(fibersState.send, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (fibersState.send.status === 'fetching') {
            modal?.openModal({
                name: 'fiberSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending fiber, please wait..." : "Отправка материала, пожалуйста ждите..."}/>
            })
        }
    }, [fibersState.send.status])



    


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {        
        prevent(e)
        if (!prosRef.current|| !consRef.current || !_spec.current || !_descr.current || !_pros.current || !_cons.current 
            || !colorPickerRef.current || !_status.current) return
        //check DESCRIPTION
        const errors: string[] = [_nameShortEn, _nameShortRu, _nameEn, _nameRu, _textShortEn, _textShortRu, _textEn, _textRu]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]

        //check SPECS
        properties.forEach(prop => {
            const errText = prop.ref?.getErrorText(lang)
            errText && errors.push(errText)
        })
        let statusErr = _status.current.getErrorText(lang)
        statusErr && errors.push(statusErr)

        //check PROS
        prosRef.current.getErrors().forEach(err => {
            errors.push(`${lang === 'en' ? 'Field in pros: ' : 'Поле в плюсах: '}${err[lang]}`)
        })

        //check CONS
        consRef.current.getErrors().forEach(err => {
            errors.push(`${lang === 'en' ? 'Field in cons: ' : 'Поле в минусах: '}${err[lang]}`)
        })

         //check Images
         if (addFilesRef.current && addFilesRef.current.getFiles().length === 0) {//check images
            errors.push(lang === 'en' ? 'Images missed' : 'Картинки отсутствуют')
         }
         //check Colors
         if (colorPickerRef.current.getSelected().length === 0) { //at least 1 color must be selected
            errors.push(lang === 'en' ? 'No colors selected' : 'Цвета не выбраны')
         }

        if (errors.length > 0) { //show modal with error
            return modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModal,
                children: <Message 
                    header={lang === 'en' ? 'Errors was found' : 'Найдены ошибки'}
                    status={'error'}
                    text={errors}
                    buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
                />
            })
        }
        
        const params = {} as IFiberParam; //create {} with all specs
        properties.forEach(prop => { 
            if (prop.ref) {
                params[prop.item._id] = prop.ref?.getValue() || ''
            }  
        })

        const pros = prosRef.current.getFeatures().map(item => ({en: item.name.en, ru: item.name.ru}))
        const cons = consRef.current.getFeatures().map(item => ({en: item.name.en, ru: item.name.ru}))

        const fiber: ISendFiber = {
            _id: fiberPickerRef.current?.getSelected()[0] || '',
            colors: (colorPickerRef.current as IPickerFunctions).getSelected(),
            files: addFilesRef.current?.getFiles() || [],
            active: _status.current?.getValue() === 'active' ? true : false,
            name: { en: _nameEn.current?.getValue() || 'Error', ru: _nameRu.current?.getValue() || 'Error' },
            text: { en: _textEn.current?.getValue() || 'Error', ru: _textRu.current?.getValue() || 'Error' },
            short: {
                name: { en: _nameShortEn.current?.getValue() || 'Error', ru: _nameShortRu.current?.getValue() || 'Error' },
                text: { en: _textShortEn.current?.getValue() || 'Error', ru: _textShortRu.current?.getValue() || 'Error' },
            },
            params,
            proscons: { pros, cons }
        }
        setState.fibers.sendFiber(fiber)   
    }

    
    useEffect(() => { //get last version of colors
        setState.colors.loadColors()
    }, [isAdmin])



    const renderSpec: JSX.Element = useMemo(() => {
        return ( <>
            {properties.map((prop, i) => {
                return (
                    <Fragment key={prop.item._id}>
                        {prop.item.type !== 'string' ? 
                            <Fragment key={prop.item._id}>
                                <BlockSelector 
                                    lang={lang} 
                                    id={prop.item._id} 
                                    labelText={prop.item.name}
                                    required
                                    ref={el => properties[i].ref = el}
                                    data={prop.item.type === '10' ? data10 : prop.item.type === '5' ? data5 : data3 }
                                />
                            </Fragment>
                        :
                            <BlockInput
                                lang={lang}
                                labelText={{en: `${prop.item.name.en}, (${prop.item.unit.en})`, ru: `${prop.item.name.ru}, (${prop.item.unit.ru})`}}
                                required
                                id={prop.item._id} 
                                rules={{min:inputsProps.fiber.spec.min, max:inputsProps.fiber.spec.max}}
                                ref={el => properties[i].ref = el}
                                key={prop.item._id}
                            />
                        }
                    </Fragment>
                )
            })}
            <BlockSelector 
                lang={lang} 
                id='selector_status' 
                labelText={{en: 'Fiber status: ', ru: 'Состояние материала: '}}
                data={statusesList}
                defaultData={{...defaultSelectItem}}
                ref={_status}
            />
        </>
        )
    }, [fibersProperties, lang])

   

    const fillValues = async (_id: string): Promise<void> => {//fill values based on selected color
        if (!_spec.current || !prosRef.current || !consRef.current || !_status.current) return
        const selectedFiber = fibersState.fibersList.find(item => item._id === _id)
        if (selectedFiber) { //fiber exists
            //descr
            _nameShortEn.current?.setValue(selectedFiber.short.name.en)
            _nameShortRu.current?.setValue(selectedFiber.short.name.ru)
            _nameEn.current?.setValue(selectedFiber.name.en)
            _nameRu.current?.setValue(selectedFiber.name.ru)
            _textShortEn.current?.setValue(selectedFiber.short.text.en)
            _textShortRu.current?.setValue(selectedFiber.short.text.ru)
            _textEn.current?.setValue(selectedFiber.text.en)
            _textRu.current?.setValue(selectedFiber.text.ru)

            //specifications
             properties.forEach(prop => {
                prop.ref?.setValue(`${selectedFiber.params[prop.item._id]}`)
                prop.ref?.hasOwnProperty('setChanged') && (prop.ref as ISelectorFunctions)?.setChanged(true)
            })
            _status.current.setValue(selectedFiber.active ? 'active' : 'suspended')

            //PROS + CONS
            prosRef.current.setFeatures(selectedFiber.proscons.pros.map(item => ({name: item, _id: ''}))) //Ids doesn't matter for fiber, pros/cons are just arrays
            consRef.current.setFeatures(selectedFiber.proscons.cons.map(item => ({name: item, _id: ''}))) //Ids doesn't matter for fiber, pros/cons are just arrays

            //colors 
            colorPickerRef.current?.setSelected(selectedFiber.colors)
            //files
            const files = await filesDownloader(
                selectedFiber.images.files.map(file => (`${selectedFiber.images.basePath}/${selectedFiber.images.sizes[selectedFiber.images.sizes.length - 1].subFolder}/${file}`))
            )
            addFilesRef.current?.replaceFiles(files)
            //setFiber({...selectedFiber, files}) // +descr part
            _status.current.setValue(selectedFiber.active ? statuses.active.value : statuses.suspended.value)
            _status.current.setChanged(true)
        } else { //new fiber
            //descr
            _nameShortEn.current?.setValue('')
            _nameShortRu.current?.setValue('')
            _nameEn.current?.setValue('')
            _nameRu.current?.setValue('')
            _textShortEn.current?.setValue('')
            _textShortRu.current?.setValue('')
            _textEn.current?.setValue('')
            _textRu.current?.setValue('')
        
            //specifications
             properties.forEach(prop => {
                prop.ref?.setValue('')
                prop.ref?.hasOwnProperty('setChanged') && (prop.ref as ISelectorFunctions)?.setChanged(false)
            })
        
            //PROS + CONS
            prosRef.current.setFeatures([]) //Ids doesn't matter for fiber, pros/cons are just arrays
            consRef.current.setFeatures([]) //Ids doesn't matter for fiber, pros/cons are just arrays
            
            //colors 
            colorPickerRef.current?.setSelected([])

            addFilesRef.current?.clearAttachedFiles()
            _status.current.setItem({...defaultSelectItem})
            _status.current.setValue('')
            _status.current.setChanged(false)
        }
    }

    const onFiberSelected = (_id: string): void => {
        fillValues(_id)
    }


    useEffect(() => {
        fibersState.load.status === 'success' && fiberPickerRef.current?.setSelected() 
    }, [fibersState.load.status])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                <h1>{lang === 'en' ? 'Edit fibers' : 'Изменение материалов'}</h1>
                    <form className='form_full form_add-fiber'>
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Select fiber to edit' : 'Выберите материал для редактирования'}</h3>           
                        </div>
                        {fibersState.load.status === 'success' ? 
                            <Picker 
                                type='fibers'
                                ref={fiberPickerRef} 
                                items={fibersState.fibersList} 
                                lang={lang} 
                                multiple={false}
                                withNew={true}
                                onItemClick={onFiberSelected}
                                minSelected={1}
                                markInactive={true}/>
                        :
                            <Preloader />}

                        <section className="fiber_descr" ref={_descr}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Fiber description' : 'Описание материала'}</h3>           
                            </div>
                            <div className="form__inputs form__inputs_sm-wide">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Name short en', ru: 'Название кратко en'}}
                                    required
                                    id="name_short_en"
                                    rules={{min:inputsProps.fiber.nameShort.min, max:inputsProps.fiber.nameShort.max}}
                                    ref={_nameShortEn}
                                />
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Name short ru', ru: 'Название кратко ru'}}
                                    required
                                    id="name_short_ru"
                                    rules={{min:inputsProps.fiber.nameShort.min, max:inputsProps.fiber.nameShort.max}}
                                    ref={_nameShortRu}
                                />
                            </div>
                            <div className="form__inputs form__inputs_sm-wide">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Name en', ru: 'Название en'}}
                                    required
                                    id="name_en"
                                    rules={{min:inputsProps.fiber.nameFull.min, max:inputsProps.fiber.nameFull.max}}
                                    ref={_nameEn}
                                />
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Name ru', ru: 'Название ru'}}
                                    required
                                    id="name_ru"
                                    rules={{min:inputsProps.fiber.nameFull.min, max:inputsProps.fiber.nameFull.max}}
                                    ref={_nameRu}
                                />
                            </div>
                            <div className="form__inputs form__inputs_sm-wide">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Description short en', ru: 'Описание кратко en'}}
                                    required
                                    typeElement='textarea'
                                    id="text_short_en"
                                    rules={{min:inputsProps.fiber.textShort.min, max:inputsProps.fiber.textShort.max}}
                                    ref={_textShortEn}
                                />
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Description short ru', ru: 'Описание кратко ru'}}
                                    required
                                    typeElement='textarea'
                                    id="text_short_ru"
                                    rules={{min:inputsProps.fiber.textShort.min, max:inputsProps.fiber.textShort.max}}
                                    ref={_textShortRu}
                                />
                            </div>
                            <div className="form__inputs form__inputs_sm-wide">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Description en', ru: 'Описание en'}}
                                    required
                                    typeElement='textarea'
                                    id="text_en"
                                    rules={{min:inputsProps.fiber.textFull.min, max:inputsProps.fiber.textFull.max}}
                                    ref={_textEn}
                                />
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Description ru', ru: 'Описание ru'}}
                                    required
                                    typeElement='textarea'
                                    id="text_ru"
                                    rules={{min:inputsProps.fiber.textFull.min, max:inputsProps.fiber.textFull.max}}
                                    ref={_textRu}
                                />
                            </div>
                        </section>
                        <section className="fiber_specifications" ref={_spec}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Fiber specifications' : 'Характеристики материала'}</h3>           
                            </div>
                            <div className="block_inputs_3">
                                {renderSpec}
                            </div>
                        </section>
                        <section className="fiber_pros" ref={_descr}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Fiber pros' : 'Плюсы материала'}</h3>           
                            </div>
                            <div className="fiber_pros" ref={_pros}>
                                <Featurer 
                                    id='pros'
                                    lang={lang} 
                                    ref={prosRef} 
                                    type='input'
                                    rules={{min: inputsProps.fiber.proscons.min, max: inputsProps.fiber.proscons.max}}
                                />
                            </div>
                        </section>
                        <section className="fiber_cons" ref={_descr}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Fiber cons' : 'Минусы материала'}</h3>           
                            </div>
                            <div className="fiber_cons" ref={_cons}>
                                <Featurer 
                                    id='cons'
                                    lang={lang} 
                                    ref={consRef} 
                                    type='input'
                                    rules={{min: inputsProps.fiber.proscons.min, max: inputsProps.fiber.proscons.max}}
                                />
                            </div>
                        </section>

                        <section className="fiber_colors" ref={_descr}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Select all applicable colors' : 'Выберите все применимые цвета'}</h3>           
                            </div>
                            {colorsState.load.status === 'success' ? 
                                <Picker 
                                    type='colors'
                                    ref={colorPickerRef} 
                                    items={colorsState.colors} 
                                    lang={lang}
                                    minSelected={1}
                                    markInactive={true}/>
                            :
                                <Preloader />}
                        </section>

                        <section className="fiber_images" ref={_descr}>
                            <div className="block_text">
                                <h3>{lang === 'en' ? 'Add images' : 'Выберите изображения'}</h3>           
                            </div>
                            <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
                        </section>

                        <button className='button_blue button_post' disabled={fibersState.send.status === 'fetching'} onClick={onSubmit}>
                            {lang === 'en' ? 'Save changes' : "Сохранить изменения"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    fibersState: state.fibers,
    colorsState : state.colors,
    isAdmin: state.user.isAdmin,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(FiberCreator)