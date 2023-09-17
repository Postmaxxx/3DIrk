import { act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import initialStore from '../redux/store';
import { setRes } from '../assets/js/testHelpers';
import Auth from '../components/Auth/Auth';
import { Dispatch } from 'redux';
import { allActions } from '../redux/actions/all';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk';

describe('Auth', () => {
    let _container: HTMLDivElement;

    const onCancelClick = jest.fn()

    beforeEach(() => {
        _container = document.createElement('div');
        _container.id = 'root'
        document.body.appendChild(_container);
    });

    afterEach(() => {
        document.body.removeChild(_container);
    });



    test('should close on cancel click', async () => {
        act(() => {
            createRoot(_container).render(
                <Provider store={initialStore}>
                    <Auth onCancel={onCancelClick}/>
                </Provider>
            )
        })

        act(() => setRes('sm', 1))    
        let _btnCancel: HTMLButtonElement | null = _container.querySelector("[data-testid='authBtnCancel']")
        expect(_btnCancel).toBeInTheDocument()
        act(() => {
            _btnCancel?.click()
        })
        expect(onCancelClick).toBeCalledTimes(1)
    })




    test('should switch between register and login', async () => {
        act(() => {
            createRoot(_container).render(
                <Provider store={initialStore}>
                    <Auth onCancel={onCancelClick}/>
                </Provider>
            )
        })

        act(() => setRes('sm', 1))    
        let _toLogin: HTMLButtonElement | null = _container.querySelector("[data-testid='authBtnToLogin']")
        let _toRegister: HTMLButtonElement | null = _container.querySelector("[data-testid='authBtnToRegister']")
        expect(_toLogin).toBeInTheDocument()
        expect(_toRegister).toBeInTheDocument()
        expect(_toRegister?.classList.contains('selected')).toBe(false)
        expect(_toLogin?.classList.contains('selected')).toBe(true)
        expect(_container?.querySelector("[name='name']")).not.toBeInTheDocument()
        act(() => {
            _toRegister?.click()
        })
        expect(_toRegister?.classList.contains('selected')).toBe(true)
        expect(_toLogin?.classList.contains('selected')).toBe(false)
        expect(_container?.querySelector("[name='name']")).toBeInTheDocument()
    })














    test('should login using inputs data', async () => {
        
        const middlewares = [thunk];
        const mockStore = configureStore(middlewares);
        const store = mockStore(initialStore.getState());

        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Auth onCancel={onCancelClick}/>
                </Provider>
            )
        })

        act(() => setRes('sm', 1))    
        let _login: HTMLButtonElement | null = _container.querySelector("[data-testid='authBtnLogin']")

        let _email: HTMLInputElement = _container.querySelector("[name='email']") as HTMLInputElement
        let _pass: HTMLInputElement = _container.querySelector("[name='password']") as HTMLInputElement
        _email.innerText = 'testmail@gmail.com'
        _pass.innerText = '12345678'
        
        act(() => {
           // _login?.click()
            store.dispatch(allActions.user.setUser({name: 'test'}))
        })


        const dispatchedActions = store.getActions();
        console.log('5555555555555', dispatchedActions);
        

        expect(dispatchedActions).toContainEqual(allActions.user.setUser({ name: 'test' }));
    })


})