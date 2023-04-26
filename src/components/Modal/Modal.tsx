import './modal.scss'
import { createPortal } from 'react-dom';
import closeIcon from "../../assets/img/icon_close.svg"


interface IProps {
    visible: boolean
    close: () => void
    children: React.ReactNode
}



const Modal = (props: IProps) => {
    const _modal = document.getElementById('modal') as HTMLElement;

    
    return _modal ? createPortal(
        <div className={props.visible ? "modal-window visible" : "modal-window"}>
            <div className="closer">
                <img src={closeIcon} alt="Close" onClick={props.close}/>
            </div>
			<div className="content">
                {props.children}
            </div>
        </div>,
        _modal    
    ) 
    :
    null
    /*
    <div className="modal-window_absence">
        Node for Modal not found
    </div>
    */
}


export default Modal;