import './carouselmax.scss'
import image1 from '../../assets/img/portfolio/1.png'
import image2 from '../../assets/img/portfolio/2.jpeg'
import image3 from '../../assets/img/portfolio/3.jpeg'
import image4 from '../../assets/img/portfolio/4.jpeg'
import image5 from '../../assets/img/portfolio/5.png'
import image6 from '../../assets/img/portfolio/6.png'
import { useEffect,useRef, useState } from 'react';


interface ICarouselSize {
    height: number
    width: number
}

interface IOptions {
    imageContainerWidth: number
    innerContainerWidth :number
    carouselCenterDx: number
    paddings: number
    initialRibbonPos: number
    ribbonDx: number
    deltaSize: number
    carouselWidth: number
    imageRatio: number
    parallaxRatio: number
    imageWidth: number
    gap: number
}

const initialImages = [image1, image2, image3, image4, image5, image6]

const options: IOptions = {
    imageContainerWidth: 600,
    imageWidth: 0,
    imageRatio: 1.3,
    parallaxRatio: 0,
    innerContainerWidth: 0,
    carouselCenterDx: 0,
    paddings: 0,
    initialRibbonPos: 0,
    ribbonDx: 0,
    deltaSize: 0,
    carouselWidth: 0,
    gap: 80
}

const SliderMax = () => {
    
    const _carouselRef = useRef<HTMLDivElement>(null)
    const _ribbonRef = useRef<HTMLDivElement>(null)
    const [ribbonPos, setRibbonPos] = useState<number>(0)
    const [images, setImages] = useState<string[]>([...initialImages])
    const [state, setState] = useState<IOptions>({...options})
    const [ribbonDx, setRibbonDx] = useState<number>(0)


    const mouseMove =(e: Event) => {
        //console.log(e);
    }

    const mouseDown =(e: Event) => {
        _carouselRef.current?.addEventListener('mousemove', mouseMove)
    }

    const mouseUp =(e: Event) => {
        console.log(22222);
        _carouselRef.current?.removeEventListener('mousemove', mouseMove)
    }



    useEffect (() => {
        if (!_carouselRef.current) return;
        
        const innerContainerWidth = state.imageContainerWidth
        
        const imagesPerContainer = Math.ceil(_carouselRef.current.offsetWidth / state.imageContainerWidth);
        setImages(prev => [...prev.slice(-imagesPerContainer).reverse(),...prev, ...prev.slice(0,imagesPerContainer)]);
        
        const initialRibbonPos = -state.imageContainerWidth * imagesPerContainer
        
        const carouselCenterDx = imagesPerContainer * state.imageContainerWidth
        const deltaSize = (state.imageContainerWidth * state.imageRatio)*0.5
        const parallaxRatio = state.imageContainerWidth*(state.imageRatio - 1)/(_carouselRef.current.offsetWidth - state.imageContainerWidth) 
        const imageWidth = state.imageContainerWidth * state.imageRatio
        setState((prev) => ({...prev, innerContainerWidth, initialRibbonPos, carouselCenterDx, deltaSize, carouselWidth: (_carouselRef.current as HTMLDivElement).offsetWidth, parallaxRatio, imageWidth}))
        setRibbonPos(initialRibbonPos)

        const changeRibbonDx = (value: number) => {
            setRibbonDx(prev => {
                let newDx: number = prev + value
                if (newDx < -initialImages.length * state.imageContainerWidth) {
                    newDx += initialImages.length * state.imageContainerWidth 
                }
                if (newDx > 0) {
                    newDx -= initialImages.length * state.imageContainerWidth 
                }

                return newDx
            })
        }

        const ribbonMoveInterval = setInterval(() => changeRibbonDx(-1), 10)

        _carouselRef.current.addEventListener('mousedown', mouseDown)
        _carouselRef.current.addEventListener('mouseup', mouseUp)

        return (()=> {
            clearInterval(ribbonMoveInterval)
            _carouselRef.current?.removeEventListener('click', mouseDown)
        })
    },[])




    return (
        <div className="carouselmax" ref={_carouselRef}>
            <div className="ribbon" ref={_ribbonRef} style={{left: `${ribbonPos + ribbonDx}px`}}>
                {images.map((image, index) => {
                    let dx = state.parallaxRatio*(state.carouselCenterDx - state.imageContainerWidth*(index) - ribbonDx);
                    return(
                        <div className="img-wrapper" key={index} style={{width: `${state.imageContainerWidth}px`, paddingLeft: state.paddings, paddingRight: state.paddings}}>
                            <div className="img__outer-container" style={{width: `${state.imageContainerWidth - state.gap}px`}}>
                                <div className="img__inner-container" style={{width: `${state.imageWidth}px`, left: `${dx}px`}}>
                                    <img src={image} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}


export default SliderMax;