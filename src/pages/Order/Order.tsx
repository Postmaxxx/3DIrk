import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './order.scss'
import { IState, TLang, TLangText, TLangTextArr } from "src/interfaces";
import imgSide from '../../assets/img/order_1.jpg'
import { useState, useEffect, useRef } from 'react'
import iconFileQuestion from '../../assets/img/icon_file_question.svg'
import iconFilesClear from '../../assets/img/icon_clear.svg'

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
    const [filesArr, setFilesArr] = useState<Array<File>>([])
    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _files = useRef<HTMLInputElement>(null)
    const _message = useRef<HTMLTextAreaElement>(null)
    const _filesGallery = useRef<HTMLDivElement>(null)
    const _filesCleaner = useRef<HTMLDivElement>(null)
    let dragCounter: number = 0

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
        setFilesArr((prev) => {
            return [...prev, ...(e.dataTransfer?.files as FileList)]
        })
    }
    
    const onSelect = () => {
        _dropArea.current?.classList.remove('active')
        setFilesArr((prev) => {
           return [...prev, ...(_files.current?.files as FileList)]
        })

    }

    const clearAttachedFiles = () => {
        setFilesArr([]);
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


    const sendMessage = ({apiToken, chatId, text}: {apiToken: string, chatId: string, text: string}): boolean => {
        const urlMessage:string = `https://api.telegram.org/bot${apiToken}/sendMessage?chat_id=${chatId}&text=${text}`;
        let success: boolean = true
        fetch(urlMessage)
            .then(res => {
                if (!res.ok) {
                    success = false
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Message sent succesfully: ', data)
            })
            .catch(err => {
                success = false
                alert(`Error while sending a message: ${err.message}`)
            });
        return success
    }




    const sendFiles = ({apiToken, chatId, sendFilesArr}: {apiToken: string, chatId: string, sendFilesArr: File[]}) => {
        const urlDocument= `https://api.telegram.org/bot${apiToken}/sendDocument`;
        let success: boolean = true
        sendFilesArr.forEach((file: File) => {
            const formData: FormData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', file, file.name);
            const options = {method: 'POST', body: formData};
            fetch(urlDocument, options)
                .then(response => {
                    if (!response.ok) {
                    success = false
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
            })
            .then(data => console.log('File has been sent successfully:', file.name))
            .catch(error => {
                success = false
                console.error(`Error while sending a file:, ${file.name}, error: ${error.message}`)
            });
        })
        if (!success) {
            alert(`Error while sending files, try again later`)
        }
        return success
    }

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        preventDefaults(e)
        const currentDate: Date = new Date();
        const apiToken: string = process.env.REACT_APP_TG_TOK || '';
        const chatId: string = process.env.REACT_APP_CHT_ID || '';
        //const chatLink: string = process.env.REACT_APP_CHT_LINK || '';
        const name:string = _name.current?.value || '';
        const phone:string = _phone.current?.value || '';
        const email:string = _email.current?.value || '';
        const message:string = _message.current?.value || '';
        if (checkErrors()) return
        
        const text: string = `Date: ${currentDate.toISOString().slice(0,10)}%0ATime: ${currentDate.toISOString().slice(11, 19)}%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage: ${message}` ;

        sendMessage({apiToken, chatId, text})
        sendFiles({apiToken, chatId, sendFilesArr: filesArr})
    }



    




    useEffect(() => {
        previewFiles(filesArr)
    }, [filesArr])


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
        <section className="order">
            <div className='container_page'>
                <div className="container">
                    <div className="page_order">
                        <h1>{header[lang]}</h1>
                        <div className="order__block">

                            <form className="order__container">
                                <h2>{subheader[lang]}</h2>
                                <div className="data-block">

                                    <div className="inputs-block">
                                        <div className="input-block">
                                            <label htmlFor="name">
                                                {name.label[lang]}
                                            </label>
                                            <input id="name" type="text" required min={2} max={25} onChange={clearError} ref={_name}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="phone">
                                                {phone.label[lang]}
                                            </label>
                                            <input id="phone" type="tel" min={6} max={25} ref={_phone} onChange={clearError}/>
                                        </div>
                                        <div className="input-block">
                                            <label htmlFor="email">
                                                {email.label[lang]}
                                            </label>
                                            <input id="email" type="email" required ref={_email} onChange={clearError}/>
                                        </div>
                                        <div className="input-block message-block">
                                            <label htmlFor="message">
                                                {message.label[lang]}
                                            </label>
                                            <textarea id="message" required minLength={10} maxLength={1000} ref={_message} onChange={clearError}/>
                                        </div>
                                    </div>
                                    <div className="files-block">
                                        <div className="input-block files">
                                            <label htmlFor="files">{files.label[lang]}</label>
                                            <div className="drop-area" ref={_dropArea}>
                                                <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                                                </svg>
                                                <div className="link__container">
                                                    <label htmlFor="files">{files.link[lang]}</label> 
                                                    <span>{' ' + files.linkRest[lang]}</span>
                                                </div>
                                                <input id="files" type="file" multiple onChange={onSelect} ref={_files}/>
                                                <div className="preview-gallery" ref={_filesGallery}></div>
                                                <div className="drop-area__cleaner" ref={_filesCleaner} onClick={clearAttachedFiles} aria-label={lang === 'en' ? "Clear list" : 'Очистить список'} title={lang === 'en' ? "Clear list" : 'Очистить список'}>
                                                    <img src={iconFilesClear} alt={lang === 'en' ? "Clear" : 'Очистить'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <button type="submit" onClick={onSubmit}>{lang === 'en' ? 'Send' : "Отправить"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
/*
                        <div className="img__container">
                            <img src={imgSide} alt="" />
                        </div>
*/