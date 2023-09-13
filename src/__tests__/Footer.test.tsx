import { act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { changeLang, setRes } from '../assets/js/testHelpers';




describe('Footer', () => {

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


    test('should exist, have 4 links and correct language', async () => {
		act(() => {
			createRoot(container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		


		let footer = container.querySelector("[data-testid='footer']")
		expect(footer).toBeInTheDocument()
		expect(footer?.querySelector('.footer__copyright')).toBeInTheDocument()
		expect(footer?.querySelector('.footer__copyright')?.innerHTML).toMatch(/Стрежень/)
		expect(footer?.querySelectorAll('a')).toHaveLength(4)

		changeLang(container, act)

        /*let langSwitcher = container.querySelector("[data-testid='lang-switcher']")
		expect(store.getState().base.lang).toBe('ru')
		act(() => { // to en
            langSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });*/

		expect(footer?.querySelector('.footer__copyright')?.innerHTML).toMatch(/Strezhen/)

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