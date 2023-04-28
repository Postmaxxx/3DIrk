import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { IState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import imgSide from '../../assets/img/order_1.jpg'
import { useState, useEffect, useRef } from 'react'

interface IProps {
    lang: TLang
    header: TLangText
    subheader: TLangText
    name: {
        label: TLangText,
        data: string
    },
    phone: {
        label: TLangText,
        data: string
    },
    email: {
        label: TLangText,
        data: string
    },
    message: {
        label: TLangText,
        data: string
    },
    files: {
        label: TLangText,
        listLabel: TLangText
        link: TLangText
        linkRest: TLangText
        filesList: Array<string>
    },
    qrcode: string,
    text: TLangTextArr
}

const Order = ({lang, header, subheader, name, phone, email,message, files, qrcode, text}: IProps) => {
    
    const _dropArea = useRef<HTMLDivElement>(null)
    const [filesList, setFilesList] = useState<FileList>()
    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)

    const preventDefaults = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const dragEnter = (e: any) => {
        preventDefaults(e)
        _dropArea.current?.classList.add('active')
    }

    const dragOver = (e: any) => {
        preventDefaults(e)
        _dropArea.current?.classList.add('active')
    }

    const dragLeave = (e: any) => {
        preventDefaults(e)
        _dropArea.current?.classList.remove('active')
    }



    const clearError = (e: any) => { 
        e.target.parentElement.classList.remove('error')
    }



    
    const dragDrop = (e: any) => {
        preventDefaults(e)
        _dropArea.current?.classList.remove('active')
        setFilesList(e.dataTransfer?.files);
    }

    const hasErrors = (): boolean => {
        if (!_name.current?.checkValidity()) {
            _name.current?.parentElement?.classList.add('error')
            return true
        }
        if (!_email.current?.checkValidity()) {
            _name.current?.parentElement?.classList.add('error')
            return true
        }
        if (!_phone.current?.checkValidity()) {
            _name.current?.parentElement?.classList.add('error')
            return true
        }
        if (!_message.current?.checkValidity()) {
            _name.current?.parentElement?.classList.add('error')
            return true
        }
        return false
    }


    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        preventDefaults(e)
        const currentDate: Date = new Date();
        const apiToken: string = process.env.REACT_APP_TG_TOK || '';
        const chatId: string = process.env.REACT_APP_CHT_ID || '';
        //const chatLink: string = process.env.REACT_APP_CHT_LINK || '';
        const name:string = _name.current?.value || '';

        //if (hasErrors()) return


        const message: string = '111'// (document.querySelector("#contact_message") as HTMLInputElement).value;
        const text: string = `Date: ${currentDate.toISOString().slice(0,10)} %0ATime: ${currentDate.toISOString().slice(11, 19)} %0AName: ${name}%0AEmail: %0ATopic:%0A%0AMessage: ${message}` ;
        const urlMessage:string = `https://api.telegram.org/bot${apiToken}/sendMessage?chat_id=${chatId}&text=${text}`;
        fetch(urlMessage)
            .then(() => (console.log('OK')))
            .catch(e => console.log('error', e.message))



        const urlDocument= `https://api.telegram.org/bot${apiToken}/sendDocument`;
        
        ([...filesList as FileList] as []).forEach((file:any) => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', file, `filename.rrr`);
            console.log(file);
            
            const options = {
                method: 'POST',
                body: formData,
            };

            fetch(urlDocument, options)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('File sent successfully:', data);
            })
            .catch(error => {
              console.error('Error sending file:', error);
            });

        })    



    }


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

    return (
        <div className='container_page'>
            <div className="container">
                <div className="page_order">
                    <h1>{header[lang]}</h1>
                    <div className="order__block">
                        <img src={imgSide} alt="" />
                        <form className="order__container">
                            <h2>{subheader[lang]}</h2>
                            <div className="inputs-block">
                                <div className="input-block">
                                    <label htmlFor="name">
                                        {name.label[lang]}
                                    </label>
                                    <input id="name" type="text" required min={3} max={25} onChange={clearError} ref={_name}/>
                                </div>
                                <div className="input-block">
                                    <label htmlFor="phone">
                                        {phone.label[lang]}
                                    </label>
                                    <input id="phone" type="tel" min={6} max={20} ref={_phone}/>
                                </div>
                                <div className="input-block">
                                    <label htmlFor="email">
                                        {email.label[lang]}
                                    </label>
                                    <input id="email" type="email" required ref={_email}/>
                                </div>




                                <div className="input-block files">
                                    <label htmlFor="files">
                                        {files.label[lang]}
                                    </label>
                                    <div className="drop-area" ref={_dropArea}>
                                        <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                                        </svg>
                                        <div className="link__container">
                                            <label htmlFor="files">
                                                {files.link[lang] }
                                            </label> 
                                            <span> 
                                                {' '+ files.linkRest[lang]}
                                            </span>
                                        </div>
                                        <input id="files" type="file" multiple onChange={dragDrop} />
                                    </div>
                                </div>





                                <div className="input-block">
                                    <label htmlFor="message">
                                        {message.label[lang]}
                                    </label>
                                    <textarea id="message" required minLength={20} ref={_message}/>
                                </div>
                            </div>
                            <button type="submit" onClick={onSubmit}>{lang === 'en' ? 'Send' : "Отправить"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
    header: state.components.orderBlock.header,
    subheader: state.components.orderBlock.subheader,
    name: state.components.orderBlock.name,
    email: state.components.orderBlock.email,
    phone: state.components.orderBlock.phone,
    message: state.components.orderBlock.message,
    files: state.components.orderBlock.files,
    qrcode: state.components.orderBlock.qrcode,
    text: state.components.orderBlock.text,
})
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(Order)
