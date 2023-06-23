import { AnyAction } from "redux";

//================================================================================
export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'ru'
export type TId = string

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
    message: TLangText
    errors?: TLangText[]
}

export interface IFetchImage {
    status: TFetchStatus
    message: TLangText
    urls?: IImgWithThumb
}

export interface IMessageModal {
    header: string
    status: string
    text: string[]
}


//---------------------------------------------lang text
export type TLangText = {
    [key in TLang]: string
}


// ---------------------------------------------nav
export interface IPageItem {
    name: TLangText
    path: string
    _id: TId
    notLink?: boolean
    expanded?: boolean
    subMenu?: Array<IPageItem>
}


//-------------------------------------------img
export interface IImg {
    url: string
    name: TLangText
}

export interface IImgWithThumb {
    full: string
    medium?: string
    thumb: string
    fileName: string
}



//-------------------------------------------splider
export interface ISpliderOptions {
	type   : string
	perPage: number
	gap: string | number
	lazyLoad: boolean
	updateOnMove: boolean
	perMove: number
	pagination: boolean
	arrows: boolean
	drag: boolean
	speed: number
	autoplay: boolean
    wheel: boolean
    wheelSleep: number
	interval: number
	pauseOnHover: boolean
    fixedWidth: string
    focus: number | "center"
    rewind: boolean
	isNavigation: boolean
    direction: "ltr" | "rtl" | "ttb" | undefined
    height: string
    releaseWheel: boolean
	breakpoints: {
		[key: number]: Partial<{
            type   : string
            perPage: number
            gap: string | number
            lazyLoad: boolean
            updateOnMove: boolean
            perMove: number
            pagination: boolean
            arrows: boolean
            drag: boolean
            speed: number
            autoplay: boolean
            wheel: boolean
            wheelSleep: number
            interval: number
            pauseOnHover: boolean
            fixedWidth: string
            focus: number | "center"
            rewind: boolean
            isNavigation: boolean
            direction: "ltr" | "rtl" | "ttb" | undefined
            height: string
		}>
	}
}




//----------------------------------- color
export interface IColor {
    _id: TId
    name: TLangText
    url: {
        full: string
        small: string
    }
}

//----------------------------------- pros / cons
export interface IProsCons {
    pros: TLangText[]
    cons: TLangText[]
}



//----------------------------------- base
export interface IFeature {
    name: TLangText
    value: TLangText
}



//==========================================Fibers State
export interface ISendFiber extends Omit<IFiber, 'images'> {
    files: File[]
}


export interface IFiberParam {
    [key: string]: number | string
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
    priceGr: string
}


export interface IFiber {
    _id: TId
    name: TLangText
    text: TLangText
    short: {
        name: TLangText
        text: TLangText
    }
    images: IImgWithThumb[]
    params: IFiberParam
    proscons: IProsCons
    colors: TId[] //ids of colors
}

export interface IFibersState {
    selected: TId //id
    showList: TId[] //list of id to show
    load: IFetch //receiving data
    send: IFetch //sending data
    fibersList: Array<IFiber> 
}





//============================================== category state
export interface IProduct {
    _id: TId
    price: TLangText
    name: TLangText
    text: TLangText
    imgs: IImg[]
    fibers: TId[] //array of fiber ids
    features: IFeature[]
    mods: TLangText[]
}


export interface ICategory {
    _id: TId
    name: TLangText
    products: IProduct[] //part of loaded products, i.e.: 1-9, 10-18, ...
    loadCategory: IFetch //for load products in selected category
    product: IProduct //current opened product (in case opened from bookmarks)
    loadProduct: IFetch
    total: number //total amount of products, i.e.: 36
    page: number //current open page of products in category, max as total / amountOfItemsPerPage
    //selectedProduct: string //id of selected product in category
}


export interface ICatalogItem { //one category name
    name: TLangText
    _id: TId
}

export interface ICatalog{
    load: IFetch //for load categoriesList
    list: ICatalogItem[] //list of all categories
}

export interface ICatalogState {
    catalog: ICatalog //list of all categories
    category: ICategory //current category
}



//================================================news state
/*export interface ISendNews {
    header: TLangText
    short: TLangText
    text: TLangText
    date: Date
    images: File[]
}*/

export interface ISendNews extends Omit<INewsItem, 'images'> {
    images: File[]
}


export interface INewsItem { //for detail view on news detail page
    _id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangText
    images: IImgWithThumb[]
    files?: File[]
    changeImages?: boolean //for editing
}

export interface INewsItemShort { // for preview news on main page
    _id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangText
    images: IImgWithThumb[]
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
    mobOpened: boolean,
    desktopOpened: boolean
}




//============================================== order state
export interface IOrderState {
    _id: TId
    send: IFetch
    date: Date
    name: string
    phone: string
    email: string
    message: string
    files: File[]
    cart: ICartState
}




//============================================== Product state
/*export interface IProductState extends IProduct {
    load: IFetch
   // selectedImage: number
}*/

//============================================== Colors state
export interface ISendColor {
    name: {
        ru: string, 
        en: string
    }, 
    files: {
        full: File, 
        small: File
    }
}



export interface IColorsState {
    load: IFetch
    send: IFetch
    colors: IColor[] //list of all colors
}





//============================================== Cart state
export interface ICartItem {
    //product: TId //
    product: IProduct
    fiber: TId //id
    color: TId  //id
    type: TLangText
    amount: number
}


/*
export interface ICartItemSave { //format for saving cart, BE
    product: string //id
    amount: number
    fiber: string //id
    color: string //id
    type: TLangText
}
*/

export interface ICartState {
    load: IFetch
    send: IFetch
    items: ICartItem[]
}



//============================================== User state
type TOrderStatus = 'working' | 'canceled' | 'finished'

/*
export interface IOrder {
    date: Date
    status: TOrderStatus
    items: Omit<ICartItem, "id">[]
}
*/

export interface IUserState {
    name: string
    email: string
    phone: string
    token: string
    //orders: TId[]
    auth: IFetch
    isAdmin: boolean
}




//============================================== full state
export interface IFullState {
    base: IBaseState
    news: INewsState
    fibers: IFibersState
    catalog: ICatalogState
    colors:  IColorsState
    user: IUserState
    order: IOrderState
    //cart: ICartState
}





//////////////////////////////////////////////////////////////////////////////////////  BackEnd

export interface ICategoryReceived {
    _id: TId
    name: TLangText
    products: IProduct[]
}


export interface IProductBE {
    categoryId: TId
    _id: TId
    price: TLangText
    name: TLangText
    text: TLangText
    imgs: IImg[]
    fibers: TId[]
    features: IFeature[]
    mods: TLangText[]
}




export interface IFiberProperties {
    _id: TId
    name: TLangText
    tip: TLangText
    unit: TLangText
    type: string
}




export interface IUserLoginResOk {
    message: TLangText
    user: Pick<IUserState, 'name' | 'email' | 'phone' | 'token' | 'isAdmin'>
}




//////////////////////////////////////////////////////////
export interface IErrRes {
    errors?: TLangText[]
    message: TLangText
}

export interface IMsgRes {
    message: TLangText
}


export interface ILoggingForm {
    email: string
    password: string
    name: string,
    phone: string
    repassword: string
}

export interface ICheckErrorItem {
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
    name: TLangText
}


export interface IModalImg {
	descr: string 
	path: string
}
