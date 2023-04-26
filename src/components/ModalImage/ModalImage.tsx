import { useState, useEffect, useRef } from 'react'
import "./modalImage.scss"
import Preloader from '../Preloader/Preloader'

interface IProps {
    path: string
    descr: string
}

const ModalImage = ({props}: {props: IProps}) => {

    const [loaded, setLoaded] = useState<boolean>(false)
    const _container = useRef<HTMLDivElement>(null)
    

    const setStatusLoaded = () => {
        setLoaded(true)
    }

    useEffect(() => {
        const _img: HTMLImageElement = new Image;
        _img.src = props.path;
        _container.current?.appendChild(_img)
        _img.addEventListener('load', setStatusLoaded)
        setLoaded(false);
        return () => {
            _img.removeEventListener('load', setStatusLoaded)
            _container.current?.removeChild(_img)
        }
    }, [props.path])

    
    return (
        <div className="modal__image-container">
            <div className="img-wrapper" ref={_container}>
                {!loaded && <Preloader />}
            </div>
            <div className="descr-container">
                <span>{props.descr}</span>
            </div>
        </div>
    )
}


export default ModalImage