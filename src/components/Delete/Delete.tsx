import { prevent } from "../../../src/assets/js/processors"
import {  TLang } from "../../interfaces"
import svgs from "../additional/svgs"
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

    const onClick = () => {
        setConfirmation(true)
    }


    const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        onConfirm()
    }

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        onCancel()
    }

    const render = useMemo(() => {
        return (
            disabled ? 
                null
            :
                <div className="button_delete" onClick={onClick} aria-label={lang === 'en' ? "Delete" : 'Удалить'}>
                    {svgs().iconDelete}
                    <div className={`confirmation ${confirmation ? 'active' : ''}`}>
                        <button className="button_delete__confirm" onClick={onDeleteClick}>{lang === 'en' ? 'Delete' : 'Удалить'}</button>
                        <button className="button_delete__cancel" onClick={onCancelClick}>{lang === 'en' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            
        )
    }, [disabled, lang, confirmation])


    return <>
        {render}
    </>
    
}

export default Delete