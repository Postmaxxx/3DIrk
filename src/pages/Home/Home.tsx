import NewsBlock from 'src/components/NewsBlock/NewsBlock';
import Splider from 'src/components/Splider/Splider';
import './home.scss'


const Home = () => {
    return (
        <div className="container_page">
            <div className="container">
                <div className='page_home'>
                    <h1>Header</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.</p>
                    <Splider />
                    <h2>Last news</h2>
                    <NewsBlock />
                </div>
            </div>
        </div>
    )
}




export default Home;