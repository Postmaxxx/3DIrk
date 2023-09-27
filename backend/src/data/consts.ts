import { IImageSizes, TImageSizes, TLangText } from "../interfaces"

const minTimeBetweenSendings: number = 500 //in ms
const sendNotificationsInTG: boolean = true
const delayForFS = 1000
const timeZoneDelta = 8

const missedItem: TLangText = {
    en: 'Item is missed in database',
    ru: 'Объект отсутствует в базе данных'
}


const allPaths = {
   //pathToServer: "http://localhost/data",
    pathToTemp: `${__dirname}/uploads/temp`,
   // pathToBase: "C:/Projects/3D/3dprint/backend/data",
    pathToImages:"images",
    pathToNews:"news",
    pathToCarousel:"carousel",
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





const imageSizes: IImageSizes = {
    thumb: {
        w: 50,
        h: 50
    },
    preview: {
        w: 100,
        h: 80
    },
    extraSmall: {
        w: 200,
        h: 170
    },
    small: {
        w: 300,
        h: 250
    },
    medium: {
        w: 450,
        h: 400
    },
    large: {
        w: 600,
        h: 500
    },
    extraLarge: {
        w: 800,
        h: 700
    },
    huge: {
        w: 1000,
        h: 900
    },
    full: {
        w: 1920,
        h: 1080
    },
    carouselMaxSmall: {
        w: 230,
        h: 170
    },
    carouselMaxMedium: {
        w: 420,
        h: 250
    },
    carouselMaxFull: {
        w: 730,
        h: 400
    },
}


const sizesSorter = (sizes: TImageSizes[]) => { //to sort items from smallest to biggest
    return sizes
        .map(size => ({
            name: size,
            w: imageSizes[size].w
        }))
        .sort((prev, next) => prev.w - next.w)
        .map(size => size.name)
}


const newsImageSizes: TImageSizes[] = sizesSorter(['full', 'medium', 'small', "extraSmall", "preview", "thumb"])
const fiberImageSizes: TImageSizes[] = sizesSorter(['full', 'large', 'medium', 'small', "extraSmall", "preview", "thumb"])
const productImageSizes: TImageSizes[] = sizesSorter(['full', 'large', 'medium', 'small', "extraSmall", "preview", "thumb"])
const carouselSizes: TImageSizes[] = sizesSorter(['full', 'carouselMaxSmall', 'carouselMaxMedium', 'carouselMaxFull'])
const colorSizes: TImageSizes[] = sizesSorter(['thumb', 'full'])


export {minTimeBetweenSendings, sendNotificationsInTG, orderStatus, imageSizes, delayForFS, allPaths, timeZoneDelta,  
    missedItem, newsImageSizes, carouselSizes, colorSizes,fiberImageSizes, productImageSizes}