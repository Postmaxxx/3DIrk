import { useState, useEffect, useRef } from 'react'
import "./message_info.scss"




interface IProps {
    header: string
    text: string[]
    buttonText: string
    buttonAction: () => void
}

const MessageInfo = ({header, text, buttonText, buttonAction}: IProps) => {

    useEffect(() => {

    }, [])

    
    return (
        <div className="message_info__container">
            <h3>{header}</h3>
            <div className="text-block">
                {text.map((currentText,index) => {
                    return <p key={index}>{currentText}</p>
                })}
            </div>
            <button onClick={buttonAction}>{buttonText}</button>
        </div>
    )
}


export default MessageInfo