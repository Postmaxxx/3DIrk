import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { IFullState, IModal, IOrderState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react'
import Modal from "src/components/Modal/Modal";
import MessageInfo from "src/components/MessageInfo/MessageInfo";
import { orderBlock } from "src/assets/js/data";
import { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus }  from "../../redux/actions/order"
import CartContent from "src/components/CartContent/CartContent";
import AddFiles, { IAddFilesFunctions } from "src/components/AddFiles/AddFiles";

const actionsList = { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus  }

interface IPropsState {
    lang: TLang,
    order: IOrderState
}

interface IPropsActions {
    setState: {
        order: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}




const Order:React.FC<IProps> = ({lang, order, setState}): JSX.Element => {

    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
	const [modal, setModal] = useState<IModal>({visible: false})
    const addFilesRef = useRef<IAddFilesFunctions>(null)



    const closeModal = () => {
		setModal({visible: false})
        if (order.dataSending.status === 'success') {
            setState.order.clearFiles();
            setState.order.clearForm();
            addFilesRef.current?.clearAttachedFiles()
        }
        setState.order.setSendDataStatus({status: 'idle', message: ''})
	}


    const checkErrors = (): boolean => {
        const feildsToCheck: Array<React.RefObject<HTMLInputElement | HTMLTextAreaElement>> = [_name,_email,_phone,_message]
        let isWrong: boolean = false
        feildsToCheck.forEach(field => {
            if (!field.current?.checkValidity()) {
                field.current?.parentElement?.classList.add('error')
                isWrong = true
            }
        })
        return isWrong
    }


        
    const preventDefaults = (e: DragEvent | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        preventDefaults(e)
        const currentDate: Date = new Date();
        const name:string =  order.name;
        const phone:string = order.phone;
        const email:string = order.email;
        const message:string = order.message;
        if (checkErrors()) return
        
        const text: string = `Date: ${currentDate.toISOString().slice(0,10)}%0ATime: ${currentDate.toISOString().slice(11, 19)}%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage: ${message}` ;

        setState.order.sendOrder({lang, text, sendFilesArr: order.files})
    }

    useEffect(() => {
        if (order.dataSending.status !== 'idle') {
            setModal({visible: true})
        }
    }, [order.dataSending.status])





    const clearError = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
        (e.target as HTMLElement).parentElement?.classList.remove('error')
    }


    const focusNext = ({e, target}: {e: KeyboardEvent, target: HTMLInputElement | HTMLTextAreaElement | null}) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            target?.focus();
        }
    }


    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        switch (e.target.id) {
            case "name":
                setState.order.setName(e.target.value)
                break;
            case "phone":
                setState.order.setPhone(e.target.value)
                break;
            case "email":
                setState.order.setEmail(e.target.value)
                break;
            case "message":
                setState.order.setMessage(e.target.value)
                break;
            default:
                break;
        }
        clearError(e)
    }


    const saveFiles = (files: File[]) => {
        setState.order.clearFiles()
        setState.order.addFiles(files)
    }


    return (
        <section className="order">
            <div className='container_page'>
                <div className="container">
                    <div className="page_order">
                        <h1>{orderBlock.header[lang]}</h1>
                        <div className="order__block">

                            <form className="order__container">
                                <h2>{orderBlock.subheader[lang]}</h2>
                                <div className="data-block">

                                    <div className="inputs-block">
                                        <div className="input-block">
                                            <label htmlFor="name">
                                                {orderBlock.name.label[lang]}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="name" 
                                                type="text" 
                                                required 
                                                min={2} 
                                                max={25} 
                                                ref={_name} 
                                                value={order.name}
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _phone.current})}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="phone">
                                                {orderBlock.phone.label[lang]}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="phone"
                                                type="tel" 
                                                min={6} 
                                                max={25} 
                                                ref={_phone} 
                                                value={order.phone}
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _email.current})}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="email">
                                                {orderBlock.email.label[lang]}
                                            </label>
                                            <input 
                                                className="input-element" 
                                                id="email" 
                                                type="email" 
                                                required 
                                                value={order.email}
                                                ref={_email} 
                                                onChange={onChangeText} 
                                                onKeyDown={(e:any) => focusNext({e, target: _message.current})}/>
                                        </div>
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {orderBlock.message.label[lang]}
                                            </label>
                                            <textarea 
                                                className="input-element" 
                                                id="message" 
                                                required 
                                                minLength={10} 
                                                maxLength={1000} 
                                                ref={_message} 
                                                value={order.message}
                                                onChange={onChangeText}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="files">{orderBlock.files.label[lang]}</label>
                                            <AddFiles saveFiles={saveFiles} lang={lang} ref={addFilesRef}/>
                                        </div>
                                    </div>

                                </div>

                                <div className="cart-content__container">
                                    <h3>{lang === 'en' ? 'Your cart' : 'Ваша корзина'}</h3>
                                    <CartContent />
                                </div>

                                <button type="submit" className="button_order" onClick={onSubmit}>{lang === 'en' ? 'Order' : "Отправить"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
					<MessageInfo {...{
                        status: order.dataSending.status,
                        header: order.dataSending.status === 'success' ? lang === 'en' ? "Success" : "Отправлено" : lang === 'en' ? "Error" : "Ошибка",
                        text: [order.dataSending.message], 
                        buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                        buttonAction: closeModal
                    }}/>
			</Modal> 
        </section>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    order: state.order,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		order: bindActionCreators(actionsList, dispatch)
	}
})
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
/*
                        <div className="img__container">
                            <img src={imgSide} alt="" />
                        </div>
*/