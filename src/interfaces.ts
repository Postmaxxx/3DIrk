import { ReactNode } from "react";
import { AnyAction, ActionCreatorsMapObject } from "redux";
import { Store } from 'redux'


//---------------------------NAV---------------------------------
/*export interface IPage {
    nameRu: string
    nameEn: string
    path: string
}
*/




//-----------------------Colors--------------------
/*
export interface IPrintColor {
    id: number,
    propRu: string
    propEn: string
    value: string
    k: number
}
*/

//-------------------------Gallery------------------
/*
export interface IGalleryItemDescr {
    prop: string
    value: string
}

export interface IGalleryItem {
    id: number
    path: string
    descrRu: Array<IGalleryItemDescr>
    descrEn: Array<IGalleryItemDescr>
    colors: {
        propRu: string
        propEn: string
        available: Array<number>
    }
}

*/


//----------------------------------------------------------------------



/*

export interface IFeature {
    id?: string
	name: string
	value: string
}

export type TFeatures = {
	[key in TLang]: Array<IFeature>
}





export interface IPortfolioImage {
    path: string
    descr: string
    id?: string
}

export interface IColorID {
    id?: string
    colorId: string
}

export interface IPortfolioData {
    changed: boolean
    id: string
	images: Array<IPortfolioImage>
	descr: string
    colors: Array<IColorID>
	features: TFeatures
}


export type TProtfolioStateStatus = '' | 'editing' | 'adding'

export interface IProtfolioState {
	id: string,
	index: number
	status: TProtfolioStateStatus 
	editingLang: TLang
	editingFeatureIndex: number
	portfolioData: IPortfolioData
}


*/

//------------------------------

/*
export interface IImg {
    path: string
    url: string
    alt: TLangText
}

export type TLoadDataStatus = 'idle' | 'success' | 'loading' | 'error'

export interface IDataLoading {
    status: TLoadDataStatus
    message: string
}


export type TCollectionNames = 'fibers' | 'techs' | 'nodata'



export interface ISetData {
    dataName: TCollectionNames
    value: any
}




export interface IState extends Store {
    theme: TTheme
    lang: TLang
    pagesList: Array<IPage>
    components: {
        heroBlock: IHeroBlock
        newsBlock: INewsBlock
        fibersBlock: IFibersBlock
        orderBlock: IOrderBlock
        portfolios: IPortfolios
        nav: {
            mobOpened: boolean,
            desktopOpened: boolean
        }
    }




    sliderMax:{
        dataLoading: IDataLoading
        list: Array<IMaxSlide>
    } 
    nav: {
        mobOpened: boolean,
        desktopOpened: boolean
    }

    
}






export type ProjectItemImageItem = {
    width: number
    height: number
    image: string 
}


type ProjectItemImagesImage = {
    descr: string
    link: string
    images: Array<ProjectItemImageItem>
}

export type ProjectItemListItem = {
    name: string
    descr: string
    link: string
    images: Array<ProjectItemImagesImage>
}

export interface IPortfolios {
    selectedPortfolio: number
    selectedImage: number
    header: TLangText
    subheader: TLangText
    text: TLangTextArr
    headerSplider: TLangText
    img: IImg
    list: Array<ProjectItemListItem>
}



*/
//================================================================================
export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'ru'
export type TLoadDataStatus = 'idle' | 'success' | 'loading' | 'error'
export type TSendDataStatus = 'idle' | 'success' | 'sending' | 'error'
export type TId = number

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
export interface IPage {
    name: TLangText,
    path: string
}

export interface INav {
    mobOpened: boolean,
    desktopOpened: boolean
    //pages: IPage[]
}


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
		}>
	}
}

//-------------------------------------------- block Order
/*export interface IOrderInput {
    //label: TLangText,
    data: string
}

export interface IOrderBlock {
    header: TLangText
    subheader: TLangText
    name: IOrderInput
    phone: IOrderInput
    email: IOrderInput
    message: IOrderInput
    files: {
        /*label: TLangText,
        listLabel: TLangText
        link: TLangText
        linkRest: TLangText*/
      /*  filesList: Array<any>
    },
    qrcode: string,
    text: TLangTextArr
}
*/




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
}

//----------------------------------- block Catalog
export interface ICatalogBlock {
    header: TLangText
    subheader: TLangText
    text: TLangTextArr
    img: IImg
    headerGallery: TLangText
}






































//==========================================Fibers State
export interface IProsCons {
    pros: TLangTextArr
    cons: TLangTextArr
}

export interface IFiber {
    id: TId
    header: TLangText
    text: TLangTextArr
    proscons: IProsCons
    imgs: Array<IImg>
}

export interface IFiberState {
    dataLoading: IDataLoading
    fibersList: Array<IFiber>
}





//============================================== category state

export interface ISize {
    name: TLangText
    value: TLangText
}

export type IFeatureValue = TLangText | TId[]

export type TFeaturesType = "value" | "color" | "fiber"

export interface IFeature {
    name: TLangText
    type: TId
    values: IFeatureValue[]
}

export interface IProduct {
    id: TId
    price: TLangText
    name: TLangText
    text: TLangTextArr
    photos: IImg[]
    features: IFeature[]
}

export interface ICategoryState {
    selectedProduct: number
    selectedProductImage: number
    dataLoading: IDataLoading
    id: TId
    products: IProduct[]
}


//================================================news state
export interface INewsItem {
    header: TLangText
    date: Date
    short: TLangText
    text: TLangTextArr
    imgs: Array<IImg>
}

export interface INewsState {
    dataLoading: IDataLoading
    news: INewsItem[]
}





//============================================== base state

export interface IBaseState {
    theme: TTheme
    lang: TLang
    mobOpened: boolean,
    desktopOpened: boolean
}



//==================================================colors state
export interface IColorValue {
    r: number
    g: number
    b: number
}

export interface IColors {
    id: TId
    name: TLangText
    value: IColorValue
}

export interface IColorsState {
    dataLoading: IDataLoading
    colors: IColors[]
}


//============================================== order state

export interface IOrderState {
    dataSending: IDataSending
    name: string
    phone: string
    email: string
    message: string
    files: Array<any>
}


//============================================== full state
export interface IFullState {
    base: IBaseState
    news: INewsState
    /*category: ICategoryState
    fibers: IFiberState
    colors: IColorsState
    order: IOrderState*/
}


