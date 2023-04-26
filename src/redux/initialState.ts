import { IState } from '../interfaces'

let initialState = {} as IState

initialState = {
    ...initialState,
    theme: 'light',
    lang: 'Ru',
    portfolios: {
        //status: 'idle',
        list: []
    },
    sliderMax: {
        dataLoading: {
            status: 'idle',
            lang: 'En',
            message: '',
        },
        list: []
    },
    fibers: {
        dataLoading: {
            status: 'idle',
            lang: 'En',
            message: '',
        },
        list: []
    },
    nav: {
        mobOpened: false,
        desktopOpened: true
    }
}


export default initialState;