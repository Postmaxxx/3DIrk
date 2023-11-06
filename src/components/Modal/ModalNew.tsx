import './modal.scss'
import { createPortal } from 'react-dom';
import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import svgs from '../additional/svgs';
import { lockFocusInside } from '../../assets/js/processors';



interface IProps {}

export interface IModal {
    name?: string
    closable?: boolean
    onClose?: () => void
    children: React.ReactNode
    closeOnEsc?: boolean
}
export interface IModalFunctions {
    openModal: ({name, onClose, closable, children, closeOnEsc}: IModal) => void;
    closeCurrent: () => void; //close current modal, current modal = modals[0]
    closeName: (name: string) => void; //close all modals with the specified name
    getName: () => Promise<string | null>//get name of current visible modal
    closeAll: () => void//close all modals
    contentChanged: () => void //if content changed
}




const ModalNew = forwardRef<IModalFunctions, IProps>(({}, ref) => {
    useImperativeHandle(ref, () => ({
        openModal({name, closable=true, onClose, closeOnEsc=true, children}) { 
            setModals(prev => ([...prev, {
                name: name || '',
                closable,
                closeOnEsc,
                onClose: onClose ? onClose : closeCurrent,
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
        contentChanged() {
            contentChanged()
        }
    }));


    const [modals, setModals] = useState<IModal[]>([])
    const _modal = document.getElementById('modal') as HTMLElement;
    const focuser = useRef<ReturnType<typeof lockFocusInside>>()
    const _modalContent = useRef<HTMLDivElement>(null)


    const closeCurrent = () => {
        setModals(prev => prev.slice(1))
    }

    const contentChanged = () => {
        if (_modalContent.current) {
            focuser.current?.destroy()
            focuser.current = lockFocusInside({_element: _modalContent.current, _delayer: _modalContent.current})
            focuser.current.focusOn(0)
        }
    }

    const keyPressed = (e: KeyboardEvent) => {
        if (e.code === 'Escape' && modals[0].closeOnEsc) {
            return setModals(prev => prev.slice(1))
        }
    };


    useEffect(() => {
        if (!modals[0]?.children) return       
        
        if (_modalContent.current) {           
            _modalContent.current.addEventListener("keydown", keyPressed);
            focuser.current?.destroy()
            focuser.current = lockFocusInside({_element: _modalContent.current, _delayer: _modalContent.current})
        } 
        return () => {
            _modalContent.current?.removeEventListener("keydown", keyPressed);
            focuser.current?.destroy()
        }
        
    }, [modals[0]?.children])
    



    return _modal ? createPortal(
        <div className={`modal-window ${modals.length > 0 ? "visible" : ""}`} data-testid='modal' ref={_modalContent}>
            {modals[0]?.closable &&
                <button className="closer" aria-label='close | закрыть' onClick={modals[0]?.onClose ? modals[0]?.onClose : close} data-testid='modal-closer'>
                    {svgs().iconClose}
                </button>
            }

			<div className="modal__content">
                {modals[0]?.children}
            </div>
        </div>,
        _modal    
    ) 
    :
    <div className="modal-window_absence">
        App error, node for modal windows was not found
    </div>

})


export default ModalNew;

