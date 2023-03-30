import * as actions from './actionsList'
import { IAction, IActionCreator, IDispatch, TStatus } from 'src/interfaces'

import { firebaseConfig } from 'src/config'
import { initializeApp } from 'firebase/app'
import {
	getFirestore,
	collection,
	getDocs,
    doc
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from "firebase/storage";



const appDB = initializeApp(firebaseConfig)
const db = getFirestore()
const portfoliosRef = collection(db, 'Portfolios')


const getPortfolios = async () => {
    const portSnap = await getDocs(portfoliosRef);
    portSnap.forEach(doc => {
        //console.log(doc.data());
    })
}


getPortfolios()




export const setLangEn = <T>(): IAction<T> => ({
    type: actions.SET_LANG_EN,
})

export const setLangRu = <T>(): IAction<T> => ({
    type: actions.SET_LANG_RU,
})


export const setThemeLight = <T>(): IAction<T> => ({
    type: actions.SET_THEME_LIGHT,
})

export const setThemeDark = <T>(): IAction<T> => ({
    type: actions.SET_THEME_LIGHT,
})

export const setThemeToggle = <T>(): IAction<T> => ({
    type: actions.SET_THEME_TOGGLE,
})

export const setNavOpen = <T>():IAction<T> => ({
    type: actions.SET_NAV_OPEN,
});

export const setNavClose = <T>():IAction<T> => ({
    type: actions.SET_NAV_CLOSE,
});

export const setNavToggle = <T>():IAction<T> => ({
    type: actions.SET_NAV_OPEN,
});






export const setPortfoliosStatusError = <T extends Error>(payload: T):IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_ERROR,
    payload: payload
});

export const setPortfoliosStatusLoading = <T extends Error>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_LOADING,
});


export const setPortfoliosStatusSuccess = <T extends []>(payload: T):IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_SUCCESS,
    payload: payload
});


export const setPortfoliosStatusIdle = <T>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_IDLE,
});




export const setPortfolios = ()=> {
    return function(dispatch: IDispatch) {
        dispatch(setPortfoliosStatusLoading())
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(data => {
                console.log('data', data);
                dispatch(setPortfoliosStatusSuccess(data))
            })
            .catch(error => {
                dispatch(setPortfoliosStatusError(error.message))
            })
        dispatch(setPortfoliosStatusIdle())
    }
}
    