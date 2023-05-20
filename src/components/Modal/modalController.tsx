import './modal.scss'
import { createPortal } from 'react-dom';
import closeIcon from "../../assets/img/icon_close.svg"
import { useEffect, useState } from 'react';


interface IProps {
    onClose: () => void
    children: React.ReactNode
}



const ModalController = ({onClose, children}: IProps) => {
    const _modal = document.getElementById('modal') as HTMLElement;
    const [visible, setVisible] = useState<boolean>(false)
    
    
    const hide = () => {
        setVisible(false)
        console.log('hide');
        
    }


    const show = () => {
        setVisible(true)
        console.log('show');
        
    }



    const create = () => createPortal(
        <div className={visible ? "modal-window visible" : "modal-window"}>
            <div className="closer">
                <img src={closeIcon} alt="Close" onClick={onClose}/>
            </div>
			<div className="content">
                {visible ? children : null}
            </div>
        </div>,
        _modal    
    ) 

        create()




    return {
        show,
        hide,
        create
    }

    /*
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
*/
}


export default ModalController;