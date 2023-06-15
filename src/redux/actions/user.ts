import { IAction, IDispatch, IErrRes, IFullState, ILoggingForm, IUserLoginResOk, IUserState, TLangText } from "src/interfaces";
import { actionsListUser } from './actionsList'
import { setName, setEmail, setPhone } from "./order";

export const setUser = <T extends IUserState>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_USER,
    payload: payload
});


export const loadToken = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: 'Loading token', ru: 'Загрузка токена'}, errors: []}}))
        try {
            const savedUser = localStorage.getItem('user')
            
            const currentToken: string = savedUser ? JSON.parse(savedUser).token : null
            if (currentToken) {
                dispatch(setUser({...user, token: currentToken, auth: {status: 'success', message: {en: 'User token loaded', ru: 'Токен пользователя загружен'}, errors: []}}))
            }
        } catch (e) {   
            dispatch(setUser({...user,auth: {status: 'error', message: {en: 'Error while token loading', ru: 'Ошибка в процессе загрузки токена'}, errors: []}}))
        } 
    }
};


export const register = ({name, email, phone, password}: ILoggingForm) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: '', ru: ''}, errors: []}}))
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({name, email, phone, password})
            })    
            const result: IErrRes = await response.json() //message, errors
            if (response.status !== 201) {
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: result.message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            await login({email, password})(dispatch, getState)
        } catch (e) {   
            dispatch(setUser({...user,auth: {status: 'error', message: (e as IErrRes).message, errors: []}}))
        } 
    }
}




export const login = ({email, password}: ILoggingForm) => {         
    return async function(dispatch: IDispatch, getState: () => IFullState) {              
        const { user, order } = getState() //get current user state
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: '', ru: ''}, errors: []}}))
        try {
            const response: Response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({email, password})
                })
            
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            
            const result: IUserLoginResOk = await response.json() //message, errors
            
            dispatch(setUser({
                ...user, 
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                //orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message, errors: []},
                isAdmin: result.user.isAdmin
            }))

            dispatch(setName( result.user.name))
            dispatch(setPhone( result.user.phone))
            dispatch(setEmail( result.user.email))

            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message, errors: []}}))
        } 
    }
}





export const loginWithToken = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        if (!user.token && user.auth.status !== 'fetching') {
            loadToken()(dispatch, getState);
        }

        if (user.auth.status !== 'success') return
        
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: '', ru: ''}, errors: []}}))
        if (!user.token) {
            return dispatch(setUser({...user, auth: {status: 'error', message: {en: 'Token not found', ru: 'Токен не найден'}, errors: []}}))
        }
        
        try {
            const response: Response = await fetch('/api/auth/login-token', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                })
            
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setUser({
                    ...user, 
                    token: '',
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            const result: IUserLoginResOk = await response.json() //message, errors
            dispatch(setUser({
                ...user, 
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                //orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message, errors: []},
                isAdmin: result.user.isAdmin
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message, errors: []}}))
        } 
    }
}

