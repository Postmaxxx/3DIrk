import { useState, useEffect, useMemo } from 'react'
import './auth.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFullState, ILoggingForm, IUserState, TLang } from '../../interfaces';
import { inputsProps, resetFetch } from '../../assets/js/consts';
import { deepCopy, focusMover, prevent } from '../../assets/js/processors';
import InputHider from '../InputHider/InputHider';
import { inputChecker } from '../../assets/js/processors';

import { allActions } from "../../redux/actions/all";
import { IModalFunctions } from '../Modal/ModalNew';

interface IPropsState {
    lang: TLang
    userState: IUserState
    modal: IModalFunctions | null
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
    }
}

interface IProps extends IPropsState, IPropsActions {
    onCancel: () => void
}


const Auth: React.FC<IProps> = ({lang, userState, setState, modal, onCancel}): JSX.Element => {

    const [register, setRegister] = useState<boolean>(false) //true - register, false - login
    const [hidePass, setHidePass] = useState<boolean>(true) //true - hide passwords, false - show
    const [formData, setFormData] = useState<ILoggingForm>({name: userState.name, email: userState.email, phone: userState.phone, password: '', repassword: ''})
    const processedContainer = '[data-selector="auth-form"]'
    
    const focuser = useMemo(() => focusMover(), [lang])
    

    const onChangeText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const key = e.target.name as keyof ILoggingForm
        setFormData({...formData, [key]: e.target.value});
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value');
        (userState.auth.status === 'error') && setState.user.setAuth(deepCopy(resetFetch))
    }

    
    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        onCancel()
    }
    

    const onSubmit: React.EventHandler<any> = (e) => {
        prevent(e)
        //check errors
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = document.querySelector(processedContainer)?.querySelectorAll('.incorrect-value') || []
        if (errorFields?.length > 0) return
        register ? setState.user.register(formData) : setState.user.login(formData)
    }



    useEffect(() => { 
        userState.auth.status === 'success' && onCancel()  //exit after successfull authorization
    }, [userState.auth.status])



    useEffect(() => {
        focuser.create({container: processedContainer})
        modal?.contentChanged();
        (userState.auth.status === 'error') && setState.user.setAuth(deepCopy(resetFetch))
    }, [register, lang])


    const errorsList = useMemo(() => {
        return userState.auth.errors?.map((error, i) => <li key={i} className='errors__item'>{error[lang]}</li>)
    }
    , [userState.auth.errors])


   
    return (
        <div className="login">
            <div className="form__container">
                <div className="sign-selector__container">
                    <button className={`button_select ${register ? '' : 'selected'}`} onClick={() => setRegister(false)} data-testid='authBtnToLogin'>Login</button>
                    <button className={`button_select ${register ? 'selected' : ''}`} onClick={() => setRegister(true)} data-testid='authBtnToRegister'>Register</button>
                </div>
                <div className='login__form' data-selector="auth-form">
                    {register &&
                    <div className="block_input" data-selector="input-block">
                        <label htmlFor="authUserName">{lang === 'en' ? 'Your name' : 'Ваше имя'}</label>
                        <input 
                            id='authUserName'
                            data-selector="input"
                            name="name"
                            type="text" 
                            onChange={onChangeText}
                            value={formData.name}
                            onBlur={(e) => inputChecker({lang, min: inputsProps.name.min, max:inputsProps.name.max, el: e.target})}/>
                    </div>}
                    <div className="block_input" data-selector="input-block">
                        <label htmlFor="authUserEmail">{lang === 'en' ? 'Your email' : 'Ваша почта'}</label>
                        <input 
                            id='authUserEmail'
                            data-selector="input"
                            className="input-element" 
                            name="email"
                            type="email" 
                            value={formData.email}
                            onChange={onChangeText} 
                            onBlur={(e) => inputChecker({lang, min:inputsProps.email.min, max:inputsProps.email.max, type: 'email', el: e.target})}/>
                    </div>
                    {register &&
                        <div className="block_input" data-selector="input-block">
                            <label htmlFor="authUserPhone">{lang === 'en' ? 'Your phone' : 'Ваш телефон'}</label>
                            <input 
                                id='authUserPhone'
                                data-selector="input"
                                className="input-element" 
                                name="phone"
                                type="tel" 
                                value={formData.phone}
                                onChange={onChangeText} 
                                onBlur={(e) => inputChecker({lang, min:inputsProps.phone.min, max:inputsProps.phone.max, type: 'phone', el: e.target})}/>
                        </div>
                    }
                    <div className="block_input" data-selector="input-block">
                        <label htmlFor="authUserPassword">{lang === 'en' ? 'Your password' : 'Ваш пароль'}</label>
                        <input 
                            id='authUserPassword'
                            data-selector="input"
                            className="input-element" 
                            name="password"
                            type={hidePass ? `password` : 'text'}
                            value={formData.password}
                            onChange={onChangeText} 
                            onBlur={(e) => inputChecker({lang, min:inputsProps.password.min, max:inputsProps.password.max, el: e.target})}
                        />
                        <InputHider hidden={hidePass} onClick={() => setHidePass(prev => !prev)} lang={lang}/>
                    </div>
                    {register &&
                        <div className="block_input" data-selector="input-block">
                            <label htmlFor="authUserRepassword">{lang === 'en' ? 'Repeat your password' : 'Повторите ваш пароль'}</label>
                            <input 
                                id='authUserRepassword'
                                data-selector="input"
                                className="input-element" 
                                name="repassword"
                                type={hidePass ? `password` : 'text'}
                                value={formData.repassword}
                                onChange={onChangeText}
                                onBlur={(e) => inputChecker({lang, min:inputsProps.password.min, max:inputsProps.password.max, el: e.target, exact: formData.password})}/>
                        </div>
                    }
                    {userState.auth.status === 'error' &&
                        <div className="errors__container" data-testid='authErrorsContainer'>
                            <span className='errors__header'>{lang === 'en' ? 'Errors' : 'Ошибки'}: </span>
                            <ul className='errors__list'>
                                {userState.auth.errors && userState.auth.errors.length > 0 && errorsList}
                            </ul>
                        </div>
                    }
                    <div className="control__container">
                        <button className='button_blue color_reverse' type="submit" onClick={onSubmit} disabled={userState.auth.status === 'fetching'} data-testid='authBtnLogin'>
                            {register ? 
                                lang === 'en' ? 'Register' : 'Регистрация' 
                                :  
                                lang === 'en' ? 'Login' : 'Вход'
                            }
                        </button>
                        <button className='button_blue color_reverse' onClick={onCancelClick} data-testid='authBtnCancel'>{lang === 'en' ? 'Cancel' : 'Отмена'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user,
    modal: state.base.modal.current
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  
    
    
export default connect(mapStateToProps, mapDispatchToProps)(Auth)