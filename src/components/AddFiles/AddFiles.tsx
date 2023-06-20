import { TLang } from '../../interfaces'
import './add-files.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react'
import iconFileQuestion from '../../assets/img/icon_file_question.svg'
import Delete from "../../components/Delete/Delete";

interface IProps {
    lang: TLang
    saveFiles: (files: File[], id: string) => void
    multiple: boolean
    id: string
}

export interface IAddFilesFunctions {
    clearAttachedFiles: () => void;
}

const AddFiles = forwardRef<IAddFilesFunctions, IProps>(({lang, saveFiles, multiple, id}, ref) => {
    useImperativeHandle(ref, () => ({
        clearAttachedFiles() {
            setFiles([])
        }    
    }));

    console.log('addfiles rerender');
    

    const _dropArea = useRef<HTMLDivElement>(null)
    const _files = useRef<HTMLInputElement>(null)
    const _filesGallery = useRef<HTMLDivElement>(null)
    let dragCounter: number = 0
    const [files, setFiles] = useState<File[]>([])

 
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

    
    const dragDrop = (e: DragEvent) => {
        preventDefaults(e)
        _dropArea.current?.classList.remove('active')
        if (multiple) {
            setFiles(prev => [...prev, ...(e.dataTransfer?.files as FileList)])
        } else {
            const file: File = e.dataTransfer?.files[0] as File
            setFiles([file])
        }
    }
    
    const onSelectFiles = () => {   
        _dropArea.current?.classList.remove('active')
        if (multiple) {
            setFiles(prev => [...prev, ...(_files.current?.files as FileList)])
        } else {
            const file: File = (_files.current?.files as FileList)[0] as File
            setFiles([file])
        }
    }

    const clearFiles = () => {
        setFiles([])
    }


    const previewFiles = (arrayOfFiles: File[]) => {
        (_filesGallery.current as HTMLDivElement).innerHTML = '';
        const imageTypes: string[] = ['jpg', 'jpeg', 'bmp', 'svg', 'png', 'tiff', 'webp'];
        arrayOfFiles.reduce(async (acc: Promise<string>, currentFile: File) => {
            await acc
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


    useEffect(() => {
        previewFiles(files)
        saveFiles(files, id)
    }, [files])



    const remove = () => {
        clearFiles()
    }


    return (
        <div className="drop-area" ref={_dropArea}>
            <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
            </svg>
            <div className="link__container">
                <label htmlFor={id}>{lang === 'en' ? 'Add files' : 'Выберите файлы'}</label> 
                <span>{lang === 'en' ? ' or drag it here' : 'для добавления или перетащите их сюда'}</span>
            </div>
            <input id={id} type="file" multiple={multiple} onChange={onSelectFiles} ref={_files}/>
            <div className="preview-gallery" ref={_filesGallery}></div>
            {files.length > 0 ? 
                <div className="clear-files">
                    <Delete<string> remove={remove} idInstance="cartCleaner" lang={lang} disabled={false}/>
                </div>
            :
                null
            }
        </div>
    );
})

export default AddFiles