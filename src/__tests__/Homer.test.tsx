import { render, screen, fireEvent, waitFor, act  } from '@testing-library/react';
//import { act } from 'react-dom/test-utils';
import App from '../App';
import { Provider } from 'react-redux'; // Import any necessary dependencies
import store from '../redux/store'; // Import your Redux store
import { Component, Suspense } from 'react';
import Preloader from '../components/Preloaders/Preloader';
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import ReactDOM from 'react-dom/client';
import Offliner from '../components/Offliner/Offliner';
import Homer from '../components/Homer/Homer';






describe('Tests for Homer', () => {

    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'root'
        document.body.appendChild(container);
        jest.restoreAllMocks();
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

     

    test('should exist and scroll page to top', () => {
        act(() => {
            ReactDOM.createRoot(container).render(<Homer />);
        })
        const homer = container.querySelector('.homer')
        expect(homer).toBeInTheDocument()
        homer?.classList.add('show')
        document.documentElement.scrollTop = 700
        document.body.scrollTop = 700

        act(() => {
            homer?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

        expect(document.documentElement.scrollTop).toBe(0)
        expect(document.body.scrollTop).toBe(0)
    })




})
