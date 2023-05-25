import { TLang, TLangText } from "src/interfaces";

interface ICompareTable {
    [key: number] : TLangText
}

export const ratingNumberToText = (value: number): TLangText => {
    const compareTable: ICompareTable = {
        1 : {
            en: 'none',
            ru: 'отсутствует'
        },
        2: {
            en: 'extremely low',
            ru: 'крайне низкая'
        },
        3: {
            en: 'low',
            ru: 'низкая'
        },
        4: {
            en: 'poor',
            ru: 'посредственная'
        },
        5: {
            en: 'below medium',
            ru: 'ниже средней'
        },
        6: {
            en: 'medium',
            ru: 'средняя'
        },
        7: {
            en: 'upper medium',
            ru: 'хорошая'
        },
        8: {
            en: 'hign',
            ru: 'высокая'
        },
        9: {
            en: 'very high',
            ru: 'очень высокая'
        },
        10: {
            en: 'exellent',
            ru: 'отличная'
        }

    }
    
    return compareTable[Number(value)]
    
}

/*
export type TSvgTypes = 'minus' | 'ok' | 'con' | 'pro' | 'question' | 1 |2 |3

interface ISvgInserter {
    color: string
    type: TSvgTypes
}

export const icon = ({type, color}: ISvgInserter): JSX.Element => {


    return (
        <>
        </>
    )
}*/