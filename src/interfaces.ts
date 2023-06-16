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
    id: TId
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
    medium: string
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
        big: string
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
export interface IFiberParam {
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
    id: TId
    name: TLangText
    text: TLangText
    proscons: IProsCons
    colors: TId[] //ids of colors
    images: IImg[]
    features: IFeature[]
    short: {
        name: TLangText
        descr: TLangText
    }
    params: IFiberParam
}

export interface IFibersState {
    selected: TId //id
    showList: TId[] //list of id to show
    load: IFetch //receiving data
    fibersList: Array<IFiber> 
}





//============================================== category state
export interface IProduct {
    id: TId
    price: TLangText
    name: TLangText
    text: TLangText
    imgs: IImg[]
    fibers: TId[] //array of fiber ids
    features: IFeature[]
    mods: TLangText[]
}


export interface ICategory {
    id: TId
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
    id: TId
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
export interface INewsItem {
    _id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangText
    images: IImgWithThumb[]
}

export interface INewsState {
    load: IFetch
    send: IFetch
    total: number
    newsList: INewsItem[]
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
    id: TId
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
    id: TId
    name: TLangText
    products: IProduct[]
}


export interface IProductBE {
    categoryId: TId
    id: TId
    price: TLangText
    name: TLangText
    text: TLangText
    imgs: IImg[]
    fibers: TId[]
    features: IFeature[]
    mods: TLangText[]
}




export interface IFiberProperties {
    id: TId
    name: TLangText
    tip: TLangText
    unit: TLangText
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
    name?: string,
    phone?: string
    repassword?: string
}

export interface ICheckErrorItem {
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
    name: TLangText
}


export interface IModalImg {
	descr: string 
	path: string
}
