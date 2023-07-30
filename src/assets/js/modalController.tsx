/*import {useState} from 'react'
import { createPortal } from 'react-dom'



const createModal = (name: string) => {
    const [children, setChildren] = useState<React.ReactNode>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [owner, setOwner] = useState<string>('')
    const _modal = document.getElementById('modal') as HTMLElement;


    const close = () => {
        setChildren(null)
        setVisible(false)
    }

    
    const open = (owner?: string) => {
        setVisible(true)
        setOwner(owner || '')
    }


    const getOwner = () => {
        return owner
    }



    _modal && createPortal(
        <div className={visible ? "modal-window visible" : "modal-window"}>
            <button className="closer" aria-label='close | закрыть' onClick={onClose ? onClose : close}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" stroke="#979797" clipRule="evenodd" d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31Z" strokeWidth="2"/>
                    <path d="M9 9L24 24"  strokeWidth="2" strokeLinecap="square"/>
                    <path d="M8.49512 23.4586L24.5049 9.54144"  strokeWidth="2" strokeLinecap="square"/>
                </svg>
            </button>
            <div className="content">
                {children}
            </div>
        </div>,
        _modal    
    )


    return {close, open, setChildren, getOwner}

}

export default {createModal}*/