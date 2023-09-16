import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { screenSizes } from '../hooks/screenMeter';



describe('Tests for ThemeSwitcher', () => {

    let _container: HTMLDivElement;
    let _themeSwitcher: HTMLDivElement | null

    beforeEach(() => {
        _container = document.createElement('div');
        _container.id = 'root'
        document.body.appendChild(_container);
    });


    afterEach(() => {
        document.body.removeChild(_container);
    });


    test('should exist if screen.width > sm and <=sm', async () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		
		




		act(() => {
			global.innerWidth = screenSizes.sm + 1;
			global.dispatchEvent(new Event('resize'));
		})
		_themeSwitcher = _container.querySelector("[data-testid='theme-switcher']")
		
		expect(_themeSwitcher).toBeInTheDocument()
		
		
		act(() => {
			global.innerWidth = screenSizes.sm ;
			global.dispatchEvent(new Event('resize'));
		})

		_themeSwitcher = _container.querySelector("[data-testid='theme-switcher']")

		waitFor(() => {
			expect(_themeSwitcher).toBeInTheDocument()
		})



    })




	test('should change theme on click', async () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})


		// ------------------ screenSize > sm -------------------------------
		act(() => {
			global.innerWidth = screenSizes.sm + 1;
			global.dispatchEvent(new Event('resize'));
		})
        _themeSwitcher = _container.querySelector("#theme-switcher")
		expect(store.getState().base.theme).toBe('dark') 

		act(() => { // to light
            _themeSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.theme).toBe('light')

		act(() => { //to dark
            _themeSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.theme).toBe('dark')


		// ------------------ screenSize <= sm -------------------------------

		act(() => {
			global.innerWidth = screenSizes.sm;
			global.dispatchEvent(new Event('resize'));
		})
		expect(store.getState().base.mobOpened).toBe(false)


		let _navOpenerCheckbox = _container.querySelector("[data-testid='nav_mob__checkbox']")
		act(() => { 
			_navOpenerCheckbox?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(_navOpenerCheckbox).toBeInTheDocument()

		act(() => { 
			expect(store.getState().base.mobOpened).toBe(true)
        });

		
		waitFor(() => {
			_themeSwitcher = _container.querySelector("#theme-switcher")
			expect(_themeSwitcher).toBeInTheDocument()
		})

		act(() => { // to light
            _themeSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.theme).toBe('light')

		act(() => { //to dark
            _themeSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(store.getState().base.theme).toBe('dark')
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