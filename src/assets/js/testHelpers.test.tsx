import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Preloader from '../../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../../App';
import { changeLang, setRes } from './testHelpers';
import { screenSizes } from '../../hooks/screenMeter';



describe('setRes', () => {

    test('should return sm', async () => {
        await setRes('sm')
        await waitFor(() => {
            expect(global.innerWidth).toBe(screenSizes.sm)
        })
    })

    test('should return xs + 10', async () => {
        await setRes('xs', 10)
        await waitFor(() => {
            expect(global.innerWidth).toBe(screenSizes.xs + 10)
        })
    })

    test('should return xl - 5', async () => {
        await setRes('xl', -5)
        await waitFor(() => {
            expect(global.innerWidth).toBe(screenSizes.xl - 5)
        })
    })

})



describe('changeLang', () => {
    let _container: HTMLDivElement;

    beforeEach(() => {
        _container = document.createElement('div');
        _container.id = 'root'
        document.body.appendChild(_container);
		jest.restoreAllMocks();
    });


    afterEach(() => {
        document.body.removeChild(_container);
    });

    test('should change lang for < sm', async () => {
		await act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        await act(async () => {
            changeLang(_container, act)
        })

        const langSwitcher = _container.querySelector("[data-testid='lang-switcher']")
        await waitFor(() => {
			expect(langSwitcher).toBeInTheDocument()
		})
    })



})