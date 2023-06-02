import { ICatalogState } from './../../interfaces';

export const actionsListBase = {
    SET_THEME_DARK: 'SET_THEME_DARK',
    SET_THEME_LIGHT: 'SET_THEME_LIGHT',
    SET_THEME_TOGGLE: 'SET_THEME_TOGGLE',
    SET_LANG_EN: 'SET_LANG_EN',
    SET_LANG_RU: 'SET_LANG_RU',
    SET_NAV_OPEN_MOB: 'SET_NAV_OPEN_MOB',
    SET_NAV_CLOSE_MOB: 'SET_NAV_CLOSE_MOB',
    SET_NAV_TOGGLE_MOB: 'SET_NAV_TOGGLE_MOB',
    SET_NAV_OPEN_DT: 'SET_NAV_OPEN_DT',
    SET_NAV_CLOSE_DT: 'SET_NAV_CLOSE_DT',
    SET_NAV_TOGGLE_DT: 'SET_NAV_TOGGLE_DT',
}

export const actionsListNews = {
    SET_DATA_NEWS: 'SET_DATA_NEWS',
    SET_LOAD_DATA_STATUS_NEWS: 'SET_LOAD_DATA_STATUS_NEWS'
}

export const actionsListFibers = {
    SET_DATA_FIBERS: 'SET_DATA_FIBERS',
    SET_LOAD_DATA_STATUS_FIBERS: 'SET_LOAD_DATA_STATUS_FIBERS',
    SET_SELECTED_FIBER: 'SET_SELECTED_FIBER',
    SET_SHOW_LIST_FIBERS: 'SET_SHOW_LIST_FIBERS'
}


export const actionsListOrder = {
    SET_ORDER_NAME: 'SET_ORDER_NAME',
    SET_ORDER_PHONE: 'SET_ORDER_PHONE',
    SET_ORDER_EMAIL: 'SET_ORDER_EMAIL',
    SET_ORDER_MESSAGE: 'SET_ORDER_MESSAGE',
    CLEAR_ORDER_FORM: 'CLEAR_ORDER_FORM',
    ADD_ORDER_FILES: 'ADD_ORDER_FILES',
    CLEAR_ORDER_FILES: 'CLEAR_ORDER_FILES',
    SET_SEND_DATA_STATUS_ORDER: 'SET_SEND_DATA_STATUS_ORDER'
}


export const actionsListCatalog = {
    SET_LOAD_DATA_STATUS_CATEGORIES_LIST: 'SET_LOAD_DATA_STATUS_CATEGORIES_LIST',
    SET_DATA_CATEGORIES_LIST: 'SET_DATA_CATEGORIES_LIST',
    
    SET_LOAD_DATA_STATUS_CATEGORY: 'SET_LOAD_DATA_STATUS_CATEGORY',
    SET_DATA_CATEGORY: 'SET_DATA_CATEGORY',
    
    SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
    SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
    
    SET_PAGE: 'SET_PAGE',
}


export const actionsListProduct = {
    SET_LOAD_DATA_STATUS_PRODUCT: 'SET_LOAD_DATA_STATUS_PRODUCT',
    SET_DATA_PRODUCT: 'SET_DATA_PRODUCT',
    SET_SELECTED_IMAGE: 'SET_SELECTED_IMAGE',
}


export const actionsListColors = {
    SET_LOAD_DATA_STATUS_COLORS: 'SET_LOAD_DATA_STATUS_COLORS',
    SET_DATA_COLORS: 'SET_DATA_COLORS',
}

export const actionsListCart = {
    SET_LOAD_DATA_STATUS_CART: 'SET_LOAD_DATA_STATUS_CART', //
    SET_SEND_DATA_STATUS_CART: 'SET_SEND_DATA_STATUS_CART', //
    ADD_ITEM: 'ADD_ITEM', //
    CLEAR_CART: 'CLEAR_CART',//
    REMOVE_ITEM: 'REMOVE_ITEM',
    CHANGE_ITEM: 'CHANGE_ITEM', //
    SET_CART: 'SET_CART' //
}