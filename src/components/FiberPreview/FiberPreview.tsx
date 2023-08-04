import { IFiber, TLang } from '../../interfaces'
import './fiber-preview.scss'
import ImgWithPreloader from '../../assets/js/ImgWithPreloader'


interface IProps {
	fiber: IFiber
	lang: TLang
}

const FiberPreview = ({fiber, lang}: IProps) => {
    return (
        <div className="fiber">
            <div className="img-cont">
                <ImgWithPreloader src={`${fiber.images.paths.small}/${fiber.images.files[0]}`} alt={fiber.images.files[0]} />
            </div>
            <div className="fiber__info">
                <h3>{fiber.short.name[lang]}</h3>
                <span>{fiber.short.text[lang]}</span>
            </div>
        </div>
    )
}

export default FiberPreview