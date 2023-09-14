import { act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { changeLang } from '../assets/js/testHelpers';




describe('Footer', () => {

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


    test('should exist, have 4 links and correct language', async () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		


		let _footer = _container.querySelector("[data-testid='footer']")
		expect(_footer).toBeInTheDocument()
		expect(_footer?.querySelector('.footer__copyright')).toBeInTheDocument()
		expect(_footer?.querySelector('.footer__copyright')?.innerHTML).toMatch(/Стрежень/)
		expect(_footer?.querySelectorAll('a')).toHaveLength(4)
		expect(store.getState().base.lang).toBe('ru')
		changeLang(_container, act)
		expect(_footer?.querySelector('.footer__copyright')?.innerHTML).toMatch(/Strezhen/)

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