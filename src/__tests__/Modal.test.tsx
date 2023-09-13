import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { setRes } from '../assets/js/testHelpers';




describe('Modal', () => {

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


   /* test('should exist', async () => {
		 act(() => {
			createRoot(container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		
		let modal = modalContainer.querySelector("[data-testid='modal']")
		expect(modal).toBeInTheDocument()
    })*/


	test('should be opened and render component', async () => {
		/*act(() => {
		   createRoot(container).render(
			   <Provider store={store}>
				   <Suspense fallback={<Preloader />}>
					   <App />
				   </Suspense>
			   </Provider>)
		})  
		let modal = modalContainer.querySelector("[data-testid='modal']")
		const modalController = store.getState().base.modal.current
	 	expect(modalController?.getName()).toBeNull //modal has no opened windows at start
	   
		act(() => {
			modalController?.openModal({
				name: 'test1', 
				children: <div>Child for test Modal</div>
			})
		}) 
		waitFor(() => {
			expect(modal?.classList.contains('visible')).toBe(false)
		})*/
		//expect(modalController?.getName()).toBe('test1') //modal has no opened windows at start
	   /*waitFor(() => {
		   expect(modal?.querySelector('.modal__copyright')?.innerHTML).toMatch(/Strezhen/)
	   })*/
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