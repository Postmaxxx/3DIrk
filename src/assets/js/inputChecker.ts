import { TLang } from "src/interfaces"
import { inputsProps } from "./consts"


type TInputs = "email" | "numbers" | "phone" | "date"
interface IInputChecker {
    el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    min?: number //length
    max?: number //length
    type?: TInputs 
    exact?: string //if proveided value must be the same
    lang: TLang
    notExact?: string
}

const inputChecker = ({lang="en", el, min=0, max=1000, type, exact="", notExact}:  IInputChecker) => {
    if (!el.parentElement) return
    el.parentElement.classList.remove('incorrect-value')
    if (el.value.length < min) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Min length: ${min}` : `Мин длина: ${min}`
        el.parentElement.classList.add('incorrect-value')
    }
    if (el.value.length > max) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Max length: ${max}` : `Макс длина: ${max}`
        el.parentElement.classList.add('incorrect-value')
    }
    if (exact && el.value !== exact) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Doesn't match` : `Не совпадает`
        el.parentElement.classList.add('incorrect-value')
    }
    if (type === 'numbers' && !/^[0-9]*$/.test(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Numbers only` : `Только цифры`
        el.parentElement.classList.add('incorrect-value')
    }
    if (type === 'phone' && !/^\+?[0-9]*$/.test(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Numbers only` : `Только цифры`
        el.parentElement.classList.add('incorrect-value')
    }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong format` : `Неверный формат`
        el.parentElement.classList.add('incorrect-value')
    }
    if (type === 'date') {
        const inputDate = new Date(el.value)
        if (!(inputDate instanceof Date) || inputDate < inputsProps.date.min || inputDate > inputsProps.date.max) {
            el.parentElement.dataset.errorText = lang === 'en' ? `Wrong date` : `Неверная дата`
            el.parentElement.classList.add('incorrect-value')
        }
    }
    if (typeof notExact !== 'undefined' && el.value === notExact) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong value` : `Направильное значение`
        el.parentElement.classList.add('incorrect-value')
    }
}

export default inputChecker