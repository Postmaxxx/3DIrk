import { IFetch, TLang, TLangText } from "../../interfaces";
import { gapBetweenRequests, headerStatus, selector } from "./consts";

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

    const check = (el:  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement , min = 0, max = 1000): {result: boolean, error: string} => {
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
        header: lang === 'en' ? 'Errors was found' : 'Найдены ошибки',
        status: 'error',
        text: [...errors]
    })

    const clear = () => {errors.splice(0, errors.length)}

    return { check, result, add, clear, clearError, amount }
}

//---------------------------------------------------------------

const prevent = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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


const modalMessageCreator = (source: IFetch, lang: TLang) => { //create all keys for Message
    const errors: string[] = source.errors?.map(e => e[lang]) || []
    return {
        header: headerStatus[source.status as "success" | "error"][lang],
        status: source.status,
        text: [source.message[lang], ...errors]
    }
}

export interface IFocusNext {
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    parent: string //selector for Element to search inside
    items: string //selector for elements to focus on
}





const focusMover = () => {
    const focusableElements: HTMLElement[] = []
    
    const next = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation()
        if (focusableElements.length < 2) return
        if (e.key === 'Enter') {
            e.preventDefault()
            const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
        }
    }

    const focusAll = () => {            
        if (focusableElements.length < 1) return
        if (focusableElements.length === 1) { //if only 1 element, provoke execution onBlur
            focusableElements[0].focus()
            focusableElements[0].blur()
            focusableElements[0].focus()
            return
        }
        for (let el = 0; el < focusableElements.length + 1; el++) { //add 1 to focus from last to first element
            const nextIndex = (el) % focusableElements.length;           
            focusableElements[nextIndex].focus();
        }
    }

    const create = ({container='#root', itemsSelector='[data-selector="input"]'}: {container: string, itemsSelector?: string}) => {
        focusableElements.splice(0, focusableElements.length, ...(document.querySelector(container)?.querySelectorAll(itemsSelector) || []) as HTMLElement[])
        focusableElements.sort((a, b) => a.tabIndex - b.tabIndex);
    }

    const clear = () => {
        focusableElements.splice(0, focusableElements.length)
    }

    const  length = () => {
        return focusableElements.length
    }

    return {create, clear, next, length, focusAll}
}


export { ratingNumberToText, errorsChecker, prevent, filenameChanger, checkAndLoad, modalMessageCreator, focusMover}