import { INewsState } from "src/interfaces"

const initialNews = {
    load: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    loadOne: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    send: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    newsOne: {
        _id: '',
        header: {en: '', ru: ''},
        date: new Date,
        short: {en: '', ru: ''},
        text: {en: '', ru: ''},
        images: []
    },
    total: 0,
    newsList: []
} satisfies INewsState

export default initialNews