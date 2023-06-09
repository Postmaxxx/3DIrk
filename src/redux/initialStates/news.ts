import { INewsState } from "src/interfaces"

const initialNews = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    dataSending: {
        status: 'idle',
        message: ""
    },
    newsList: []
} satisfies INewsState

export default initialNews