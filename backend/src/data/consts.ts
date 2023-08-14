import { TLangText } from "../interfaces"

const minTimeBetweenSendings: number = 500 //in ms
const sendNotificationsInTG: boolean = false
const delayForFS = 1000
const timeZoneDelta = 8

const missedItem: TLangText = {
    en: 'Item is missed in database',
    ru: 'Объект отсутствует в базе данных'
}

const allPaths = {
    pathToServer: "http://localhost/data",
    pathToTemp: "C:/Projects/3D/3dprint/backend/uploads/temp",
    pathToBase: "C:/Projects/3D/3dprint/backend/data",
    pathToImages:"images",
    pathToNews:"news",
    pathToSplider:"splider",
    pathToUserFiles: "userfiles",
    pathToColors: "colors",
    pathToFibers: "fibers",
    pathToProducts: "products"
}

const orderStatus: string[] = [
    'new',
    'working',
    'finished',
    'canceled',
]


interface ISizesItem {
    h: number
    w: number
}

interface IImageSizes {
    thumb: ISizesItem
    preview: ISizesItem
    small: ISizesItem
    medium: ISizesItem
    big: ISizesItem
    full: ISizesItem
   carouselMaxFull: ISizesItem
   carouselMaxMedium: ISizesItem
   carouselMaxSmall: ISizesItem
}


const sizes: IImageSizes = {
    thumb: {
        h: 40,
        w: 40
    },
    preview: {
        h: 120,
        w: 100
    },
    small: {
        w: 350,
        h: 250
    },
    medium: {
        h: 600,
        w: 450
    },
    big: {
        h: 1000,
        w: 800
    },
    full: {
        h: 1920,
        w: 1080
    },
    carouselMaxFull: {
        w: 730,
        h: 400
    },
    carouselMaxMedium: {
        w: 420,
        h: 250
    },
    carouselMaxSmall: {
        w: 230,
        h: 170
    }
}


/*
const sizes = sizesList.reduce((acc, item) => {
    acc[item.name] = {
        h: item.height,
        w: item.width
    }
    return acc
}, {}) */


export {minTimeBetweenSendings, sendNotificationsInTG, orderStatus, sizes, delayForFS, allPaths, timeZoneDelta,  
    ISizesItem, IImageSizes, missedItem}