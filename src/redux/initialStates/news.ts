import { empty, resetFetch } from "../../assets/js/consts"
import { INewsState } from "../../interfaces"

const initialNews = {
    load: resetFetch,
    loadOne: resetFetch,
    send: resetFetch,
    newsOne: {
        _id: '',
        header: {...empty},
        date: new Date,
        short: {...empty},
        text: {...empty},
        images: {
            basePath: '',
            files: [],
            sizes: []
        }
    },
    total: 0,
    newsList: []
} satisfies INewsState

export default initialNews