import { useRef } from 'react'
import './homer.scss'


const Homer = () => {

    const _homer = useRef<HTMLDivElement>(null)


    window.onscroll = () => {
        scrollHomer()
    };

    function scrollHomer() {
        if (!_homer.current) return
		if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
			_homer.current.classList.add("show");
		} else {
			_homer.current.classList.remove("show")
		}
    }

    const onHomerClicked = () => {
        document.body.scrollTop = 0; // For Safari
          	document.documentElement.scrollTop = 0;

    }

    


    return (
        <div className='homer' onClick={onHomerClicked} ref={_homer}>
            <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
            </svg>
        </div>
    )
}


export default  Homer