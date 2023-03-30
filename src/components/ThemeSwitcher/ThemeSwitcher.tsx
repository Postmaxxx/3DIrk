import "./themeSwitcher.scss"
import { useEffect, useState } from "react";



const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');
    const _body = document.querySelector('body') as HTMLElement;

    const handleChange= () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    useEffect(() => {
        theme === "light" ? _body.classList.remove('dark') : _body.classList.add('dark')
    }, [theme])


    return (
        <div className="theme-switcher">
            <label aria-label='switch the site theme'>
                <input type="checkbox" onClick={handleChange}/>
            </label>
        </div>
        )
}



export default ThemeSwitcher
