import { INewsState } from "src/interfaces"

const initialNews = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    news: []
} satisfies INewsState

export default initialNews