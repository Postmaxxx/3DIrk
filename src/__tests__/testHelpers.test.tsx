import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { changeLang, setRes } from '../assets/js/testHelpers';
import { screenSizes } from '../hooks/screenMeter';



describe('setRes', () => {

    test('should return sm', () => {
        setRes('sm')
        expect(global.innerWidth).toBe(screenSizes.sm)
    })

    test('should return xs + 10', () => {
        setRes('xs', 10)
        expect(global.innerWidth).toBe(screenSizes.xs + 10)
    })

    test('should return xl - 5', () => {
        setRes('xl', -5)
        expect(global.innerWidth).toBe(screenSizes.xl - 5)
    })

})



describe('changeLang', () => {
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

    test('should change lang for < sm', async () => {
		act(() => {
			createRoot(container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        //setRes('xs')
        changeLang(container, act)


        const langSwitcher = container.querySelector("[data-testid='lang-switcher']")
        waitFor(() => {
			expect(langSwitcher).toBeInTheDocument()
		})

    })



})