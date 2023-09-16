import { act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import App from '../App';
import { setRes } from '../assets/js/testHelpers';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";



describe('Auth', () => {

    let _container: HTMLDivElement;
    let _modalContainer: HTMLDivElement;

    beforeEach(() => {
        _container = document.createElement('div');
        _modalContainer = document.createElement('div');
        _container.id = 'root'
        _modalContainer.id = 'modal'
        document.body.appendChild(_container);
        document.body.appendChild(_modalContainer);
    });

    afterEach(() => {
        document.body.removeChild(_container);
        document.body.removeChild(_modalContainer);
    });




    test('should create modal on login click', async () => {

        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })


        act(() => setRes('sm', 1))       
        let _login: HTMLLIElement | null = _container.querySelector("[data-testid='btn_login_desktop']")
        expect(_login).toBeInTheDocument()

        act(() => {
            _login?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })


        await waitFor(async () => {
            let name = await store.getState().base.modal.current?.getName()
            expect(name).toBe('auth')
        })
        let _modal = _modalContainer.querySelector("[data-testid='modal']")
		expect(_modal).toBeInTheDocument()
        expect(_modal?.classList.contains('visible')).toBe(true)



        

    })


})