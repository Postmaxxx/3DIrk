import './modal.scss'
import { createPortal } from 'react-dom';
import { useState, forwardRef, useImperativeHandle } from 'react';



interface IProps {}

export interface IModal {
    name?: string
    onClose?: () => void
    children: React.ReactNode
}


export interface IModalFunctions {
    openModal: ({name, onClose, children}: IModal) => void;
    closeCurrent: () => void; //close current modal, current modal = modals[0]
    closeName: (name: string) => void; //close all modals with the specified name
    getName: () => string | null//get name of current visible modal
    closeAll: () => void//close all modals
}



const ModalNew = forwardRef<IModalFunctions, IProps>(({}, ref) => {
    useImperativeHandle(ref, () => ({
        openModal({name, onClose, children}) {
            setModals(prev => ([...prev, {
                name: name || '',
                onClose: onClose ? onClose : close,
                children: children
            }]))

        },
        closeCurrent() {
            setModals(prev => prev.slice(1))
        },
        closeName(name) {
            setModals(prev => prev.filter(modal => modal.name !== name))
        },
        getName() {
            return modals[0].name || null
        },
        closeAll() {
            setModals([])
        },
    }));


    const [modals, setModals] = useState<IModal[]>([])
    const _modal = document.getElementById('modal') as HTMLElement;



    const close = () => {
        setModals(prev => prev.slice(1))
    }

    

    return _modal ? createPortal(
        <div className={modals.length > 0 ? "modal-window visible" : "modal-window"}>
            <button className="closer" aria-label='close | закрыть' onClick={modals[0]?.onClose ? modals[0]?.onClose : close}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" stroke="#979797" clipRule="evenodd" d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31Z" strokeWidth="2"/>
                    <path d="M9 9L24 24"  strokeWidth="2" strokeLinecap="square"/>
                    <path d="M8.49512 23.4586L24.5049 9.54144"  strokeWidth="2" strokeLinecap="square"/>
                </svg>
            </button>
			<div className="content">
                {modals[0]?.children}
            </div>
        </div>,
        _modal    
    ) 
    :
    <div className="modal-window_absence">
        Node for modal windows was not found
    </div>

})


export default ModalNew;

