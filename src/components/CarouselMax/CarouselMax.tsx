import './carouselmax.scss'
import { useEffect,useRef, useState,useCallback, useMemo } from 'react';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader'
import { IImgWithThumb, ISplider } from '../../interfaces';
import Modal, { IModalFunctions } from "../Modal/Modal";
import ImageModal, { IImageModalFunctions } from "../ImageModal/ImageModal";



interface IOptions {
    imageContainerWidth: number
    innerContainerWidth :number
    carouselCenterDx: number
    paddings: number
    initialRibbonPos: number
    deltaSize: number
    carouselWidth: number
    imageRatio: number
    parallaxRatio: number
    imageWidth: number
    gap: number
    initialSpeed: number
}


const options: IOptions = {
    imageContainerWidth: 600,
    imageWidth: 0,
    imageRatio: 1.2,
    parallaxRatio: 0,
    innerContainerWidth: 0,
    carouselCenterDx: 0,
    paddings: 0,
    initialRibbonPos: 0,
    deltaSize: 0,
    carouselWidth: 0,
    gap: 80,
    initialSpeed: 0.0006
}

interface ISliderMax {
    content: ISplider
}

const SliderMax = ({content}: ISliderMax) => {
    const _carouselRef = useRef<HTMLDivElement>(null)
    const [ribbonPos, setRibbonPos] = useState<number>(0)
    const [state, setState] = useState<IOptions>({...options})
    const [ribbonDx, setRibbonDx] = useState<number>(0)
    const [images, setImages] = useState<{urlSplider: string, urlFull: string, filename: string}[]>(content.files.map(filename => ({
        urlSplider: `${content.paths.spliderMain}/${filename}`, 
        urlFull: `${content.paths.full}/${filename}`, 
        filename})))
    const prevPos = useRef<number>(0)
    const step = useRef<number>(0)
    const isMoving = useRef<number>(1)
    const delta = useRef<number>(0)
    const sum = useRef<number>(0)
    const newDx = useRef<number>(0)
    const speed = useRef<number>(options.initialSpeed)
    const [firstRender, setFirstRender] = useState<boolean>(true)
    const modal_image = useRef<IModalFunctions>(null)
    const imageModal = useRef<IImageModalFunctions>(null)



    useEffect (() => {//initial settings
        if (!_carouselRef.current) return;

        const carouselContainerWidth = _carouselRef.current.clientWidth
        setState(prev => ({...prev, imageContainerWidth: carouselContainerWidth/2, gap: carouselContainerWidth / 15}))
        
        if (firstRender) {
            setFirstRender(false)
            return
        }
        const innerContainerWidth = state.imageContainerWidth
        if (_carouselRef.current.clientWidth < 200) {
            setImages(content.files.map(filename => ({urlSplider: `${content.paths.spliderMain}/${filename}`, urlFull: `${content.paths.full}/${filename}`, filename})))
        }

        const imagesPerContainer = Math.ceil(_carouselRef.current.offsetWidth / state.imageContainerWidth);
        setImages(prev => [...prev.slice(-imagesPerContainer).reverse(),...prev, ...prev.slice(0,imagesPerContainer)]);
        
        const initialRibbonPos = -state.imageContainerWidth * imagesPerContainer
        
        const carouselCenterDx = imagesPerContainer * state.imageContainerWidth
        const deltaSize = (state.imageContainerWidth * state.imageRatio)*0.5
        const parallaxRatio = state.imageContainerWidth*(state.imageRatio - 1)/(_carouselRef.current.offsetWidth - state.imageContainerWidth) 
        const imageWidth = state.imageContainerWidth * state.imageRatio
        setState((prev) => ({...prev, innerContainerWidth, initialRibbonPos, carouselCenterDx, deltaSize, carouselWidth: (_carouselRef.current as HTMLDivElement).offsetWidth, parallaxRatio, imageWidth}))
        setRibbonPos(initialRibbonPos)
    },[firstRender])





    const changeRibbonDx = () => {
        newDx.current += (step.current * isMoving.current) + delta.current
        if (newDx.current < -images.length * state.imageContainerWidth) {
            newDx.current += images.length * state.imageContainerWidth 
        }
        if (newDx.current > 0) {
            newDx.current -= images.length * state.imageContainerWidth 
        }
        setRibbonDx(newDx.current)
        delta.current = 0

        if (Math.abs(speed.current) > Math.abs(options.initialSpeed*1.2)) {
            speed.current = speed.current*0.997
            step.current = speed.current * state.imageContainerWidth
        }
    }


    const mouseDown =(e: MouseEvent) => {
        prevPos.current = e.clientX
        isMoving.current = 0
        delta.current = 0
        sum.current = 0
    }

    
    const mouseUp =(e: MouseEvent) => {
        speed.current = delta.current < 0 ? 
            -options.initialSpeed * (Math.min(Math.max(-delta.current/3, 1), 20)) :
            options.initialSpeed * (Math.min(Math.max(delta.current/3, 0), 20) || -1)
        step.current = speed.current * state.imageContainerWidth
        isMoving.current = 1
    }


    const mouseMove = (e: MouseEvent) => {
        if (e.buttons === 1) {
            delta.current += e.clientX - prevPos.current;
            prevPos.current = e.clientX
        }
    }


    const mouseEnter = (e: MouseEvent) => {
        prevPos.current = e.clientX
    }

    const mouseLeave = (e: MouseEvent) => {
        if (e.buttons !== 1) return 
        mouseUp(e)
    }


    const onImageExpand = (urlFull: string) => {
        imageModal.current?.update({url: urlFull, text: ''})
        modal_image.current?.openModal()
        isMoving.current = 0
    }


    const closeModalImage = () => {
        modal_image.current?.closeModal()
        isMoving.current = 1
	}

    useEffect(() => {
        if (firstRender) return
        step.current = -speed.current * state.imageContainerWidth
        const ribbonMoveInterval = setInterval(changeRibbonDx, 1)
        _carouselRef.current?.addEventListener('mousedown', mouseDown)
        _carouselRef.current?.addEventListener('mouseup', mouseUp)
        _carouselRef.current?.addEventListener('mousemove', mouseMove)
        _carouselRef.current?.addEventListener('mouseenter', mouseEnter)
        _carouselRef.current?.addEventListener('mouseleave', mouseLeave)

        
        return (()=> {
            clearInterval(ribbonMoveInterval)
            _carouselRef.current?.removeEventListener('mousedown', mouseDown)
            _carouselRef.current?.removeEventListener('mouseup', mouseUp)
            _carouselRef.current?.removeEventListener('mousemove', mouseMove)
            _carouselRef.current?.removeEventListener('mouseenter', mouseEnter)
            _carouselRef.current?.removeEventListener('mouseleave', mouseLeave)
        })
    }, [firstRender])




    return (
        <div className="carouselmax" ref={_carouselRef}>
            <div className="ribbon" style={{left: `${ribbonPos + ribbonDx}px`}}>
                {images.map((image, index) => {
                    let dx = state.parallaxRatio*(state.carouselCenterDx - state.imageContainerWidth*(index) - ribbonDx);
                    return(
                        <div className="img-wrapper" key={index} style={{width: `${state.imageContainerWidth}px`, paddingLeft: state.paddings, paddingRight: state.paddings}}>
                            <div className="img__outer-container" style={{width: `${state.imageContainerWidth - state.gap}px`}}>
                                <div className="img__inner-container" style={{width: `${state.imageWidth}px`, left: `${dx}px`}}>
                                    <ImgWithPreloader src={image.urlSplider} alt={image.filename} />
                                </div>
                            </div>
                            <div className="image-extender" onClick={() => onImageExpand(image.urlFull)}>
                                +
                            </div>
                        </div>
                    )
                })}
            </div>
            <Modal escExit={true} ref={modal_image} onClose={closeModalImage}>
				<ImageModal ref={imageModal} />
            </Modal>
        </div>
    )
}


export default SliderMax;