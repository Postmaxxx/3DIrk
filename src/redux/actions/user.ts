import { IAction, IDispatch, IFullState, ILoggingForm, IUserLoginResErr, IUserLoginResOk, IUserRegisterRes, IUserState, TLangText } from "src/interfaces";
import { actionsListUser } from './actionsList'


export const setUser = <T extends IUserState>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_USER,
    payload: payload
});


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
            const result: IUserRegisterRes = await response.json() //message, errors
            if (response.status !== 201) {
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IUserRegisterRes).message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            dispatch(setUser({...user, auth: {status: 'success', message: result.message, errors: []}}))
            login({email, password})
        } catch (e) {   
            dispatch(setUser({...user,auth: {status: 'error', message: (e as IUserRegisterRes).message, errors: []}}))
        } 
    }
}




export const login = ({email, password}: ILoggingForm) => {       
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: '', ru: ''}, errors: []}}))
        const savedUser = localStorage.getItem('user')
        try {
            const response: Response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({email, password})
                })
            
            
            if (response.status !== 200) {
                const result: IUserLoginResErr = await response.json() //message, errors
                
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IUserRegisterRes).message, 
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
                orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message, errors: []},
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IUserRegisterRes).message, errors: []}}))
        } 
    }
}





export const loginWithToken = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: {status: 'fetching', message: {en: '', ru: ''}, errors: []}}))
        const savedUser = localStorage.getItem('user')
        const currentToken: string = savedUser ? await JSON.parse(savedUser).token : null
        if (!currentToken) {
            return dispatch(setUser({...user, auth: {status: 'error', message: {en: 'Token not found', ru: 'Токен не найден'}, errors: []}}))
        }
        try {
            const response: Response = await fetch('/api/auth/login-token', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    },
                })
            
            
            if (response.status !== 200) {
                const result: IUserLoginResErr = await response.json() //message, errors
                
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IUserRegisterRes).message, 
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
                orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message, errors: []},
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IUserRegisterRes).message, errors: []}}))
        } 
    }
}

