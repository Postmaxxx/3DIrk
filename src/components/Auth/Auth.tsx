import { useState, useRef, useEffect, useMemo } from 'react'
import './auth.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICheckErrorItem, IFullState, ILoggingForm, IUserState, TLang, TLangText } from '../../interfaces';
import { setUser, register, login } from "../../redux/actions/user"
import inputChecker from '../../assets/js/inputChecker';
import { empty, resetFetch } from '../../assets/js/consts';
import { errorsChecker } from '../../assets/js/processors';
import Hider from '../tiny/Hider/Hider';

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
    const [hide, setHide] = useState<boolean>(true) //true - register, false - login
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


    const focusNext = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            //!!!
           // target?.focus();
        }
    }

    const clearErrors = () => {
        setState.user.setUser({...userState, auth: resetFetch});
    }


    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onCancel()
    }
    
    const errChecker = useMemo(() => errorsChecker({lang, min:2, max: 70}), [lang])

    const onSubmit: React.EventHandler<any> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        errChecker.clear()
        
        if (register) { 
            if (form.email.length < 2) {errChecker.add(lang === 'en' ? 'Name is too short' : 'Имя слишком короткое')}
            if (form.email.length > 30) {errChecker.add(lang === 'en' ? 'Name is too long' : 'Имя слишком длинное')}
            if (form.phone.length < 6) {errChecker.add(lang === 'en' ? 'Phone is too short' : 'Телефон слишком короткий')}
            if (form.phone.length > 20) {errChecker.add(lang === 'en' ? 'Phone is too long' : 'Телефон слишком длинный')}
            if (form.email.length < 6) {errChecker.add(lang === 'en' ? 'Email is too short' : 'Почта слишком короткая')}
            if (form.email.length > 40) {errChecker.add(lang === 'en' ? 'Email is too long' : 'Почта слишком длинная')}
            if (form.password.length < 8) {errChecker.add(lang === 'en' ? 'Password is too short' : 'Пароль слишком короткий')}

            if (form.password !== form.repassword) {
                errChecker.add(lang === 'en' ? 'Passwords do not match': 'Пароли не совпадают')
            }

            if (errChecker.amount() > 0) {
                setState.user.setUser({
                    ...userState, 
                    auth: {
                        status: 'error', 
                        message: {...empty}, 
                        errors: errChecker.result().text.map(e => ({en: e, ru: e}))}})
                return
            }
            setState.user.register(form)
        } else {
            if (form.email.length < 2) {errChecker.add(lang === 'en' ? 'Name is too short': 'Имя слишком короткое')}
            if (form.email.length > 30) {errChecker.add(lang === 'en' ? 'Name is too long': 'Имя слишком длинное')}
            if (form.password.length < 8) {errChecker.add(lang === 'en' ? 'Password is too short': 'Пароль слишком короткий')}

            if (errChecker.amount() > 0) {
                setState.user.setUser({
                    ...userState, 
                    auth: {message: {...empty}, 
                    status: 'error', 
                    errors: errChecker.result().text.map(e => ({en: e, ru: e}))}})
                return
            }
            setState.user.login(form)
        }   
    }


    const onHiderClick = () => {
        setHide(prev => !prev)
    }


    useEffect(() => {       
        if (userState.auth.status === 'success') {
            onCancel() //exit after successfull authorization
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
                                onChange={onChangeText}
                                value={form.name}
                                onKeyDown={focusNext}/>
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
                            value={form.email}
                            onChange={onChangeText} 
                            onKeyDown={focusNext}/>
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
                                value={form.phone}
                                onChange={onChangeText} 
                                onKeyDown={focusNext}/>
                        </div>}
                    <div className="input-block">
                        <label htmlFor="user_password">
                            {lang === 'en' ? 'Your password (8 symbols or more)' : 'Ваш пароль (не менее 8 символов)'}
                        </label>
                        <input 
                            className="input-element" 
                            name="password"
                            id="user_password" 
                            type={hide ? `password` : 'text'}
                            required 
                            minLength={8} 
                            maxLength={25} 
                            value={form.password}
                            onChange={onChangeText} 
                            onKeyDown={focusNext}/>
                            <Hider hidden={hide} onClick={onHiderClick}/>
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
                                type={hide ? `password` : 'text'}
                                required 
                                minLength={8} 
                                maxLength={25} 
                                value={form.repassword}
                                onChange={onChangeText} />
                        </div>}
                        {userState.auth.status === 'error' ? 
                            <div className="errors__container">
                                <span className='errors__header'>{lang === 'en' ? 'Errors' : 'Ошибки'}: </span>
                                <ul className='errors__list'>
                                    {userState.auth.errors && userState.auth.errors.length > 0 && userState.auth.errors.map((error, i) => {
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
                            <button className='button_blue' type="submit" onClick={onSubmit} disabled={userState.auth.status === 'fetching'}>
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