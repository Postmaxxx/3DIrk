import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { IFullState, IModal, IOrderState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react'
import iconFileQuestion from '../../assets/img/icon_file_question.svg'
import iconFilesClear from '../../assets/img/icon_clear.svg'
import Modal from "src/components/Modal/Modal";
import MessageInfo from "src/components/MessageInfo/MessageInfo";
import { orderBlock } from "src/assets/js/data";
import { setName, setEmail, setPhone, setMessage, clearFiles, clearForm, addFiles, sendOrder, setSendDataStatus }  from "../../redux/actions/order"
import CartContent from "src/components/CartContent/CartContent";

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

    const _dropArea = useRef<HTMLDivElement>(null)
    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _files = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
    const _filesGallery = useRef<HTMLDivElement>(null)
    const _filesCleaner = useRef<HTMLDivElement>(null)
	const [modal, setModal] = useState<IModal>({visible: false})

    let dragCounter: number = 0

    const closeModal = () => {
		setModal({visible: false})
        if (order.dataSending.status === 'success') {
            setState.order.clearFiles();
            setState.order.clearForm();
        }
        setState.order.setSendDataStatus({status: 'idle', message: ''})
	}

    
    const preventDefaults = (e: DragEvent | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const dragEnter = (e: DragEvent) => {
        preventDefaults(e)
        dragCounter++
        _dropArea.current?.classList.add('active')
    }

    const dragOver = (e: DragEvent) => {
        preventDefaults(e)
        _dropArea.current?.classList.add('active')
    }

    const dragLeave = (e: DragEvent) => {
        preventDefaults(e)
        dragCounter--
        if (dragCounter === 0) {
            _dropArea.current?.classList.remove('active')
        }
    }



    const clearError = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
        (e.target as HTMLElement).parentElement?.classList.remove('error')
    }

    
    const dragDrop = (e: DragEvent) => {
        preventDefaults(e)
        _dropArea.current?.classList.remove('active')
        setState.order.addFiles([...(e.dataTransfer?.files as FileList)])
    }
    
    const onSelectFiles = () => {
        _dropArea.current?.classList.remove('active')
        setState.order.addFiles([...(_files.current?.files as FileList)])
    }

    const clearAttachedFiles = () => {
        setState.order.clearFiles()
    }


    const previewFiles = (arrayOfFiles: File[]) => {
        
        (_filesGallery.current as HTMLDivElement).innerHTML = '';
        const imageTypes: string[] = ['jpg', 'jpeg', 'bmp', 'svg', 'png', 'tiff', 'webp'];

        arrayOfFiles.reduce((acc: Promise<string>, currentFile: File) => {
            return new Promise<string>((res) => {
                acc.then(() => {
                    const reader =  new FileReader();
                    reader.readAsDataURL(currentFile)
                    reader.onloadend = () => {
                        let _containerObj: HTMLDivElement = document.createElement('div')
                        let _containerImg: HTMLDivElement = document.createElement('div')
                        let _descr: HTMLSpanElement = document.createElement('span')
                        let _img: HTMLImageElement = document.createElement('img')
                        _img.src = (imageTypes.includes(currentFile.name.split('.').pop() || '')) ? reader.result as string : iconFileQuestion;
                        _descr.innerText = currentFile.name;
                        _filesGallery.current?.appendChild(_containerObj)
                        _containerImg.appendChild(_img)
                        _containerObj.appendChild(_containerImg)
                        _containerObj.appendChild(_descr)
                        res(`File ${currentFile.name} added`)
                    }
                })
            })
        }, Promise.resolve('Files array is empty'))
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

    useEffect(() => {
        previewFiles(order.files)
    }, [order.files])


    useEffect(() => {
        if (!_dropArea.current) { return }
        
        _dropArea.current.addEventListener('dragenter', dragEnter, false);
        _dropArea.current.addEventListener('dragover', dragOver, false);
        _dropArea.current.addEventListener('dragleave', dragLeave, false);
        _dropArea.current.addEventListener('drop', dragDrop, false);
        return () => {
            _dropArea.current?.removeEventListener('dragenter', dragEnter, false);
            _dropArea.current?.removeEventListener('dragover', dragOver, false);
            _dropArea.current?.removeEventListener('dragleave', dragLeave, false);
            _dropArea.current?.removeEventListener('drop', dragDrop, false);
        }

    })



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
                                            <div className="drop-area" ref={_dropArea}>
                                                <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                                                </svg>
                                                <div className="link__container">
                                                    <label htmlFor="files">{orderBlock.files.link[lang]}</label> 
                                                    <span>{' ' + orderBlock.files.linkRest[lang]}</span>
                                                </div>
                                                <input id="files" type="file" multiple onChange={onSelectFiles} ref={_files}/>
                                                <div className="preview-gallery" ref={_filesGallery}></div>
                                                <div className="drop-area__cleaner" ref={_filesCleaner} onClick={clearAttachedFiles} aria-label={lang === 'en' ? "Clear list" : 'Очистить список'} title={lang === 'en' ? "Clear list" : 'Очистить список'}>
                                                    <img src={iconFilesClear} alt={lang === 'en' ? "Clear" : 'Очистить'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="cart-content__container">
                                    <h3>{lang === 'en' ? 'Your cart' : 'Ваша корзина'}</h3>
                                    <CartContent />
                                </div>

                                <button type="submit" className="button_order" onClick={onSubmit}>{lang === 'en' ? 'Send' : "Отправить"}</button>
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