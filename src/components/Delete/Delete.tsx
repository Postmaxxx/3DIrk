import {  TLang } from "../../interfaces"
import './delete.scss'
import { useMemo, useState } from 'react'

interface IProps<T> {
    remove: (idInstance: T) => void
    idInstance : T
    lang: TLang
    disabled: boolean
}

const Delete = <T,>({remove, idInstance, lang, disabled}: IProps<T>):JSX.Element => {

    const [confirmation, setConfirmation] = useState<boolean>(false)

            
    const onCancel = () => {
        setConfirmation(false);
    }

    const onConfirm = () => {
        setConfirmation(false)
        remove(idInstance)
    }

    const onDelete = () => {
        setConfirmation(true)
    }


    const render = useMemo(() => {
        return (
            disabled ? 
                null
            :
                <div className="button_delete__container" onClick={onDelete} aria-label={lang === 'en' ? "Delete" : 'Удалить'}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000">
                        <path d="M262.7,101.9c0-33.8,12.1-45.9,45.9-45.9h382.8c33.8,0,45.9,12.1,45.9,45.9v23.6h45.9V71.3c0-33.8-27.4-61.3-61.3-61.3H278c-33.8,0-61.3,27.4-61.3,61.3v54.2h45.9V101.9z"/>
                        <path d="M959.4,148.5H40.6c-16.9,0-30.6,10.3-30.6,23s13.7,23,30.6,23h918.8c16.9,0,30.6-10.3,30.6-23S976.3,148.5,959.4,148.5z"/>
                    </svg>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000">
                        <path d="M728.7,913.4c0,16.9-13.7,30.6-30.6,30.6H300c-16.9,0-30.6-13.7-30.6-30.6L192.8,239h-45.9l76.6,720.3c0,16.9,13.7,30.6,30.6,30.6h490c16.9,0,30.6-13.7,30.6-30.6L851.2,239h-45.9L728.7,913.4z"/>
                        <path d="M366,882.8c12.7,0,23-13.7,23-30.6L343,300.9c0-16.9-10.3-30.6-23-30.6s-23,13.7-23,30.6L343,852.2C343,869.1,353.3,882.8,366,882.8z"/>
                        <path d="M524.9,852.2V300.9c0-16.9-10.3-30.6-23-30.6c-12.7,0-23,13.7-23,30.6v551.3c0,16.9,10.3,30.6,23,30.6C514.6,882.8,524.9,869.1,524.9,852.2z"/>
                        <path d="M660.8,852.2l45.9-551.3c0-16.9-10.3-30.6-23-30.6s-23,13.7-23,30.6l-45.9,551.3c0,16.9,10.3,30.6,23,30.6S660.8,869.1,660.8,852.2z"/>
                    </svg>
                    <div className={`confirmation__container ${confirmation ? 'active' : ''}`}>
                        <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); onConfirm()}}>{lang === 'en' ? 'Delete' : 'Удалить'}</button>
                        <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); onCancel()} }>{lang === 'en' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            
        )
    }, [disabled, lang, confirmation])


    return <>
        {render}
    </>
    
}

export default Delete