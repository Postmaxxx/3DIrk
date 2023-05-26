import { useEffect, useRef } from "react"
import './rating-money.scss'

interface IRatingMoney {
    colorValue?: string
    value: number
    max: number
    text: string
    measurment: string
}

const RatingMoney: React.FC<IRatingMoney> = ({colorValue, value, max, text, measurment}): JSX.Element => {
    const _rating = useRef<HTMLDivElement>(null)
    const _value = useRef<HTMLDivElement>(null)
    

    useEffect(() => {
        /*if (!_rating.current || !_value.current) return
        const percent = 100 * value / (max-min);
        _value.current.style.width = `${percent}%`;*/
    }, [])

    return (
        <div className="rating_money" ref={_rating}>
            <div className="money__container">
                {Array(value).fill('').map((item, i) => {
                    return (
                        <div className="img__container" key={i}>
                            <svg className={i >= value ? "faded" : ``} xmlns="http://www.w3.org/2000/svg" fill="transparent" stroke="#000" viewBox="100 0 300 500">
                                <path strokeWidth="45" d="m119,312c4,70 58,111 130,110c78,1 129,-34 125,-101c-11,-61 -78,-69 -122,-79c-48,-16 -118,-16 -117,-89c-1,-53 59,-84 117,-78c60,1 111,32 112,96"/>
                                <path strokeWidth="35" d="m221,17l0,464m63,0l0,-464"/>
                            </svg>
                        </div>
                    )
                })}

            </div>

            <div className="rating__legend">
                <span>{text}<span>{measurment}</span></span>
            </div>
        </div>
    )
}


export default RatingMoney