import { useState, forwardRef, useImperativeHandle } from 'react';
import "./message_info.scss"
import { IMessageModal } from 'src/interfaces'
import { clearModalMessage } from 'src/assets/js/consts'




interface IProps {
    buttonText: string
    buttonAction: () => void
}

export interface IMessageInfoFunctions {
    clear: () => void;
    update: (newMessage: IMessageModal) => void;
}


const MessageInfoNew = forwardRef<IMessageInfoFunctions, IProps>(({buttonText, buttonAction}, ref) => {
    useImperativeHandle(ref, () => ({
        clear() {
            clear()
        },
        update(newMessage: IMessageModal) {
            update(newMessage)
        },
    }));


    const [message, setMessage] = useState<IMessageModal>(clearModalMessage)
    
    const clear = () => {
        setMessage(clearModalMessage)
    }

    const update = (newData: IMessageModal) => {
        setMessage(newData)
    }


    return (
        <div className={`message_info__container ${message.status}`}>
            <h3>{message.header}</h3>
            <div className="text-block">
                {message.text.map((currentText,index) => {
                    return <p key={index}>{currentText}</p>
                })}
            </div>
            <button onClick={buttonAction}>{buttonText}</button>
        </div>
    )
})


export default MessageInfoNew