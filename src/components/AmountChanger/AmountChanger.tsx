import { TLang } from 'src/interfaces'
import './amount-changer.scss'
import { useRef, useEffect, useState, useMemo } from "react";

interface IProps<T> {
    onChange: (idInstance: T, amount: number) => void
    idInstance : T
    lang: TLang,
    initialAmount : number
    reset?: {amount: number}
}

const AmountChanger = <T,>({idInstance, onChange, initialAmount, lang, reset}: IProps<T>): JSX.Element => {

    const [amount, setAmount] = useState<number>(initialAmount)

    
    const changeAmount = (newAmount: number) => {
        const amountToSet = newAmount >= 0 ? newAmount : 0
        setAmount(amountToSet)
        onChange(idInstance, amountToSet)
    }

    const onFocusOut = (newAmount: number) => {
        const amountToSet = newAmount > 0 ? newAmount : 1
        setAmount(amountToSet)
        onChange(idInstance, amountToSet)
    }

    useEffect(() => {
        if (reset) {
            setAmount(reset.amount)          
            onChange(idInstance, reset.amount)
        }
    }, [reset])

    return (
        <div className="amount__changer">
            <button className={amount <= 1 ? "disabled" : ''} aria-label='Decrease amount' onClick={(e) => {e.preventDefault(); amount > 1 && changeAmount(amount > 2 ?  amount - 1 : 1)}}>–</button>
            <input onBlur={(e) => onFocusOut(Number(e.target.value))} type="text" value={amount} onChange={(e) => {e.preventDefault(); changeAmount(Number(e.target.value))}} aria-label={lang === 'en' ? "Enter amount" : 'Введите количество'}/>
            <button aria-label='Increase amount' onClick={(e) => {e.preventDefault(); changeAmount(amount + 1)}}>+</button>
        </div>
    )
}


export default AmountChanger