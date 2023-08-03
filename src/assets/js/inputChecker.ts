import { TLang } from "../../interfaces"
import { inputsProps } from "./consts"
import { checkIfEmail, checkIfNumbers, checkIfPhone } from "./processors"


type TInputs = "email" | "numbers" | "phone" | "date"
interface IInputChecker {
    el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    min?: number //length
    max?: number //length
    type?: TInputs 
    exact?: string //if proveided value must be the same
    lang: TLang
    notExact?: string
    orEmpty?: boolean
}

const inputChecker = ({lang="en", el, min=0, max=1000, type, exact="", notExact, orEmpty=false}:  IInputChecker) => {
    if (!el.parentElement) return
    el.parentElement.classList.remove('incorrect-value')
    if (el.value.length === 0 && orEmpty) return 
    if (el.value.length < min) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Min length: ${min}` : `Мин длина: ${min}`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (el.value.length > max) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Max length: ${max}` : `Макс длина: ${max}`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (exact && el.value !== exact) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Doesn't match` : `Не совпадает`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (type === 'numbers' && !checkIfPhone(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Numbers only` : `Только цифры`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (type === 'phone' && !checkIfNumbers(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Numbers only` : `Только цифры`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (type === 'email' && !checkIfEmail(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong format` : `Неверный формат`
        el.parentElement.classList.add('incorrect-value')
        return
    }
    if (type === 'date') {
        const inputDate = new Date(el.value)
        if (!(inputDate instanceof Date) || inputDate < inputsProps.date.min || inputDate > inputsProps.date.max) {
            el.parentElement.dataset.errorText = lang === 'en' ? `Wrong date` : `Неверная дата`
            el.parentElement.classList.add('incorrect-value')
        }
        return
    }
    if (typeof notExact !== 'undefined' && el.value === String(notExact)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong value` : `Направильное значение`
        el.parentElement.classList.add('incorrect-value')
        return
    }
}

export default inputChecker