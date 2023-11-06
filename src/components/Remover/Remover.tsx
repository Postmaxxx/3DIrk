import { lockFocusInside, prevent } from "../../assets/js/processors"
import {  TLang, TLangText } from "../../interfaces"
import svgs from "../additional/svgs"
import './remover.scss'
import { useEffect, useMemo, useState, useRef } from 'react'

interface IProps<T> {
    remove: (idInstance: T) => void
    idInstance : T
    lang: TLang
    disabled: boolean
    labelText?: TLangText
}

const Remover = <T,>({remove, idInstance, lang, disabled, labelText}: IProps<T>):JSX.Element => {
    const [confirmation, setConfirmation] = useState<boolean>(false)
    const _remover = useRef<HTMLDivElement | null>(null)
    const _removerConfirm = useRef<HTMLDivElement | null>(null)
    const focuser = useRef<ReturnType<typeof lockFocusInside>>()

    
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

    useEffect(() => {
        if (confirmation && _remover.current && _removerConfirm.current) {
            focuser.current?.destroy()
            focuser.current = lockFocusInside({_element: _remover.current, _delayer: _removerConfirm.current})
        } else {          
            focuser.current?.destroy()
        }
    }, [confirmation])


    const content = useMemo(() => {
        return (
            disabled ? 
                null
            :
                <div 
                    className="remover button_nostyle" 
                    ref={_remover}
                    onClick={onClick} 
                    role="button"
                    aria-label={lang === 'en' ? labelText?.en || "Delete this item" : labelText?.ru || 'Удалить этот объект'} 
                    tabIndex={0} 
                    onKeyDown={e => {e.code === 'Enter' && onClick()}}
                >
                    {svgs().iconDelete}
                    <div className={`remover__confirmation ${confirmation ? 'visible' : 'eee'}`} ref={_removerConfirm}>
                        <button className="remover__confirm" onClick={onConfirmClick} tabIndex={confirmation ? 0 : -1} onKeyDown={e => {e.code === 'Enter' && onConfirmClick(e)}}>{lang === 'en' ? 'Delete' : 'Удалить'}</button>
                        <button className="remover__cancel" onClick={onCancelClick} tabIndex={confirmation ? 0 : -1} onKeyDown={e => {e.code === 'Enter' && onCancelClick(e)}}>{lang === 'en' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            
        )
    }, [disabled, lang, confirmation])


    return <>
        {content}
    </>
    
}

export default Remover