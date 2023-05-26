import { IColor, IFiber, TLang } from 'src/interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'
import SpliderCommon from '../Spliders/Common/SpliderCommon';
import Features from '../Features/Features';
import { NavLink } from 'react-router-dom';


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
						<Features params={fiber.params} fiber={fiber} lang={lang}/>
					</div>
					<div className="colors">
						<h3>{lang === 'en' ? 'Available colors' : 'Доступные цвета'}</h3>
						<div className="colors__container">
							{fiber.colors.map((color, i) => {
								const colorData: IColor | undefined = colors.find(colorItem => colorItem.id === color)
								if (colorData) {
									return <div key={i} className={`color ${colorData.value === 'mixed' ? "color_mixed" : ""} ${colorData.value === 'transparent' ? "color_transparent" : ''}`} style={{backgroundColor: `#${colorData.value}`}} title={colorData.name[lang]}></div>
								}
							})}
						</div>
					</div>
					<div className="proscons">
						<h3>{lang === 'en' ? 'Summary' : '?'}</h3>
						<Proscons {...fiber.proscons} lang={lang}/>
					</div>
						
					<NavLink
						className="button_blue link_compareList"
						to="/fibers/compare">
							{lang === 'en' ? 'Watch in comparasing' : 'Посмотреть в сравнении'}
					</NavLink>
				</div>
            </div>
        </div>
    )
}

export default FiberItem
