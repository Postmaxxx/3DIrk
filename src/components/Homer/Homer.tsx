import { useRef, useEffect } from 'react'
import './homer.scss'
import svgs from '../additional/svgs';
import { TLang } from '../../interfaces';
import { useScrollHider } from '../../hooks/scrollHider';



const Homer: React.FC<{lang: TLang}> = ({lang}): JSX.Element => {

    const _homer = useRef<HTMLButtonElement>(null)
    const {add: addToHider, clear: clearHider} = useScrollHider()


    const onHomerClicked = (): void => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
    }

    useEffect(() => {
        if (!_homer.current) return
        addToHider(_homer.current, 100)
        return () => clearHider()
    }, [])
    

    return (
        <button 
            className='homer button_nostyle' 
            data-testid="homer" 
            onClick={onHomerClicked} 
            ref={_homer} 
            title={lang === 'en' ? 'Go to the top of the page' : 'Перейти к началу страницы'} 
            aria-label={lang === 'en' ? 'Go to the top of the page' : 'Перейти к началу страницы'} 
            tabIndex={-1}
        >
            {svgs().iconHomer}
        </button>
    )
}


export default Homer