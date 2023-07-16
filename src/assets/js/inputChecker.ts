import { TLang } from "src/interfaces"


type TInputs = "email" | "numbers" | "phone"
interface IInputChecker {
    el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    min?: number
    max?: number
    type?: TInputs 
    exact?: string
    lang: TLang
}

const inputChecker = ({lang="en", el, min=0, max=1000, type, exact=""}:  IInputChecker) => {
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
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong format` : `Неверный формат`
        el.parentElement.classList.add('incorrect-value')
    }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        el.parentElement.dataset.errorText = lang === 'en' ? `Wrong format` : `Неверный формат`
        el.parentElement.classList.add('incorrect-value')
    }


}

export default inputChecker