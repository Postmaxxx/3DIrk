import { IFiber, TLang } from '../../interfaces'
import './fiber-preview.scss'
import ImgWithPreloader from '../../assets/js/ImgWithPreloader'


interface IProps {
	fiber: IFiber
	lang: TLang
}

const FiberPreview = ({fiber, lang}: IProps) => {
    return (
        <div className="fiber-preview__item card">
            <div className="img__container">
                <ImgWithPreloader src={`${fiber.images.paths.small}/${fiber.images.files[0]}`} alt={fiber.images.files[0]} />
            </div>
            <div className="fiber__descr">
                <span>{fiber.short.name[lang]}</span>
                <span>{fiber.short.text[lang]}</span>
            </div>
        </div>
    )
}

export default FiberPreview
//done
