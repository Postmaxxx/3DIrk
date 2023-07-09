const minTimeBetweenSendings: number = 500 //in ms
const sendNotificationsInTG: boolean = false
const delayForFS = 1000


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
    full: ISizesItem
    //big: ISizesItem
    spliderMain: ISizesItem
}


const sizes: IImageSizes = {//in px
    thumb: {
        h: 40,
        w: 40
    },
    preview: {
        h: 100,
        w: 100
    },
    small: {
        w: 300,
        h: 300
    },
    medium: {
        h: 600,
        w: 600
    },
    full: {
        h: 5000,
        w: 5000
    },
    spliderMain: {
        w: 720,
        h: 400
    }
    
}

export {minTimeBetweenSendings, sendNotificationsInTG, orderStatus, sizes, delayForFS, allPaths, ISizesItem, IImageSizes}