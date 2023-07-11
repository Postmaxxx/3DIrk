import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import "./image-modal.scss"
import Preloader from '../Preloaders/Preloader'
import { IImageModal } from '../../interfaces'


export interface IImageModalFunctions {
    clear: () => void;
    update: (newImage: IImageModal) => void;
}


const ImageModal = forwardRef<IImageModalFunctions>(({}, ref) => {
    useImperativeHandle(ref, () => ({
        clear() {
            clear()
        },
        update(newImage: IImageModal) {      
            update(newImage)
        },
    }));

    const _container = useRef<HTMLDivElement>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [content, setContent] = useState<IImageModal>({url: '', text: ''})


    const setStatusLoaded = () => {
        setLoaded(true)
    }


    const clear = () => {
        setContent({url: '', text: ''})
    }

    const update = (newData: IImageModal) => {
        setContent(newData)        
    }


    useEffect(() => {
        const _img: HTMLImageElement = new Image;
        _img.src = content.url;
        _container.current?.appendChild(_img)
        _img.addEventListener('load', setStatusLoaded)
        setLoaded(false);
        return () => {
            _img.removeEventListener('load', setStatusLoaded)
            _container.current?.removeChild(_img)
        }
    }, [content.url])



    return (
        <div className="image_modal__container">
            <div className="img__wrapper" ref={_container}>
                {!loaded && <Preloader />}
            </div>
            <div className="descr__container">
                <span>{content.text}</span>
            </div>
        </div>   
    )
})

export default ImageModal