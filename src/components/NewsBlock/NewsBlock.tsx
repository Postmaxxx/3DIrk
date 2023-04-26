import './news_block.scss'
import { useState, useEffect, useRef, Fragment } from 'react'
import imageNews1 from '../../assets/img/portfolio/1.png'
import imageNews2 from '../../assets/img/portfolio/2.jpeg'
import imageNews3 from '../../assets/img/portfolio/3.jpeg'
import imageNews4 from '../../assets/img/portfolio/4.jpeg'
import imageNews5 from '../../assets/img/portfolio/5.png'
import imageNews6 from '../../assets/img/portfolio/6.png'
import News from '../News/News'
import { TLang } from 'src/interfaces'

const newsMock = [
    {
        path: imageNews1,
        header: "News1 fdgdf df gfg ",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews2,
        header: "News2",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews3,
        header: "News3",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews4,
        header: "News4",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews5,
        header: "News5",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews6,
        header: "News6",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews1,
        header: "News1 fdgdf df gf2g1 ",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews2,
        header: "News22",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews3,
        header: "News33",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews4,
        header: "News44",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews5,
        header: "News55",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
    {
        path: imageNews6,
        header: "News66",
        date: "11-05-2022",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque error aut quod quidem illo! Fuga eveniet corrupti, iure, tempora cupiditate facilis dolorem ipsa ea omnis aut doloremque expedita eos in rem provident vero placeat eligendi delectus maiores quo quos! Possimus.",
    },
]

interface IProps {
    lang: TLang
}

const NewsBlock = ({lang} : IProps) => {
    const [newsDisplayed, setNewsDisplayed] = useState<number>(4)

    const showMoreNews = () => {
        setNewsDisplayed(prev => (Math.min(prev + 4, newsMock.length)))
    }

    return (
        <div className="news-block">
            {newsMock.map((news, i) => (
                <Fragment key={i}>
                    {i < newsDisplayed && <News news={news} lang={lang}/>}
                </Fragment>
            ))}
            {newsMock.length > newsDisplayed && (
                <button className='show-more-news' onClick={showMoreNews}>
                    <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                    </svg>
                        <span>{lang === 'En' ? 'Show more news' : 'Показать еще новости'}</span> 
                    <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                    </svg>
                </button>
            )}
        </div>
    )
}




export default NewsBlock;
