import './modal.scss'
import { createPortal } from 'react-dom';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import svgs from '../additional/svgs';



interface IProps {}

export interface IModal {
    name?: string
    closable?: boolean
    onClose?: () => void
    children: React.ReactNode
}
export interface IModalFunctions {
    openModal: ({name, onClose, closable, children}: IModal) => void;
    closeCurrent: () => void; //close current modal, current modal = modals[0]
    closeName: (name: string) => void; //close all modals with the specified name
    getName: () => Promise<string | null>//get name of current visible modal
    closeAll: () => void//close all modals
}




const ModalNew = forwardRef<IModalFunctions, IProps>(({}, ref) => {
    useImperativeHandle(ref, () => ({
        openModal({name, closable=true, onClose, children}) { 
            setModals(prev => ([...prev, {
                name: name || '',
                closable,
                onClose: onClose ? onClose : close,
                children
            }]))
        },
        closeCurrent() {            
            setModals(prev => prev.slice(1))
        },
        closeName(name) {
            setModals(prev => prev.filter(modal => modal.name !== name))
        },
        getName() {
            return new Promise<string | null>((res) => {
                setModals(prev => {
                    prev[0] ? res(prev[0]?.name || '') : res(null)                   
                    return prev
                })
            }) 
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
        <div className={`modal-window ${modals.length > 0 ? "visible" : ""}`} data-testid='modal'>
            {modals[0]?.closable &&
            <button className="closer" aria-label='close | закрыть' onClick={modals[0]?.onClose ? modals[0]?.onClose : close} data-testid='modal-closer'>
                {svgs().iconClose}
            </button>}

			<div className="modal__content">
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

