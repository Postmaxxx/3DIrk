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
    total: 0,
    newsList: []
} satisfies INewsState

export default initialNews