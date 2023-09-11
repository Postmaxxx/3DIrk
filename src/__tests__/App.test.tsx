import { render, act, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux'; // Import any necessary dependencies
import store from '../redux/store'; // Import your Redux store
import { Component, Suspense } from 'react';
import Preloader from '../components/Preloaders/Preloader';
import React from 'react'
import { localStorageMock } from '../mocks/localStorageMock';
import '@testing-library/jest-dom/extend-expect'
global.document = window.document;
global.window = window;
global.HTMLElement = window.HTMLElement;
global.localStorage = localStorageMock();


Object.defineProperty(document, 'documentElement', {
    writable: true,
    value: {
        scrollTop: 600, // Set the initial scrollTop value
    },
});





describe('Tests for App', () => {

    test('localStorage should work', () => {
        localStorage.setItem('myKey', 'myValue');
        const value = localStorage.getItem('myKey');
        expect(value).toBe('myValue');
        localStorage.removeItem('myKey');
        expect(localStorage.getItem('myKey')).toBeNull();
      });
           
      

    test('Homer exists and works', () => {
        act(() => {
            render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })
       
        act(() => {
            const homer = screen.getByTestId('homer')
            expect(homer).toBeInTheDocument()
            fireEvent.click(homer)
            expect(document.documentElement.scrollTop).toBe(0);
            expect(homer.classList.contains('show')).toBe(false)
        })


       /* act(() => {
            const offliner = screen.getByTestId('offliner')
            expect(offliner).toBeInTheDocument()
        })*/
    })


})