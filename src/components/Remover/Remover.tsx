import { prevent } from "../../assets/js/processors"
import {  TLang } from "../../interfaces"
import svgs from "../additional/svgs"
import './remover.scss'
import { useMemo, useState } from 'react'

interface IProps<T> {
    remove: (idInstance: T) => void
    idInstance : T
    lang: TLang
    disabled: boolean
}

const Remover = <T,>({remove, idInstance, lang, disabled}: IProps<T>):JSX.Element => {
    const [confirmation, setConfirmation] = useState<boolean>(false)

    const onCancel = () => {
        setConfirmation(false);
    }

    const onClick = () => {
        setConfirmation(true)
    }


    const onConfirmClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        prevent(e)
        setConfirmation(false)
        remove(idInstance)
    }

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        prevent(e)
        onCancel()
    }

    const _remover = useMemo(() => {
        return (
            disabled ? 
                null
            :
                <div className="remover" onClick={onClick} aria-label={lang === 'en' ? "Delete item" : 'Удалить объект'} tabIndex={0} onKeyDown={e => {e.code === 'Enter' && onClick()}}>
                    {svgs().iconDelete}
                    <div className={`remover__confirmation ${confirmation ? 'visible' : ''}`}>
                        <button className="remover__confirm" onClick={onConfirmClick} tabIndex={confirmation ? 0 : -1} onKeyDown={e => {e.code === 'Enter' && onConfirmClick(e)}}>{lang === 'en' ? 'Delete' : 'Удалить'}</button>
                        <button className="remover__cancel" onClick={onCancelClick} tabIndex={confirmation ? 0 : -1} onKeyDown={e => {e.code === 'Enter' && onCancelClick(e)}}>{lang === 'en' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            
        )
    }, [disabled, lang, confirmation])


    return <>
        {_remover}
    </>
    
}

export default Remover