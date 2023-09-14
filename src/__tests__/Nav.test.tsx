import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';


describe('Nav', () => {

    let container: HTMLDivElement;
    let modalContainer: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        modalContainer = document.createElement('div');
        container.id = 'root'
        modalContainer.id = 'modal'
        document.body.appendChild(container);
        document.body.appendChild(modalContainer);
    });


    afterEach(() => {
        document.body.removeChild(container);
        document.body.removeChild(modalContainer);
    });


    test('', () => {

    })


})