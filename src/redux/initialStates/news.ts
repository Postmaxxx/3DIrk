import { INewsState } from "src/interfaces"

const initialNews = {
    load: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    send: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    newsList: []
} satisfies INewsState

export default initialNews