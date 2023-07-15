import { IFetch, TLang, TLangText } from "../../interfaces";
import { gapBetweenRequests, selector } from "./consts";

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

const errorsChecker = ({lang = 'en'}: IErrorsChecker) => {
    const errors: string[] = []

    const check = (el:  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLSelectElement, min = 0, max = 1000): {result: boolean, error: string} => {
        const err = {result: false, error: ''}
        if (el.value.length >= min && el.value.length <= max) return err // no error
        
        err.result = true
        if (el.value.length < min) {
            err.error = `${el.dataset[lang]} ${lang === 'en' ? `is shorter than ${min} symbols` : `меньше ${min} симв.`}`
        }
        if (el.value.length > max) {
            err.error = `${el.dataset[lang]} ${lang === 'en' ? `is longer than ${max} symbols` : `больше ${max} симв.`}`
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

    const clearError = (el:  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLSelectElement) => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.parentElement?.classList.remove('error')
        }
        if (el.tagName === 'SELECT') {
            el.parentElement?.parentElement?.classList.remove('error')
        }
    }

    
    const add = (err: string): void => {errors.push(err)}

    const amount = () => errors.length

    const result = () => ({
        header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
        status: 'error',
        text: [...errors]
    })

    const clear = () => {errors.splice(0, errors.length)}

    return { check, result, add, clear, clearError, amount }
}

//---------------------------------------------------------------

const prevent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
}

//---------------------------------------------------------------


const filenameChanger = (filename: string) => {
    return filename
        .replaceAll('_','-')
}



const checkAndLoad = (checkValue: IFetch["status"], loadFunc: () => void) => {
    if (checkValue === 'idle') {
        loadFunc()
    }
    if (checkValue === 'error') {            
        setTimeout(() => {loadFunc()}, gapBetweenRequests)
    }
}


export { ratingNumberToText, errorsChecker, prevent, filenameChanger, checkAndLoad }