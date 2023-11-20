import { IAction, IDispatch, IErrRes, IFetch, TFetchStatus, TLang, TLangText } from "../../interfaces";
import { empty, exceptionTimeout, headerStatus, selector, inputsProps } from "./consts";
//---------------------------------------------------------------

const ratingNumberToText = (value: string, scale: keyof typeof selector) : TLangText => {
    //if (!selector[scale]) {return {en: 'Scale of range', ru: 'Шкала вне диапазона'}}
    return selector[scale].find(item => item.value === value)?.name || {en: 'Value out of range', ru: 'Значение вне диапазона'}
}


//---------------------------------------------------------------

const prevent = (e: React.MouseEvent<HTMLElement | HTMLButtonElement> | DragEvent | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLButtonElement>): void => {
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

const filenameChanger = (filename: string): string => {
    return filename.replaceAll('_','-')
}


export interface IFetchError {
    dispatch: IDispatch
    setter: <T extends IFetch>(payload: T) => IAction<T>
    comp: TLangText
    e: unknown
    controller: AbortController
}

const fetchError = ({dispatch, setter, comp, e, controller}: IFetchError): void => {
    if ((e as Error).name !== 'AbortError') {
        dispatch(setter({status: 'error', message: {en:`${comp.en}: ${(e as Error).name}`, ru: `${comp.ru}: ${(e as Error).name}`}}))
        return
    }
    if ((e as Error).name === 'AbortError') {
        if (controller?.signal?.reason?.name === exceptionTimeout.name) {
            dispatch(setter({status: 'error', message: {en:`${comp.en}: server response timeout`, ru: `${comp.ru}: таймаут ответа от сервера`}}))
            return 
        }
        dispatch(setter({status: 'idle', message: {en:`${comp.en}: request aborted`, ru: `${comp.ru}: запрос отменен`}}))
        return 
    }
}


interface IModalMessageCreatorOutput {
    header: string
    status: TFetchStatus
    text: string[]
}

const modalMessageCreator = (source: IFetch, lang: TLang): IModalMessageCreatorOutput  => { //create all keys for Message
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





/*
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


    const create = ({container='#root', itemsSelector='[data-selector="input"]'}: {container?: string | HTMLElement, itemsSelector?: string}) => {
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
*/
interface IResErrorFillerOutput {
    status: TFetchStatus 
    message: TLangText
    errors: TLangText[]
}

const resErrorFiller = (result: IErrRes): IResErrorFillerOutput => {
    return {
        status: 'error' as TFetchStatus, 
        message: {...(result as IErrRes).message} || {...empty}, 
        errors: result.errors ? [...result.errors] : []
    }
}


const checkIfNumbers = (value: string): boolean => {
    return /^[0-9]*$/.test(value)
}

const checkIfEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+[^.]$/.test(value)
}

const checkIfPhone = (value: string): boolean => {
    return /^\+?[0-9]+$/.test(value)
}



const debounce = (cb: Function, delay = 1000): (...args: any[]) => void => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

const makeDelay = (delay: number = 0): Promise<string> => {
    return new Promise((res) => {
        setTimeout(() => res(`Timeout ${delay}ms has been finished`), delay)
    })    
}



export interface IInputChecker {
    value: string
    rules: {
        min? :number
		max?: number
        exact?: string
        notExact?: string
        valueMin?: number
        valueMax?: number
        type?: "email" | "numbers" | "phone" | "date",
        notEmpty?: boolean
    }
}


const inputChecker = ({value, rules}:  IInputChecker): TLangText | null => {
    if (rules.notEmpty && (value.length === 0)) {
        return {en: `no value`, ru: `нет значения`}
    }
    if ((typeof(rules.min) !== 'undefined') && (value.length < rules.min)) {
        return {en: `length < ${rules.min}`, ru: `длина < ${rules.min}`}
    }
    if ((typeof(rules.max) !== 'undefined') && (value.length > rules.max)) {
        return {en: `length > ${rules.max}`, ru: `длина > ${rules.max}`}
    }
    if ((typeof(rules.valueMin) !=='undefined') && (+value < rules.valueMin)) {
        return {en: `value < ${rules.valueMin}`, ru: `значение < ${rules.valueMin}`}
    }
    if ((typeof(rules.valueMax) !=='undefined') && (+value > rules.valueMax)) {
        return {en: `value > ${rules.valueMax}`, ru: `значение > ${rules.valueMax}`}
    }
    if (rules.exact  && (value !== rules.exact)) {
        return {en: `doesn't match`, ru: `не совпадает`}
    }
    if (rules.notExact  && (value === rules.notExact)) {
        return {en: `shouldn't be ${rules.notExact}`, ru: `не должно быть ${rules.notExact}`}
    }
    if (rules.type  && (rules.type === 'numbers' && !checkIfNumbers(value))) {
        return {en: `numbers only`, ru: `только цифры`}
    }
    if (rules.type  && (rules.type === 'email' && !checkIfEmail(value))) {
        return {en: `wrong format`, ru: `неверный формат`}
    }
    if (rules.type  && (rules.type === 'phone' && !checkIfPhone(value))) {
        return {en: `wrong format`, ru: `неверный формат`}
    }
    if (rules.type  && rules.type === 'date') {
        const inputDate = new Date(value)
        if ((String(inputDate) === 'Invalid Date') || inputDate < inputsProps.date.min || inputDate > inputsProps.date.max) {
            return {en: `wrong value`, ru: `неправильное значение`}
        }
    }
    return null
}




const getSelectableElements = (_parent: HTMLElement | null): HTMLElement[] => {
    if (!_parent) return []
    const selectableElements = 'a[href]:not([tabindex="-1"]), button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    return Array
        .from(_parent.querySelectorAll(selectableElements) || [])
        .filter(
            el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
        ) as HTMLElement[]
}



interface ILockFocusInside {
    _element: HTMLElement
    _delayer?: HTMLElement
    initialFocused?: number
    returnFocus?: boolean
}

interface ILockFocusInsideOutput {
    focusNext: () => void;
    focusPrev: () => void;
    destroy: () => void;
    focusOn: (index: number) => void;
    rebuild: () => void;
}

const lockFocusInside = ({_element, _delayer, initialFocused = 0, returnFocus = true}: ILockFocusInside): ILockFocusInsideOutput => {
    let selected = initialFocused
    let focusableEls = getSelectableElements(_element)
    const _prevFocusedElement = document.activeElement as HTMLElement
    
    const focusOn = () => {
        focusableEls[selected]?.focus()
        _delayer?.removeEventListener('transitionend', focusOn)
    }
    
    _delayer?.addEventListener('transitionend', focusOn)
    
    
    
    const keyPressed = (e: KeyboardEvent) => {              
        if (e.code !== 'Tab') return
       
        e.preventDefault();
        if (!e.shiftKey) {
            selected++;
            (selected > focusableEls.length - 1) && (selected = 0);
        } else {        
            selected--;
            (selected < 0) && (selected = focusableEls.length - 1);
        }       
        focusableEls[selected].focus()
        e.stopPropagation()
    };

    _element.addEventListener("keydown", keyPressed);
    return {
        focusNext: () => {
            selected++;
            (selected > focusableEls.length - 1) && (selected = 0);
            focusableEls[selected].focus()
        },
        focusPrev: () => {
            selected--;
            (selected < 0) && (selected = focusableEls.length - 1);
            focusableEls[selected].focus()
        },
        destroy: () => {
            _element.removeEventListener("keydown", keyPressed);
            if (returnFocus && _prevFocusedElement) {
                _prevFocusedElement.focus()
            }
        },
        focusOn: (index: number) => {
            focusableEls[index]?.focus()
        },
        rebuild: () => {
            const element = focusableEls[selected]
            focusableEls = getSelectableElements(_element)
            focusableEls.forEach((el, i) => {
                if (el === element) {
                    el.focus();
                    selected = i;
                }
            })
            
        }
    }
}



const moneyRatingToText = (value: number): TLangText => {
    switch (value) {
        case 1:
            return {en: 'Very cheap', ru: 'Очень дешевый'}
        case 2:
            return {en: 'Cheap', ru: 'Дешевый'}
        case 3:
            return {en: 'Average', ru: 'Средний'}
        case 4:
            return {en: 'Expensive', ru: 'Дорогой'}
        case 5:
            return {en: 'Very expensive', ru: 'Очень дорогой'}
        default:
            return {en: 'Out of range', ru: 'Вне диапазона'}
    }
}

export { ratingNumberToText,  prevent, filenameChanger,  modalMessageCreator, 
    deepCopy, resErrorFiller, checkIfNumbers, checkIfEmail, checkIfPhone, fetchError, filesDownloader,
    debounce, makeDelay, inputChecker, getSelectableElements, lockFocusInside, moneyRatingToText}