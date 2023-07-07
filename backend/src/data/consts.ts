const minTimeBetweenSendings: number = 500 //in ms
const sendNotificationsInTG: boolean = false


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

interface ISizes {
    thumb: ISizesItem
    preview: ISizesItem
    small: ISizesItem
    medium: ISizesItem
    //big: ISizesItem
    special: {
        spliderMain: ISizesItem
    }
}


const sizes: ISizes = {//in px
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
    /*big: {
        h: 900,
        w: 900
    },*/
    special: {
        spliderMain: {
            w: 800,
            h: 400
        }
    }
}

export {minTimeBetweenSendings, sendNotificationsInTG, orderStatus, sizes, ISizes, ISizesItem}