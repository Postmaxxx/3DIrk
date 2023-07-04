import { IFetch, IFiber, IFiberParam, IMessageModal, ISendColor, ISendFiber, ISendProduct, TLangText } from "src/interfaces"

const delayBetweenImagesPost: number = 300

const minTimeBetweenSendings = 1000; //in ms

const timeModalClosing: number = 500

const gapBetweenRequests: number = 2000 //time between requests in case of error

const strengthMin = 1
const strengthMax = 180

const clearModalMessage: IMessageModal = {
    status: '',
    header: '',
    text: ['']
}

const resetFetch: IFetch = {
    status: 'idle',
    message: {en: '', ru: ''},
    errors: []
}

const fetchingFetch: IFetch = {
    status: 'fetching',
    message: {en: '', ru: ''},
    errors: []
}

const errorFetch: IFetch = {
    status: 'error',
    message: {en: '', ru: ''},
    errors: []
}

const successFetch: IFetch = {
    status: 'success',
    message: {en: '', ru: ''},
    errors: []
}


const headerStatus = {
    success: {
        en: 'Success',
        ru: 'Успех'
    },
    error: {
        en: 'Error',
        ru: 'Ошибка'
    }
}


const empty: TLangText = {
    en: '',
    ru: ''
}

const selector = {
    "10": [
        {   
            value: '1',
            name: {
                en: 'none',
                ru: 'отсутствует'
            }
        },
        {   
            value: '2',
            name: {
                en: 'extremely low',
                ru: 'крайне низкая'
            }
        },
        {   
            value: '3',
            name: {
                en: 'low',
                ru: 'низкая'
            }
        },
        {   
            value: '4',
            name: {
                en: 'poor',
                ru: 'посредственная'
            }
        },
        {   
            value: '5',
            name: {
                en: 'below average',
                ru: 'ниже средней'
            }
        },
    
        {   
            value: '6',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
    
        {   
            value: '7',
            name: {
                en: 'upper average',
                ru: 'хорошая'
            }
        },
    
        {   
            value: '8',
            name: {
                en: 'hign',
                ru: 'высокая'
            }
        },
    
        {   
            value: '9',
            name: {
                en: 'very high',
                ru: 'очень высокая'
            }
        },
    
        {   
            value: '10',
            name: {
                en: 'exellent',
                ru: 'отличная'
            }
        },
    ],
    "5": [
        {   
            value: '1',
            name: {
                en: 'low',
                ru: 'низкая'
            }
        },
        {   
            value: '2',
            name: {
                en: 'below average',
                ru: 'ниже средней'
            }
        },
        {   
            value: '3',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
        {   
            value: '4',
            name: {
                en: 'upper average',
                ru: 'выше средней'
            }
        },
        {   
            value: '5',
            name: {
                en: 'high',
                ru: 'высокая'
            }
        },
    ],
    "3": [
        {   
            value: '1',
            name: {
                en: 'none',
                ru: 'отсутствует'
            }
        },
        {   
            value: '2',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
        {   
            value: '3',
            name: {
                en: 'high',
                ru: 'высокая'
            }
        },
    ]
    
}

const fiberEmpty: ISendFiber = {
    _id: '',
    name: {...empty},
    text: {...empty},
    short: {
        name:{...empty},
        text:{...empty},
    },
    proscons: {
        pros: [],
        cons: []
    },
    colors: [],
    params: {} as IFiberParam,
    files: [] as File[],
    changeImages: true
}


const productEmpty: ISendProduct = {
    _id: '',
    name: {...empty},
    text: {...empty},
    price: {...empty},
    text_short:{...empty},
    fibers: [],
    mods: [],
    category: '',
    files: [] as File[],
    changeImages: true
}


const colorEmpty: ISendColor = {
    _id: '', 
    name: {...empty}, 
    files: {
        full: new File([], ""),
        small: new File([], "")
    },
    changeImages: true
}

export {delayBetweenImagesPost, clearModalMessage, resetFetch, timeModalClosing, 
    fetchingFetch, errorFetch, successFetch, headerStatus, empty, selector, strengthMin, 
    strengthMax, minTimeBetweenSendings,fiberEmpty, productEmpty, colorEmpty, gapBetweenRequests
     }