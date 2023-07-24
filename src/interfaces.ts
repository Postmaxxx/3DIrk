import { AnyAction } from "redux";

//================================================================================
export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'ru'
export type TId = string //id of any element

//---------------------------------------redux
export interface IAction<T> {
    type: string;
    payload?: T; 
}

export interface IActionCreator<T> {
    (payload?: T): IAction<T>
}

export interface IDispatch {
    <T extends AnyAction>(action: T): T
}


//---------------------------------------------data fetch
export type TFetchStatus = 'idle' | 'success' | 'fetching' | 'error'

export interface IFetch {
    status: TFetchStatus
    message: TLangText //for handling messages from BE
    errors?: TLangText[] ////for handling errors-list from BE
    controller?: AbortController //controller of current fetch 
}
export interface IMessageModal {
    header: string
    status: string
    text: string[]
}

export interface IImageModal {
    url: string,
    text: string
}



//---------------------------------------------lang text
export type TLangText = {
    [key in TLang]: string
}



//-------------------------------------------splider
export interface ISpliderOptions {
	type?   : string
	perPage?: number
	gap?: string | number
	lazyLoad?: boolean
	updateOnMove?: boolean
	perMove?: number
	pagination?: boolean
	arrows?: boolean
	drag?: boolean
	speed?: number
	autoplay?: boolean
    wheel?: boolean
    wheelSleep?: number
	interval?: number
	pauseOnHover?: boolean
    fixedWidth?: string
    focus?: number | "center"
    rewind?: boolean
	isNavigation?: boolean
    direction?: "ltr" | "rtl" | "ttb" | undefined
    height?: string
    releaseWheel?: boolean
	breakpoints?: {
		[key: number]: Partial<ISpliderOptions>
	}
}




//----------------------------------- color
export interface IColor {
    _id: TId
    name: TLangText
    url: {
        full: string
        thumb: string
    }
}

//----------------------------------- pros / cons
export interface IProsCons {
    pros: TLangText[]
    cons: TLangText[]
}



//----------------------------------- features
export interface IFeature {
    name: TLangText
    value: TLangText
}



//==========================================Fibers State
export interface ISendFiber extends Omit<IFiber, 'images'> { //for sending to BE
    files: File[]
}


export interface IFiberParam {
    [key: string]: number | string //for enumerating and useinmg with inputs
    strength: number //MPa
    stiffnes: number //1..10
    durability: number //1..10
    resistantImpact: number //1..10
    minTemp: number //in C
    maxTemp: number //in C
    thermalExpansion: number //µm/m-°C
    density: number //g/cm3
    flexible: number //0..2, 0 -no, 1 - maybe, 3 - ok
    elastic: number //0..2, 0 -no, 1 - maybe, 3 - ok
    soft: number //0..2, 0 -no, 1 - maybe, 3 - ok
    composite: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantUV: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantWater: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantHeat: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantChemically: number //0..2, 0 -no, 1 - maybe, 3 - ok
    dissolvable: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantFatigue: number //0..2, 0 -no, 1 - maybe, 3 - ok
    cutting: number //0..2, 0 -no, 1 - maybe, 3 - ok
    grinding: number  //0..2, 0 -no, 1 - maybe, 3 - ok
    price: number //1-low...5-high
    priceGr: string //price for 1gr
}


export interface IFiber {
    _id: TId
    name: TLangText
    text: TLangText
    short: {
        name: TLangText
        text: TLangText
    }
    images: {
        paths: {
            full: string
            small: string
        }
        files: string[]
    }
    params: IFiberParam
    proscons: IProsCons
    colors: TId[] //list of colors ids
}

export interface IFibersState {
    selected: TId //id
    showList: TId[] //list of id to show
    load: IFetch //receiving data
    send: IFetch //sending data
    fibersList: IFiber[]
}





//============================================== category state
export interface ISendProduct extends Omit<IProduct, 'images'> { //for sending to BE
    files: File[]
}


export interface IProduct {
    _id: TId
    price: number
    name: TLangText
    text: TLangText
    text_short: TLangText
    images: {
        paths: {
            full: string
            small: string
            medium: string
            preview: string
        }
        files: string[]
    }
    fibers: TId[] //array of fiber ids
    mods: TLangText[]
    category: TId
}


export interface IProductShort { //for gallery
    _id: TId
    price: TLangText
    name: TLangText
    text_short: TLangText
    images: {
        paths: {
            small: string
        }
        files: string[]
    }
}


export interface ICategory {
    _id: TId
    products: IProductShort[] // loaded products,
    loadCategory: IFetch //for load products in selected category
    product: IProduct //current opened product (in case opened from bookmarks)
    loadProduct: IFetch
    sendProduct: IFetch
}


export interface ICatalogItem { //one category name
    name: TLangText
    total: number //total amount of products in category
    _id: TId
}

export interface ICatalog{
    load: IFetch //for load categoriesList
    send: IFetch //for load categoriesList
    list: ICatalogItem[] //list of all categories
}

export interface ICatalogState {
    catalog: ICatalog //list of all categories
    category: ICategory //current category
}





//============================================== news state
export interface ISendNewsItem extends Omit<INewsItem, 'images'> { //for sending to BE
    files: File[]
}


export interface INewsItem { //for detail view on news detail page
    _id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangText
    images: {
        paths: {
            full: string
            medium: string
            small: string
        }
        files: string[]
    }
}

export interface INewsItemShort { // for preview news on main page
    _id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangText
    images: {
        paths: {
            full: string
            medium: string
            small: string
        }
        files: string[]
    }
}

export interface INewsState {
    load: IFetch
    loadOne: IFetch
    newsOne: INewsItem
    send: IFetch
    total: number
    newsList: INewsItemShort[]
}



//============================================== base state
export interface IBaseState {
    theme: TTheme
    lang: TLang
    mobOpened: boolean //mobile nav panel opened
    desktopOpened: boolean //desktop nav panel opened
}




//============================================== Colors state
export interface ISendColor {
    _id: string
    name: {
        ru: string, 
        en: string
    }, 
    files: { //specific due to the neccessarity to have different images for thumb and full images
        full: File, 
        thumb: File
    },
}



export interface IColorsState {
    load: IFetch
    send: IFetch
    colors: IColor[] //list of all colors
}





//============================================== Cart state
export interface ICartItem {
    product: IProduct
    fiber: TId 
    color: TId 
    type: TLangText
    amount: number
}


export interface ICartState {
    load: IFetch
    send: IFetch
    items: ICartItem[]
    shouldUpdate: boolean //if true it means client updated cart and it must be sent to BE
}



//============================================== User state
export interface IUserState {
    name: string
    email: string
    phone: string
    token: string
    message: string
    auth: IFetch //for authenticating
    isAdmin: boolean
    cart: ICartState
    sendOrder: IFetch //for sending order
}







//---------------------------------ALL ORDERS----------------------------------------------------------
export type OrderType = 'finished' | 'new' | 'working' | 'canceled'

export interface IFilterUser extends Pick<IUserState, "name" | "phone" | "email"> { //User for filter orders for Admin in All_Orders
    _id: TId
}

export interface IOrdersCartItem { //cart in order, for All_Orders
    productId: string
    productName: TLangText
    fiberName: TLangText
    colorName: TLangText
    amount: number
    type: TLangText
}


export interface IOrdersItem {
    _id: TId
    date: string
    message: string
    status: OrderType
    cart: IOrdersCartItem[]
    pathToFiles: string
    attachedFiles: string[]
}


export interface IUserOrders { //user with userInfo and orders for requested period and with requested stauts
    userInfo: IFilterUser 
    orders: IOrdersItem[]
}

interface IUserList {
    load: IFetch
    list: IFilterUser[] //userlist to pick user, for Admin in All_Orders
}

export interface IOrdersState {
    users: IUserOrders[] //list of all requested users with orders for requested period and with requested status 
    userList: IUserList //list of all users, for fast fetch just only userInfo
    load: IFetch
    send: IFetch
}


//============================================== full state
export interface IFullState {
    base: IBaseState
    news: INewsState
    fibers: IFibersState
    catalog: ICatalogState
    colors:  IColorsState
    user: IUserState
    content:  IContentState
    orders: IOrdersState
}





//////////////////////////////////for intercommunicate with BackEnd
export interface IUserLoginResOk {
    message: TLangText
    user: Pick<IUserState, 'name' | 'email' | 'phone' | 'token' | 'isAdmin'> & {cart: ICartItem[]}
}


export interface IErrRes { //type for response with not 2XX status
    errors?: TLangText[]
    message: TLangText
}



export interface IMsgRes {  //type for response with message
    message: TLangText
}


export interface ILoggingForm { //for form login/register form
    email: string
    password: string
    name: string,
    phone: string
    repassword: string
}

export interface ICarouselMax { //for CarouselMax
    paths: {
        full: string
        spliderMain: string
    },
    files: string[]
}

export interface IContentState { //for other app content 
    splider: ICarouselMax
    send: IFetch
    load: IFetch
}


export type TImageSizes = 'thumb' | 'small' | 'medium' | 'full' | 'spliderMain' | 'preview' //all supported types of images.



