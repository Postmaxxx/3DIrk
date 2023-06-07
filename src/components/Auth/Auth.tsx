import { useState, useRef, useEffect, useMemo } from 'react'
import './auth.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICheckErrorItem, IFullState, ILoggingForm, IUserState, TLang, TLangText } from 'src/interfaces';
import { setUser, register, login } from "../../redux/actions/user"
import inputChecker from 'src/assets/js/inputChecker';
import { isErrored } from 'stream';

const actionsListUser = { setUser, register, login }


interface IPropsState {
    lang: TLang,
    userState: IUserState
}

interface IPropsActions {
    setState: {
        user: typeof actionsListUser
    }
}


interface IProps extends IPropsState, IPropsActions {
    onCancel: () => void
}



const Auth: React.FC<IProps> = ({lang, userState, setState, onCancel}): JSX.Element => {

    const [register, setRegister] = useState<boolean>(false) //true - register, false - login
    const _name = useRef<HTMLInputElement>(null)
    const _email = useRef<HTMLInputElement>(null)
    const _phone = useRef<HTMLInputElement>(null)
    const _password = useRef<HTMLInputElement>(null)
    const _rePassword = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState<ILoggingForm>({name: userState.name, email: userState.email, phone: userState.phone, password: '', repassword: ''})

    const onChangeText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const key = e.target.name as keyof ILoggingForm
        setForm({...form, [key]: e.target.value});
        (e.target as HTMLElement).parentElement?.classList.remove('error')
        if (status !== 'idle') {
            clearErrors()
        }
    }

    const status = useMemo(() => userState.auth.status, [userState.auth.status])

    const focusNext = ({e, target}: {e: KeyboardEvent, target: HTMLInputElement | HTMLTextAreaElement | null}) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            target?.focus();
        }
    }

    const clearErrors = () => {
        setState.user.setUser({...userState, auth: {status: 'idle', message: {en: '', ru: ''}, errors: []}});
    }


    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onCancel()
    }
    



    const onSubmit: React.EventHandler<any> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (register) { 
            const feildsToCheck: Array<ICheckErrorItem> = [
                {ref: _name, name: {en: 'Your name', ru: 'Ваше имя'}},
                {ref: _email, name: {en: 'Your email', ru: 'Ваша почта'}},
                {ref: _phone, name: {en: 'Your phone', ru: 'Ваш телефон'}},
                {ref: _password, name: {en: 'Your password', ru: 'Ваш пароль'}},
                {ref: _rePassword, name: {en: 'Repeat your password', ru: 'Повторите ваш пароль'}},
            ]
            const {isWrong, header, errors} = inputChecker(feildsToCheck)
            if (_password.current?.value !== _rePassword.current?.value) {
                errors.push({en: 'Passwords do not match', ru: 'Пароли не совпадают'})
            }

            if (isWrong) {
                setState.user.setUser({...userState, auth: {status: 'error', message: header, errors}})
                return
            }
            setState.user.register({...form})
        } else {
            const feildsToCheck: Array<ICheckErrorItem> = [
                {ref: _email, name: {en: 'Your email', ru: 'Ваша почта'}},
                {ref: _password, name: {en: 'Your password', ru: 'Ваш пароль'}},
            ]
            const {isWrong, header, errors} = inputChecker(feildsToCheck)

            if (isWrong) {
                setState.user.setUser({...userState, auth: {status: 'error', message: header, errors}})
                return
            }
            setState.user.login({...form})
        }   
    }



    useEffect(() => {
        if (register) {
            if (userState.auth.status === 'success') {
                console.log('now we should logging in...');
            }
        } else {
            if (userState.auth.status === 'success') {
                console.log('now we are logged in...');
                onCancel()
            }
        }
    }, [userState.auth.status])



    useEffect(() => {
        clearErrors()
    }, [])

   

    return (
        <div className="login">
            <div className="form__container">
                <div className="sign-selector__container">
                    <button className={`button_select ${register ? '' : 'selected'}`} onClick={() => setRegister(false)}>Login</button>
                    <button className={`button_select ${register ? 'selected' : ''}`} onClick={() => setRegister(true)}>Register</button>
                </div>
                <form className='login__form'>
                    {register &&
                        <div className="input-block">
                            <label htmlFor="name">
                                {lang === 'en' ? 'Your name' : 'Ваше имя'}
                            </label>
                            <input 
                                className="input-element"
                                name="name"
                                id="user_user_name" 
                                type="text" 
                                required 
                                minLength={2} 
                                maxLength={25} 
                                ref={_name} 
                                onChange={onChangeText}
                                value={form.name}
                                onKeyDown={(e:any) => focusNext({e, target: _email.current})}/>
                        </div>}
                    <div className="input-block">
                        <label htmlFor="user_email">
                            {lang === 'en' ? 'Your email' : 'Ваша почта'}
                        </label>
                        <input 
                            className="input-element" 
                            name="email"
                            id="user_email" 
                            type="email" 
                            required 
                            minLength={5} 
                            maxLength={35} 
                            ref={_email} 
                            value={form.email}
                            onChange={onChangeText} 
                            onKeyDown={(e:any) => focusNext({e, target: _phone.current})}/>
                    </div>
                    {register &&
                        <div className="input-block">
                            <label htmlFor="user_phone">
                                {lang === 'en' ? 'Your phone' : 'Ваш телефон'}
                            </label>
                            <input 
                                className="input-element" 
                                name="phone"
                                id="user_phone" 
                                type="tel" 
                                required 
                                minLength={2} 
                                maxLength={25} 
                                ref={_phone} 
                                value={form.phone}
                                onChange={onChangeText} 
                                onKeyDown={(e:any) => focusNext({e, target: _password.current})}/>
                        </div>}
                    <div className="input-block">
                        <label htmlFor="user_password">
                            {lang === 'en' ? 'Your password (8 symbols or more)' : 'Ваш пароль (не менее 8 символов)'}
                        </label>
                        <input 
                            className="input-element" 
                            name="password"
                            id="user_password" 
                            type="password" 
                            required 
                            minLength={8} 
                            maxLength={25} 
                            ref={_password} 
                            value={form.password}
                            onChange={onChangeText} 
                            onKeyDown={(e:any) => focusNext({e, target: _rePassword.current})}/>
                    </div>
                    {register &&
                        <div className="input-block">
                            <label htmlFor="user_repassword">
                                {lang === 'en' ? 'Repeat your password' : 'Повторите ваш пароль'}
                            </label>
                            <input 
                                className="input-element" 
                                name="repassword"
                                id="user_repassword" 
                                type="password" 
                                required 
                                minLength={8} 
                                maxLength={25} 
                                value={form.repassword}
                                ref={_rePassword} 
                                onChange={onChangeText} />
                        </div>}
                        {userState.auth.status === 'error' ? 
                            <div className="errors__container">
                                <span className='errors__header'>{lang === 'en' ? 'Errors' : 'Ошибки'}: </span>
                                <span className='errors__name'>{userState.auth.message[lang]}</span>
                                <ul className='errors__list'>
                                    {userState.auth.errors.length > 0 && userState.auth.errors.map((error, i) => {
                                        return (
                                            <li key={i} className='errors__item'>{error[lang]}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        :
                            null    
                        }
                        <div className="control__container">
                            <button className={`button_blue ${userState.auth.status === 'fetching' ? 'disabled' : ''}`} type="submit" onClick={onSubmit} disabled={userState.auth.status === 'fetching'}>
                                {register ? 
                                    lang === 'en' ? 'Register' : 'Регистрация' 
                                    :  
                                    lang === 'en' ? 'Login' : 'Вход'}
                                </button>
                            <button className='button_blue' onClick={e => onCancelClick(e)}>{
                                lang === 'en' ? 'Cancel' : 'Отмена'}
                            </button>
                        </div>
                </form>
            </div>
        </div>
        
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		user: bindActionCreators(actionsListUser, dispatch),
	}
})
  
    
    
export default connect(mapStateToProps, mapDispatchToProps)(Auth)