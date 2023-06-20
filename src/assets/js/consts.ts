import { IFetch, IMessageModal } from "src/interfaces"

const delayBetweenImagesPost = 300

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



export {delayBetweenImagesPost, clearModalMessage, resetFetch}