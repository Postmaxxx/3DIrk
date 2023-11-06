import { useRef } from 'react'
import './homer.scss'
import svgs from '../additional/svgs';
import { TLang } from 'src/interfaces';



const Homer = ({lang}: {lang: TLang}) => {

    const _homer = useRef<HTMLButtonElement>(null)


    window.onscroll = () => {
        scrollHomer()
    };

    function scrollHomer() {
        const show = document.body.scrollTop > 500 || document.documentElement.scrollTop > 500
        _homer.current?.classList.toggle("show", show);
    }

    const onHomerClicked = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
    }

    


    return (
        <button className='homer button_nostyle' data-testid="homer" onClick={onHomerClicked} ref={_homer} aria-label={lang === 'en' ? 'Go to the top of the page' : 'Перейти к началу страницы'} tabIndex={-1}>
            {svgs().iconHomer}
        </button>
    )
}


export default Homer