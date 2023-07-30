import { useState, useRef} from 'react'
import "./image-modal.scss"
import Preloader from '../Preloaders/Preloader'



interface IProps {
    url: string
    text?: string
}

const ImageModalNew: React.FC<IProps> = ({url, text=''}): JSX.Element => {

	const [loaded, setLoaded] = useState(false);
	const img = useRef<HTMLImageElement>(null);

	const hasLoaded = () => {
		setLoaded(true)
	}

    return (
        <div className="image_modal__container">
            <div className="img__wrapper">
                {loaded || <Preloader />}
                <img ref={img} src={url} alt={text} onLoad={hasLoaded} style={{display: loaded ? "block" : "none"}} />
            </div>
            <div className="descr__container">
                <span>{text}</span>
            </div>
        </div>   
    )
}

export default ImageModalNew