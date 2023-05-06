import './modal.scss'
import { createPortal } from 'react-dom';
import closeIcon from "../../assets/img/icon_close.svg"
import { useEffect } from 'react';


interface IProps {
    visible: boolean
    escExit: boolean
    close: () => void
    children: React.ReactNode
}



const Modal: React.FC<IProps> = ({visible, escExit, close, children}) => {
    const _modal = document.getElementById('modal') as HTMLElement;

    const modalKeyListener = (e: KeyboardEvent) => {
        escExit && e.keyCode === 27 && close();
    }

    useEffect(() => {
        document.addEventListener("keyup", modalKeyListener);
        return () => {
            document.removeEventListener("keyup", modalKeyListener);
        }
    }, [])

    return _modal ? createPortal(
        <div className={visible ? "modal-window visible" : "modal-window"}>
            <div className="closer">
                <img src={closeIcon} alt="Close" onClick={close}/>
            </div>
			<div className="content">
                {visible ? children : null}
            </div>
        </div>,
        _modal    
    ) 
    :
    <div className="modal-window_absence">
        Node for Modal not found
    </div>

}


export default Modal;