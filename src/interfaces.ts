import { AnyAction } from "redux";



//================================================================================
export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'ru'
export type TLoadDataStatus = 'idle' | 'success' | 'loading' | 'error'
export type TSendDataStatus = 'idle' | 'success' | 'sending' | 'error'
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


//---------------------------------------------data load
export interface IDataLoading {
    status: TLoadDataStatus
    message: string
}


//---------------------------------------------data send
export interface IDataSending {
    status: TSendDataStatus
    message: string
}


//---------------------------------------------lang
export type TTextMultiLines = Array<{part: string}>


export type TLangText = {
    [key in TLang]: string
}

export type TLangTextArr = {
    [key in TLang]: TTextMultiLines
}





// ---------------------------------------------nav
export interface IPageItem {
    name: TLangText
    path: string
}

export interface IPage extends IPageItem {
    subMenu?: IPageItem[]
}
/*
export interface INav {
    mobOpened: boolean,
    desktopOpened: boolean
    //pages: IPage[]
}
*/

//-------------------------------------------img
export interface IImg {
    url: string
    name: TLangText
}




//=============================================BLOCKS

//------------------------------------------ modal
export interface IModal {
	visible: boolean
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



//------------------------------------block SliderMax
/*export interface ISliderMaxBlock {
    path: string
    alt: string
    url?: string
    descr: string
}*/

//----------------------------------- block hero

export interface IHeroBlock {
    header: TLangText,
    text: TLangTextArr
}

//----------------------------------- block news
export interface INewsBlock {
    header: TLangText
    text: TLangTextArr
}


//----------------------------------- block fibers

export interface IFibersBlock {
    header: TLangText
    text: TLangTextArr
    colors: TLangText
    features: TLangText
}

//----------------------------------- block Catalog
export interface ICatalogBlock {
    header: TLangText
    subheader: TLangText
    text: TLangTextArr
    img: IImg
    headerGallery: TLangText
    priceGallery: TLangText
}


//----------------------------------- block order
export interface IOrderInput {
    label: TLangText,
}

export interface IOrderBlock {
    header: TLangText
    subheader: TLangText
    name: IOrderInput
    phone: IOrderInput
    email: IOrderInput
    message: IOrderInput
    files: {
        label: TLangText,
        listLabel: TLangText
        link: TLangText
        linkRest: TLangText
    },
    qrcode: string,
    text: TLangTextArr
}








//----------------------------------- color

export interface IColor {
    id: TId
    name: TLangText
    value: string
}


export interface IProsCons {
    pros: TLangText[]
    cons: TLangText[]
}


export interface IFeatures {
    pros: IFeature[]
    cons: IFeature[]
}


//==========================================Fibers State

export interface IFiberParam {
    strength: number //MPa
    stiffnes: number //1..10
    durability: number //1..10
    minTemp: number //in C
    maxTemp: number //in C
    thermalExpansion: number //µm/m-°C
    density: number //g/cm3
    flexible: number //0..2, 0 -no, 1 - maybe, 3 - ok
    elastic: number //0..2, 0 -no, 1 - maybe, 3 - ok
    soft: number //0..2, 0 -no, 1 - maybe, 3 - ok
    composite: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantImpact: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantUV: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantWater: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantHeat: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantChemically: number //0..2, 0 -no, 1 - maybe, 3 - ok
    dissolvable: number //0..2, 0 -no, 1 - maybe, 3 - ok
    resistantFatigue: number //0..2, 0 -no, 1 - maybe, 3 - ok
    cutting: number //0..2, 0 -no, 1 - maybe, 3 - ok
    grinding: number  //0..2, 0 -no, 1 - maybe, 3 - ok
    speed: number //0-lo ... 5-high
    price: number //1-low...5-high
}


export interface IFiber {
    id: TId
    name: TLangText
    text: TLangTextArr
    proscons: IProsCons
    colors: IColor["id"][] 
    imgs: IImg[]
    features: IFeatures
    short: {
        name: TLangText
        descr: TLangText
    }
    params: IFiberParam
}

export interface IFibersState {
    selected: IFiber['id']
    showList: IFiber['id'][]
    dataLoading: IDataLoading
    fibersList: Array<IFiber>
}





//============================================== category state
/*export interface mockCategory {
    id: TId,
    name: TLangText
    products: Omit<IProduct, "colors">[]
}*/

export interface IFeature {
    name: TLangText
    value: TLangText
}




export interface IProduct {
    id: TId
    price: TLangText
    name: TLangText
    text: TLangTextArr
    imgs: IImg[]
    fibers: IFiber["id"][]
    features: IFeature[]
    mods: TLangText[]
}

/*export interface IProductShort {
    id: TId
    price: TLangText
    name: TLangText
    img: IImg
}*/


export interface ICategory {
    id: TId
    name: TLangText
    dataLoading: IDataLoading//for load products in selected category
    products: IProduct[]
    //products: IProductShort[]
    page: number
}


export interface ICategories {
    [key: string]: ICategory
}

export interface ICategoriesListItem {
    name: TLangText,
    id: ICategory["id"]
}

export interface ICatalogState {
    categoriesListLoading: IDataLoading //for load categoriesList
    categoriesList: ICategoriesListItem[]
    categories: ICategories
    selectedCategory: ICategory["id"]
    selectedProduct: IProduct["id"]
}






//================================================news state
export interface INewsItem {
    id: TId
    header: TLangText
    date: Date
    short: TLangText
    text: TLangTextArr
    imgs: Array<IImg>
}

export interface INewsState {
    dataLoading: IDataLoading
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
    dataSending: IDataSending
    name: string
    phone: string
    email: string
    message: string
    files: File[]
}


//============================================== Product state

export interface IProductState extends IProduct {
    dataLoading: IDataLoading
   // selectedImage: number
}

//============================================== Colors state

export interface IColorsState {
    dataLoading: IDataLoading
    colors: IColor[]
}

//============================================== Cart state
export interface ICartItem {
    id: string
    product: IProduct
    amount: number
    fiber: IFiber["id"]
    color: IColor["id"]
    type: TLangText
}

export interface ICartItemSave { //format for saving cart, BE
    product: IProduct["id"]
    amount: number
    fiber: IFiber["id"]
    color: IColor["id"]
    type: TLangText
}


export interface ICartState {
    dataLoading: IDataLoading
    dataSending: IDataSending
    items: ICartItem[]
}


//============================================== full state
export interface IFullState {
    base: IBaseState
    news: INewsState
    fibers: IFibersState
    catalog: ICatalogState
    order: IOrderState
    product: IProductState //current product
    colors:  IColorsState
    cart: ICartState
}

//////////////////////////////////////////////////////////////////////////////////////  BackEnd

export interface ICategoryReceived {
    id: ICategory["id"]
    name: TLangText
    products: IProduct[]
}

export interface IProductBE {
    categoryId: ICategory["id"]
    id: IProduct["id"]
    price: TLangText
    name: TLangText
    text: TLangTextArr
    imgs: IImg[]
    fibers: IFiber["id"][]
    features: IFeature[]
    mods: TLangText[]
}