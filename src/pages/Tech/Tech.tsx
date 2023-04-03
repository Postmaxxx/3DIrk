import './tech.scss'
import siteLogo from "../../assets/img/logo.png"
import TechItem from 'src/components/TechItem/TechItem';


const Tech = () => {
    return (
        <div className="container_page">
            <div className="container">
                <div className="tech">
                    <h1>Технологии 3D печати</h1>
                    <div className="tech__container">
                        <TechItem {...{imgPath: siteLogo, imgDescr: 'Tech Descr'}}/>
                        <TechItem {...{imgPath: siteLogo, imgDescr: 'Tech Descr'}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Tech;
