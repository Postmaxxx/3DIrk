import "./message.scss"


interface IProps {
    buttonAdd?: {
        text: string,
        action: () => void
    }
    buttonClose?: {
        text: string,
        action: () => void
    }
    header?: string
    text?: string
    status?: string
}


const MessageNew: React.FC<IProps> = ({buttonAdd, buttonClose, header, status, text}): JSX.Element => {
    return (
        <div className={`message__container ${status || ''}`}>
            <h3>{header || ''}</h3>
            <div className="text-block">
                {text || ''}
            </div>
            {buttonAdd && <button onClick={buttonAdd?.action}>{buttonAdd?.text}</button>}
            {buttonClose && <button onClick={buttonClose?.action}>{buttonClose?.text}</button>}
        </div>
    )
}

export default MessageNew