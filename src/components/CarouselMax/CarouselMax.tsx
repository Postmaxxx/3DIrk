import './carouselmax.scss'
import { useEffect,useRef, useState } from 'react';
import ImgWithPreloader from '../../assets/js/ImgWithPreloader'
import { findBestSuitedImgHeight } from '../../assets/js/findBestSuitedImg'
import { TLangText } from 'src/interfaces';


interface ISize {
    height: number
    url: string
}

interface IImage {
    name: TLangText
    sizes: ISize[]
}

const initialImages = Array(13).fill('').map((image, i) => ({
    name: {
        en: `Image ${i}`,
        ru: `Изображение ${i}`
    },
            sizes: [
            {
                height: 250,
                url: `./static/img/carouselMax/carousel_${i}_250.webp`
            },
            {
                height: 400,
                url: `./static/img/carouselMax/carousel_${i}_400.webp`

            },
            {
                height: 5000,
                url: `./static/img/carouselMax/carousel_${i}.webp`

            },
        ]
})) satisfies IImage[]

/*
interface ICarouselSize {
    height: number
    width: number
}
*/
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
    speed: number
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
    ribbonDx: 0,
    deltaSize: 0,
    carouselWidth: 0,
    gap: 80,
    speed: 6
}

const SliderMax = () => {
    
    const _carouselRef = useRef<HTMLDivElement>(null)
    const [ribbonPos, setRibbonPos] = useState<number>(0)
    const [images, setImages] = useState<string[]>([])
    const [state, setState] = useState<IOptions>({...options})
    const [ribbonDx, setRibbonDx] = useState<number>(0)
    const [firstRender, setFirstRender] = useState<boolean>(true)
    const [isAutoMoving, setIsAutoMoving] = useState<number>(1)


    const mouseDown =(e: Event) => {
        //console.log('add el');
        //_carouselRef.current?.addEventListener('mousemove', mouseMove)
    }

    const mouseUp =(e: Event) => {
        //console.log('remove el');
        //_carouselRef.current?.removeEventListener('mousemove', mouseMove)
    }


    const mouseMove= (e: any) => {
        if (e.buttons === 1) {
            setIsAutoMoving(0)
        }
    }
    



    useEffect (() => {
        if (!_carouselRef.current) return;

        const carouselContainerWidth = _carouselRef.current.clientWidth
        setState(prev => ({...prev, imageContainerWidth: carouselContainerWidth/2, gap: carouselContainerWidth / 15}))
        
        if (firstRender) {
            setFirstRender(false)
            return
        }
        const innerContainerWidth = state.imageContainerWidth
        const abc = initialImages.map(image => findBestSuitedImgHeight({height: _carouselRef.current?.clientHeight, images: image.sizes}))

        setImages(abc)


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




        const step = -state.speed * state.imageContainerWidth/10000;
        const ribbonMoveInterval = setInterval(() => changeRibbonDx(step), 1)

        _carouselRef.current.addEventListener('mousedown', mouseDown)
        _carouselRef.current.addEventListener('mouseup', mouseUp)
        _carouselRef.current.addEventListener('mouseleave', mouseUp)
        _carouselRef.current.addEventListener('mousemove', mouseMove)

        return (()=> {
            clearInterval(ribbonMoveInterval)
            _carouselRef.current?.removeEventListener('click', mouseDown)
        })
    },[firstRender])




    return (
        <div className="carouselmax" ref={_carouselRef}>
            <div className="ribbon" style={{left: `${ribbonPos + ribbonDx}px`}}>
                {images.map((image, index) => {
                    let dx = state.parallaxRatio*(state.carouselCenterDx - state.imageContainerWidth*(index) - ribbonDx);
                    return(
                        <div className="img-wrapper" key={index} style={{width: `${state.imageContainerWidth}px`, paddingLeft: state.paddings, paddingRight: state.paddings}}>
                            <div className="img__outer-container" style={{width: `${state.imageContainerWidth - state.gap}px`}}>
                                <div className="img__inner-container" style={{width: `${state.imageWidth}px`, left: `${dx}px`}}>
                                    <ImgWithPreloader src={image} alt="" />
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