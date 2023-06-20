import { TLang, TLangText } from "src/interfaces";
import { selector } from "../data/selectorValues";

//---------------------------------------------------------------

const ratingNumberToText = (value: string, scale: keyof typeof selector) : TLangText => {
    if (!selector[scale]) {return {en: 'Scale of range', ru: 'Шкала вне диапазона'}}
    return selector[scale].find(item => item.value === value)?.name || {en: 'Value out of range', ru: 'Значение вне диапазона'}
}

//---------------------------------------------------------------

interface IErrorsChecker {
    lang: TLang,
    min?: number
    max?: number
}

const errorsChecker = ({lang = 'en', min = 0, max = 1000}: IErrorsChecker) => {
    const errors: string[] = []

    const check = (el:  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): {result: boolean, error: string} => {
        const err = {result: false, error: ''}
        if (el.value && el.value.length >= min && el.value.length <= max) return err // no error
        
        err.result = true
        if (el.value.length < min) {
            err.error = `${el.dataset[lang]} ${lang === 'en' ? `is shorter than ${min} symbols` : `меньше ${min} симв.`}`
        }
        if (el.value.length > max) {
            err.error = `${el.dataset[lang]} ${lang === 'en' ? `is longer than ${min} symbols` : `больше ${min} симв.`}`
        }
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.parentElement?.classList.add('error')
        }
        if (el.tagName === 'SELECT') {
            el.parentElement?.parentElement?.classList.add('error')
        }
        errors.push(err.error)
        return err //error exists
    }

    const add = (err: string): void => {errors.push(err)}

    const result = (): string[] => errors

    const clear = () => {errors.splice(0, errors.length)}

    return { check, result, add, clear }
}

//---------------------------------------------------------------

const prevent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
}

//---------------------------------------------------------------



export { ratingNumberToText, errorsChecker, prevent }