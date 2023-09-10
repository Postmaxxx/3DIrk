import { IAction, IDispatch, IErrRes, IFetch, TFetchStatus, TLang, TLangText } from "../../interfaces";
import { empty, exceptionTimeout, headerStatus, selector } from "./consts";

//---------------------------------------------------------------

const ratingNumberToText = (value: string, scale: keyof typeof selector) : TLangText => {
    //if (!selector[scale]) {return {en: 'Scale of range', ru: 'Шкала вне диапазона'}}
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
    
    const add = (err: string): void => {errors.push(err)}

    const amount = () => errors.length

    const result = () => ({
        header: lang === 'en' ? 'Errors was found' : 'Найдены ошибки',
        status: 'error',
        text: [...errors]
    })

    const clear = () => {errors.splice(0, errors.length)}

    return { result, add, clear, amount }
}

//---------------------------------------------------------------

const prevent = (e: React.MouseEvent<HTMLElement | HTMLButtonElement> | DragEvent | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
}

//---------------------------------------------------------------

const filesDownloader = async (urls: string[]): Promise<File[]> => {   
      const results = await Promise.allSettled(urls.map(async (url) => {
        const filename = url.substring(url.lastIndexOf('/') + 1)
        const response = await fetch(url)
        const blob = await response.blob()
        const file = new File([blob], filename, { type: blob.type })
        return file;
    }))
    const files: File[] = results
        .filter((result) => result.status === 'fulfilled')
        ?.map((result) => (result as PromiseFulfilledResult<File>).value)
    return files
}



//-----------------------------------------------------------

const filenameChanger = (filename: string) => {
    return filename.replaceAll('_','-')
}


export interface IFetchError {
    dispatch: IDispatch
    setter: <T extends IFetch>(payload: T) => IAction<T>
    comp: TLangText
    e: unknown
    controller: AbortController
}

const fetchError = ({dispatch, setter, comp, e, controller}: IFetchError) => {
    if ((e as Error).name !== 'AbortError') {
        return dispatch(setter({status: 'error', message: {en:`${comp.en}: ${(e as Error).name}`, ru: `${comp.ru}: ${(e as Error).name}`}}))
    }
    if ((e as Error).name === 'AbortError') {
        if (controller.signal.reason.name === exceptionTimeout.name) {
            return dispatch(setter({status: 'error', message: {en:`${comp.en}: server response timeout`, ru: `${comp.ru}: таймаут ответа от сервера`}}))
        }
        return dispatch(setter({status: 'error', message: {en:`${comp.en}: request aborted`, ru: `${comp.ru}: запрос отменен`}}))
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


const deepCopy = <T extends {}>(objToCopy: T): T  => {
    return structuredClone(objToCopy)
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


    const create = ({container='#root', itemsSelector='[data-selector="input"]'}: {container?: string | HTMLElement | HTMLFormElement, itemsSelector?: string}) => {
        if (typeof container === 'string') {
            focusableElements.splice(0, focusableElements.length, ...(document.querySelector(container)?.querySelectorAll(itemsSelector) || []) as HTMLElement[])
        }
        if (container instanceof HTMLElement) {
            focusableElements.splice(0, focusableElements.length, ...(container.querySelectorAll(itemsSelector) || []) as unknown as HTMLElement[])
        }
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


const resErrorFiller = (result: IErrRes) => {
    return {
        status: 'error' as TFetchStatus, 
        message: {...(result as IErrRes).message} || {...empty}, 
        errors: result.errors ? [...result.errors] : []
    }
}


const checkIfNumbers = (value: string) => {
    return /^[0-9]*$/.test(value)
}

const checkIfEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+[^.]$/.test(value)
}

const checkIfPhone = (value: string) => {
    return /^\+?[0-9]*$/.test(value)
}



const debounce = (cb: Function, delay = 1000) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}



export { ratingNumberToText, errorsChecker, prevent, filenameChanger,  modalMessageCreator, 
    focusMover, deepCopy, resErrorFiller, checkIfNumbers, checkIfEmail, checkIfPhone, fetchError, filesDownloader,
    debounce}