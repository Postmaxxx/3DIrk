import { ReactNode } from "react";
import { AnyAction, ActionCreatorsMapObject } from "redux";
import { Store } from 'redux'


//---------------------------NAV---------------------------------
export interface IPage {
    nameRu: string
    nameEn: string
    path: string
}

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
export type TLang = 'En' | 'Ru'

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






export interface IPortfolioFeature {
        feature: string
        value: string
}

export interface IPortfolio {
    imgPath: string
    features: Array<IPortfolioFeature>
}



export type TStatus = 'idle' | 'success' | 'loading' | 'error'

export interface IState extends Store {
    theme: TTheme
    lang: TLang
    portfolios: {
        status: TStatus
        list: Array<IPortfolio>
    }
    nav: {
        mobOpened: boolean,
        desktopOpened: boolean
    }
}



//------------------------------
export interface IFeature {
	name: string
	value: string
}

export interface IFeatures {
	En: Array<IFeature>
	Ru: Array<IFeature>
	colors: Array<string>
}

export interface IPortfolioData {
	id: string
	filename: string
	filedescr: string
	features: IFeatures
}