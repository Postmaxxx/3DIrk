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




export interface IFeature {
    id?: string
	name: string
	value: string
}

export interface IFeatures {
	En: Array<IFeature>
	Ru: Array<IFeature>
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
	features: IFeatures
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

export type TPortfoliosStatus = 'idle' | 'success' | 'loading' | 'error'

export interface IState extends Store {
    theme: TTheme
    lang: TLang
    portfolios: {
        status: TPortfoliosStatus
        list: Array<IPortfolioData>
    }
    nav: {
        mobOpened: boolean,
        desktopOpened: boolean
    }
}



//------------------------------
