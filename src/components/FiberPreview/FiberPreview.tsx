import { IColor, IFiber, TLang } from '../../interfaces'
import './fiber-preview.scss'
import ImgWithPreloader from '../../assets/js/ImgWithPreloader'


interface IProps {
	fiber: IFiber
	lang: TLang
	colors: IColor[]
}

const FiberPreview = ({fiber, lang, colors}: IProps) => {
    return (
        <div className="fiber-preview__item card">
            <div className="img__container">
                <ImgWithPreloader src={fiber.imgs[0].url} alt={fiber.imgs[0].name[lang]} />
            </div>
            <div className="fiber__descr">
                <span>{fiber.short.name[lang]}</span>
                <span>{fiber.short.text[lang]}</span>

            </div>
        </div>
    )
}

export default FiberPreview
