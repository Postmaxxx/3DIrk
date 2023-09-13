import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { setRes } from '../assets/js/testHelpers';





describe('LangSwitcher', () => {

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


    test('should exist if screen.width > sm and <=sm', async () => {
		act(() => {
			createRoot(container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		
		act(() => {
			setRes('sm', 1)
		})
		
		let langSwitcher = container.querySelector("[data-testid='lang-switcher']")
		expect(langSwitcher).toBeInTheDocument()
		
		
		act(() => {
			setRes('sm')
		})

		langSwitcher = container.querySelector("[data-testid='lang-switcher']")
		waitFor(() => {
			expect(langSwitcher).toBeInTheDocument()
		})

    })




	test('should change language on click', async () => {
		act(() => {
			createRoot(container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		// ------------------ screenSize > sm -------------------------------
		act(() => {
			setRes('sm', 1)
		})
        let langSwitcher = container.querySelector("[data-testid='lang-switcher']")
		expect(store.getState().base.lang).toBe('ru')

		act(() => { // to en
            langSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.lang).toBe('en')

		act(() => { //to ru
            langSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.lang).toBe('ru')

		// ------------------ screenSize <= sm -------------------------------

		/*act(() => {
			setRes('sm')
		})*/

		langSwitcher = container.querySelector("[data-testid='lang-switcher']")
		expect(langSwitcher).toBeInTheDocument()


		let navOpenerCheckbox = container.querySelector("[data-testid='nav_mob__checkbox']")

		expect(store.getState().base.lang).toBe('ru')
		expect(store.getState().base.mobOpened).toBe(false)
		expect(navOpenerCheckbox).toBeInTheDocument()

		act(() => { 
			navOpenerCheckbox?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

		expect(store.getState().base.mobOpened).toBe(true)
		
		waitFor(() => {
			langSwitcher = container.querySelector("[data-testid='lang-switcher']")
			expect(langSwitcher).toBeInTheDocument()
		})

		act(() => { // to en
            langSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.lang).toBe('en')

		act(() => { //to ru
            langSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.lang).toBe('ru')
    })


})











/*
export function main() {
  if (navigator.onLine) {
    console.log('online');
  } else {
    console.log('offline');
  }
}



describe('main', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('should log "online"', () => {
    const logSpy = jest.spyOn(console, 'log');
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
    main();
    expect(logSpy).toBeCalledWith('online');
  });

  test('should log "offline"', () => {
    const logSpy = jest.spyOn(console, 'log');
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
    main();
    expect(logSpy).toBeCalledWith('offline');
  });
});






await waitFor(() => expect(something).toBe(something)
*/