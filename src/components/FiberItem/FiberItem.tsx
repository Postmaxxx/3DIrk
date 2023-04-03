import { IFiber } from 'src/interfaces'
import Proscons from '../Proscons/Proscons'
import './fiber-item.scss'


const FiberItem = ({fiber}: {fiber: IFiber}) => {
    return (
        <div className="fiber__item">
            <div className='fiber__img__container'>
                <img src={fiber.img[0].url} alt={fiber.img[0].alt} key={fiber.img[0].url} />
            </div>
            <div className="fiber__descr__container">
                <h3>{fiber.header}</h3>
                {fiber.text.map((textItem, i) => <p key={i}>{textItem}</p>)}
                <Proscons proscons={fiber.proscons}/>
            </div>
        </div>
    )
}

export default FiberItem
//{fiber.img.map(image => <img src={image.url} alt={image.alt} key={image.path} />)}
