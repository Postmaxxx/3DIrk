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

/*
            <div className='fiber__splide__container'>
                <div className="splide" ref={_splideFabric} aria-label="The carousel">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {fiber.imgs.map((img) => {
                                return (
                                    <li className="splide__slide" key={img.url}>
                                        <div className="splide__slide-container">
                                            <img src={img.url} alt={img.alt}  />
                                        </div>
                                    </li>
                                );
                            })
                            }
                        </ul>
                    </div>
                </div>
            </div>
*/

/*
	const fabricSplide = useRef<Splide>();
	const containerSize = useRef<IContainerSize>();
	const _splideFabric = useRef<any>();


    const optionsMain: any = {
		lazyLoad: false,
		updateOnMove: true,
		perPage: 1,
		fixedWidth: "100%",
		perMove: 1,
		pagination: true,
		arrows: true,
		drag: true,
		speed: 500,
		autoplay: true,
		interval: 5000,
		pauseOnHover: true,
		rewind: true,
		breakpoints: {
			768: {
				wheel: false,
			}, 
		},
	};


	useEffect(() => {
		containerSize.current = {
			width:  _splideFabric.current.offsetWidth,
			height:  _splideFabric.current.offsetHeight,
		};
		fabricSplide.current = new Splide(_splideFabric.current, optionsMain);
		fabricSplide.current.mount();		
		return () => {
		};
	}, []);

*/

/*
interface IContainerSize {
	width: number
	height: number
}*/
/*
import Splide from "@splidejs/splide";
import { useRef, useState, useEffect } from 'react'
*/