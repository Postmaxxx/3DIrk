import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './custom-order.scss'
import { IFetch, IFullState, TLang } from "../../interfaces";
import { useEffect, useRef, useCallback, useMemo } from 'react'
import AddFiles, { IAddFilesFunctions } from "../../components/AddFiles/AddFiles";
import { allActions } from "../../redux/actions/all";
import { inputsProps, resetFetch} from "../../assets/js/consts";
import { deepCopy, errorsChecker, focusMover, modalMessageCreator, prevent } from "../../assets/js/processors";
import { IModalFunctions } from "../../components/Modal/ModalNew";
import MessageNew from "../../components/Message/MessageNew";
import Uploader from "../../../src/components/Preloaders/Uploader";
import BlockInput, { IBlockInputFunctions } from "../../components/BlockInput/BlockInput";

interface IPropsState {
    lang: TLang,
    sendOrder: IFetch
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
    }
}

interface IProps extends IPropsState, IPropsActions {}



const CustomOrder:React.FC<IProps> = ({lang, sendOrder, modal, setState}): JSX.Element => {
    const _message = useRef<IBlockInputFunctions>(null)
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _formOrder = useRef<HTMLFormElement>(null)


    const closeModal = useCallback(async () => {        
        if (await modal?.getName() === 'sendOrder') {
            if (sendOrder.status === 'success') {
                addFilesRef.current?.clearAttachedFiles()
                _message.current?.setValue('')
            }
            setState.user.setSendOrder(deepCopy(resetFetch))
        }
        modal?.closeCurrent()
	}, [sendOrder.status])

 

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!_message.current ||  !modal || !addFilesRef.current || !_formOrder.current) return
        prevent(e)
        //check errors
        const errors: string[] = [_message]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]
        
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
        setState.user.sendOrder({
            message: _message.current.getValue() || "Error with message ",
            files: addFilesRef.current.getFiles(),
        })
    }


    useEffect(() => {
        if (sendOrder.status === 'success' || sendOrder.status === 'error') {
            modal?.closeName('orderSending');
            modal?.openModal({ //if error/success - show modal about send order
                name: 'orderSend',
                onClose: closeModal,
                children: <MessageNew {...modalMessageCreator(sendOrder, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (sendOrder.status === 'fetching') {
            modal?.openModal({
                name: 'orderSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending order, please wait..." : "Отправка заказа, пожалуйста ждите..."}/>
            })
        }
    }, [sendOrder.status])

    
    return (
        <div className="page_order">
            <div className='container_page'>
                <div className="container">
                    <div className="block_text">
                        <h1>{lang === 'en' ? 'Order custom 3D printing' : 'Заказать индивидуальную 3D печать'}</h1>
                    </div>
                    <form className="form_full form_order" ref={_formOrder} >
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Information about the order' : 'Информация о заказе'}</h3>
                        </div>
                        <div className="form__inputs">
                            <div className="form__inputs__texts">
                                <BlockInput
                                    lang={lang}
                                    labelText={{en: 'Order description', ru: 'Описание заказа'}}
                                    required
                                    expandable
                                    typeElement="textarea"
                                    id="order_message"
                                    rules={{min:inputsProps.customOrder.message.min, max:inputsProps.customOrder.message.max}}
                                    ref={_message}
                                />
                            </div>
                            <div className="form__inputs__files">
                                <div className="block_input files">
                                    <label htmlFor="files">{lang === 'en' ? 'Attach files' : 'Прикрепить файлы'}</label>
                                    <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='files'/>
                                </div>
                            </div>
                        </div>
                        <button 
                            className="button_blue button_light button_order" 
                            type="submit" 
                            disabled={sendOrder.status === 'fetching'} 
                            onClick={onSubmit}>
                                {lang === 'en' ? 'Order' : "Заказать"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    sendOrder: state.user.sendOrder,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(CustomOrder)
