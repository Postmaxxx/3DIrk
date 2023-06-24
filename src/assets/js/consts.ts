import { IFetch, IMessageModal, TLangText } from "src/interfaces"

const delayBetweenImagesPost: number = 300

const timeModalClosing: number = 500

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

export {delayBetweenImagesPost, clearModalMessage, resetFetch, timeModalClosing, fetchingFetch, errorFetch, successFetch, headerStatus, empty, selector, strengthMin, strengthMax}