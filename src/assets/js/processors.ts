import { TLangText } from "src/interfaces";
import { selector10, selector3, selector5 } from "../data/selectorValues";

interface ICompareTable {
    [key: number] : TLangText
}


const ratingNumberToText = (value: string, scale: string) : TLangText => {
   
    switch (scale) {
        case '10':
            return selector10.find(item => item.value === value)?.name || {en: 'Value out of range', ru: 'Значение вне диапазона'}
        case '5':
            return selector5.find(item => item.value === value)?.name || {en: 'Value out of range', ru: 'Значение вне диапазона'}
        case '3':
            return selector3.find(item => item.value === value)?.name || {en: 'Value out of range', ru: 'Значение вне диапазона'}
        default:
            return {en: 'Scale of range', ru: 'Шкала вне диапазона'}
    }
}


export { ratingNumberToText }