import { IColor, IFiber, TLang } from 'src/interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'
import SpliderCommon from '../Spliders/Common/SpliderCommon';


interface IProps {
	fiber: IFiber
	lang: TLang
	colors: IColor[]
}

const FiberItem = ({fiber, lang, colors}: IProps) => {
    return (
        <div className="fiber__item">
			<h2>{fiber.name[lang]}</h2>
            <div className='fiber__splider__container'>
				<SpliderCommon images={fiber.imgs} lang={lang} imagesPerSlide={3}/>
            </div>
            <div className="fiber__descr__container">
				<div className="block_text">
					{fiber.text[lang].map((textItem, i) => <p key={i}>{textItem.part}</p>)}
					<div className="features__container">
						<h3>{lang === 'en' ? 'Features' : 'Характеристики'}</h3>
						<div className="features">
							{fiber.features.map((feature, i) => (
								<div className="feature" key={i}>
									<span>{feature.name[lang]}: </span>
									<span className='feature__value'>{feature.value[lang]}</span>
								</div>
							))}
						</div>
					</div>
					<div className="colors">
						<h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
						<div className="colors__container">
							{fiber.colors.map((color, i) => {
								const colorData: IColor | undefined = colors.find(colorItem => colorItem.id === color)
								if (colorData) {
									return <div key={i} className={`color ${colorData.value === 'mixed' ? "color_mixed" : ""}`} style={{backgroundColor: `#${colorData.value}`}} title={colorData.name[lang]}></div>
								}
							})}
						</div>
					</div>
					<div className="proscons">
						<h3>{lang === 'en' ? 'Best for' : 'Применение'}</h3>
						<Proscons {...fiber.proscons} lang={lang}/>
					</div>
				</div>
            </div>
        </div>
    )
}

export default FiberItem
