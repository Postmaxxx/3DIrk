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


export interface INav {
    opened: boolean
    mobOpened: boolean
    pages: Array<IPage>
}

//-----------------------Colors--------------------

export interface IPrintColor {
    id: number,
    propRu: string
    propEn: string
    value: string
    k: number
}


//-------------------------Gallery------------------

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




//----------------------------------------------------------------------
export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'ru'

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




//------------------------------
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

export interface IFiber {
    header: TLangText
    text: TLangTextArr
    proscons: {
        pros: TLangTextArr
        cons: TLangTextArr
    }
    imgs: Array<IImg>
}

export interface IMaxSlide {
    path: string
    alt: string
    url?: string
    descr: string
}

export interface ISetData {
    dataName: TCollectionNames
    value: any
}









export interface IModal {
	visible: boolean
}




export type TTextMultiLines = Array<{part: string}>

export type TLangText = {
    [key in TLang]: string
}

export type TLangTextArr = {
    [key in TLang]: TTextMultiLines
}

export interface IPage {
    name: TLangText,
    path: string
}

export interface INews {
    header: TLangText
    date: Date
    short: TLangText
    text: TLangTextArr
    imgs: Array<IImg>
}


export interface INewsBlock {
    header: TLangText,
    text: TLangTextArr
    news: Array<INews>
}

export interface IHeroBlock {
    header: TLangText,
    text: TLangTextArr
}

export interface IFibersBlock {
    dataLoading: IDataLoading
    header: TLangText
    fibersList: Array<IFiber>
}

export interface IOrderBlock {
    header: TLangText
    subheader: TLangText
    name: {
        label: TLangText,
        data: string
    },
    phone: {
        label: TLangText,
        data: string
    },
    email: {
        label: TLangText,
        data: string
    },
    message: {
        label: TLangText,
        data: string
    },
    files: {
        label: TLangText,
        listLabel: TLangText
        link: TLangText
        linkRest: TLangText
        filesList: Array<any>
    },
    qrcode: string,
    text: TLangTextArr
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
		[key: number]: {
			wheel?: boolean
			perPage?: number
		}
	}
}