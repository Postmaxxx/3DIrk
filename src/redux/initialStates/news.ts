import { empty, resetFetch } from "src/assets/js/consts"
import { INewsState } from "src/interfaces"

const initialNews = {
    load: resetFetch,
    loadOne: resetFetch,
    send: resetFetch,
    newsOne: {
        _id: '',
        header: empty,
        date: new Date,
        short: empty,
        text: empty,
        images: []
    },
    total: 0,
    newsList: []
} satisfies INewsState

export default initialNews