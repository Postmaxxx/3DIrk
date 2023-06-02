import './offline.scss'
import React from 'react'
import { TLang } from '../../../interfaces'

interface IOffline {
    lang: TLang
}

const P404: React.FC<IOffline> = ({lang}): JSX.Element => {

    return (
        <div className="offline">
            <div className="container">
                <span>{lang === 'en' ? 'Unable to connect to the Internet' : 'Невозможно подключиться к Интернет'}:</span>
            </div>
        </div>
    )
}


export default P404