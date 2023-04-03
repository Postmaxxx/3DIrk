import Proscons from '../Proscons/Proscons'
import './tech-item.scss'

interface IProps {
    imgPath: string
    imgDescr: string
}


const TechItem = (props: IProps) => {

    return (
        <div className="tech__item">
            <h3>ABS Plastic</h3>
            <div className='tech__img__container'>
                <img src={props.imgPath} alt="khkjghjkh" />
                <img src={props.imgPath} alt="khkjghjkh" />
                <img src={props.imgPath} alt="khkjghjkh" />
            </div>
            <div className="tech__descr__container">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est illo totam saepe. Nulla quas, odio dolore quia modi placeat! Laudantium blanditiis illo quisquam placeat quis esse, voluptas ipsa labore porro dolores ullam animi eaque dolor rerum quae numquam ea nesciunt eos, architecto in dolorem nobis quasi! Minus, possimus tenetur. Maxime.</p>
                <p>Lorem ipsum dolor, lo totam saepe. Nulla quas, odio dolore quia modi placeat! Laudantium blanditiis illo quisquam placeat quis esse, voluptas ipsa labore porro dolores ullam animi eaque dolor rerum quae numquam ea nesciunt eos, architecto in dolorem nobis quasi! Minus, possimus tenetur. Maxime.</p>
            </div>
        </div>

    )
}

export default TechItem