import { IFetch, IMessageModal } from "src/interfaces"

const delayBetweenImagesPost = 300

const timeModalClosing = 500

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

const loadFetch: IFetch = {
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

export {delayBetweenImagesPost, clearModalMessage, resetFetch, timeModalClosing, loadFetch, errorFetch, successFetch, headerStatus}