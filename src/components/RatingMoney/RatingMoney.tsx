import { useMemo } from 'react'
import './rating-money.scss'

interface IRatingMoney {
    value: number
    max?: number
    text: string
    measurment: string
    fullFormat?: boolean
}

const RatingMoney: React.FC<IRatingMoney> = ({fullFormat=false, value, max=5, text, measurment}): JSX.Element => {
    const amount = fullFormat ? max : value

    const content = useMemo(() => {
        return Array(amount).fill('').map((item, i) => {
            return (
                <div className="img-cont" key={i}>
                    <svg className={i >= value ? "faded" : ``} xmlns="http://www.w3.org/2000/svg" fill="transparent" stroke="#000" viewBox="100 0 300 500">
                        <path strokeWidth="45" d="m119,312c4,70 58,111 130,110c78,1 129,-34 125,-101c-11,-61 -78,-69 -122,-79c-48,-16 -118,-16 -117,-89c-1,-53 59,-84 117,-78c60,1 111,32 112,96"/>
                        <path strokeWidth="35" d="m221,17l0,464m63,0l0,-464"/>
                    </svg>
                </div>
            )
        })
    },[amount]) 


    return (
        <div className="rating_money">
            <div className="rating_money__content">
                {content}
             </div>
            <div className="rating_money__legend">
                <span>{text}<span>{measurment}</span></span>
            </div>
        </div>
    )
}


export default RatingMoney