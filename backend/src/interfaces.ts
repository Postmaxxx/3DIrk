export type TLang = 'en' | 'ru'

export type TLangText = {
    [key in TLang]: string
}

export type TId = string

export interface ICatalogItem { //one category name
    name: TLangText
    total: number //total amount of products in category
    _id: TId
}


export interface ICatalogItem { //one category name
    name: TLangText
    total: number //total amount of products in category
    _id: TId
}
