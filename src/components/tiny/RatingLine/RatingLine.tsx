import { useEffect, useRef } from "react"
import './rating-line.scss'

interface IRatingLine {
    colorValue?: string
    value: number
    min: number
    max: number
}

const RatingLine: React.FC<IRatingLine> = ({colorValue, value, min, max}): JSX.Element => {
    const _rating = useRef<HTMLDivElement>(null)
    const _value = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (!_rating.current || !_value.current) return
        const percent = 100 * value / (max-min);
        _value.current.style.width = `${percent}%`;
        /*if (colorValue) {
            _value.current.style.backgroundColor = colorValue
        }*/
    }, [])

    return (
        <div className="rating_value" ref={_rating}>
            <div className={`rating__value color_${colorValue}`} ref={_value}></div>

            <div className="border_inner border_inner_1"></div>
            <div className="border_inner border_inner_2"></div>
            <div className="border_inner border_inner_3"></div>
            <div className="border_inner border_inner_4"></div>
        </div>
    )
}


export default RatingLine