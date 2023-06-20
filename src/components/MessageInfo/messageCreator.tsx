import { IMessageModal } from "src/interfaces"
import "./message_info.scss"
import {  useRef, useMemo, FC, useEffect, useState, useCallback, memo } from "react";
import { clearModalMessage } from "src/assets/js/consts";


interface IProps {
    buttonText: string
    buttonAction: () => void
}



const messageCreator = ({buttonText, buttonAction}: IProps) => {
    const [message, setMessage] = useState<IMessageModal>(clearModalMessage)

    const create = () =>         
        <div className={`message_info__container ${message.status}`}>
            <h3>{message.header}</h3>
            <div className="text-block">
                {message.text.map((currentText, index) => {
                    return <p key={index}>{currentText}</p>
                })}
            </div>
            <button onClick={buttonAction}>{buttonText}</button>
        </div>


    const update = (newData: IMessageModal) => {
        setMessage(newData)
    }


    return {create, update}
}


export { messageCreator }