import { useState, useEffect, useMemo, useRef } from 'react'
import './auth.scss'
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFullState, IUserState, TLang } from '../../interfaces';
import { inputsProps, resetFetch } from '../../assets/js/consts';
import { deepCopy, prevent } from '../../assets/js/processors';
import InputHider from '../InputHider/InputHider';
import { allActions } from "../../redux/actions/all";
import { IModalFunctions } from '../Modal/Modal';
import BlockInput, { IBlockInputFunctions } from '../BlockInput/BlockInput';

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
    const _userName = useRef<IBlockInputFunctions>(null)
    const _userEmail = useRef<IBlockInputFunctions>(null)
    const _userPhone = useRef<IBlockInputFunctions>(null)
    const _userPassword = useRef<IBlockInputFunctions>(null)
    const _userRePassword = useRef<IBlockInputFunctions>(null)
    
    
    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        prevent(e)
        onCancel()
    }
    

    const onSubmit: React.EventHandler<any> = (e): void => {
        prevent(e)
        //check errors
        const errors: string[] = [_userName, _userEmail, _userPhone, _userPassword, _userRePassword]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]
        if (errors.length > 0 ) return
        const user = {
            name: _userName.current?.getValue() as string,
            email: _userEmail.current?.getValue() as string,
            phone: _userPhone.current?.getValue() as string,
            password: _userPassword.current?.getValue() as string,
        }
        register ? setState.user.register(user) : setState.user.login(user)
    }



    useEffect(() => { 
        userState.auth.status === 'success' && onCancel()  //exit after successfull authorization
    }, [userState.auth.status])



    useEffect(() => {
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
                        <BlockInput 
                            lang={lang}
                            labelText={{en: 'Your name', ru: 'Ваше имя'}}
                            required
                            id="auth-user-name"
                            rules={{min:inputsProps.name.min, max:inputsProps.name.max}}
                            ref={_userName}
                        />}
                    <BlockInput 
                        lang={lang}
                        labelText={{en: 'Your email', ru: 'Ваша почта'}}
                        required
                        inputType='email'
                        id="auth-user-email"
                        rules={{min:inputsProps.email.min, max:inputsProps.email.max, type: 'email'}}
                        ref={_userEmail}
                    />
                    {register &&
                        <BlockInput 
                            lang={lang}
                            labelText={{en: 'Your phone', ru: 'Ваш телефон'}}
                            inputType='tel'
                            id="auth-user-phone"
                            rules={{min:inputsProps.phone.min, max:inputsProps.phone.max, type: 'phone'}}
                            ref={_userPhone}
                        />}
                    <BlockInput 
                        lang={lang}
                        labelText={{en: 'Your password', ru: 'Ваш пароль'}}
                        required
                        inputType={hidePass ? `password` : 'text'}
                        id="auth-user-password"
                        rules={{min:inputsProps.password.min, max:inputsProps.password.max}}
                        ref={_userPassword}>
                        <InputHider hidden={hidePass} onClick={() => setHidePass(prev => !prev)} lang={lang}/>
                    </BlockInput>

                    {register &&
                        <BlockInput 
                            lang={lang}
                            labelText={{en: 'Repeat your password', ru: 'Повторите ваш пароль'}}
                            required
                            inputType={hidePass ? `password` : 'text'}
                            id="auth-user-repassword"
                            rules={{min:inputsProps.password.min, max:inputsProps.password.max, exact: _userPassword.current?.getValue() || ''}}
                            ref={_userRePassword} 
                        />
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
                            {register ? lang === 'en' ? 'Register' : 'Регистрация' : lang === 'en' ? 'Login' : 'Вход'}
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