import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';





describe('Modal', () => {

    let _container: HTMLDivElement;
    let _modalContainer: HTMLDivElement;
	let itemName: string | null | undefined


    beforeEach(() => {
        _container = document.createElement('div');
        _modalContainer = document.createElement('div');
        _container.id = 'root'
        _modalContainer.id = 'modal'
        document.body.appendChild(_container);
        document.body.appendChild(_modalContainer);
    });


    afterEach(() => {
        document.body.removeChild(_container);
        document.body.removeChild(_modalContainer);
    });


    test('should exist', async () => {
		 act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
		
		let _modal = _modalContainer.querySelector("[data-testid='modal']")
		expect(_modal).toBeInTheDocument()
    })


	test('should be opened and render component on request', async () => {
		act(() => {
		   createRoot(_container).render(
			   <Provider store={store}>
				   <Suspense fallback={<Preloader />}>
					   <App />
				   </Suspense>
			   </Provider>)
		})  
		const modalController = store.getState().base.modal.current
		
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})

		expect(itemName).toBeNull //modal has no items at start
		
		act(() => {
			modalController?.openModal({
				name: 'test1', 
				children: <div data-testid='modalChild-1'>Child for test Modal 1</div>
			})
		}) 

		await waitFor(async () => {
			itemName = await modalController?.getName()
		})

		expect(itemName).toBe('test1') //modal active item is test1
		
		let _modal = _modalContainer.querySelector("[data-testid='modal']")
		expect(_modal?.classList.contains('visible')).toBe(true)
		expect(_modalContainer.querySelector("[data-testid='modalChild-1']")).toBeInTheDocument()	
   	})


	


   	test('should add and remove items to/from queue', async () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})  
		let _modal = _modalContainer.querySelector("[data-testid='modal']")
		const modalController = store.getState().base.modal.current

		// ------------ add 4 modal windows
		act(() => {
			modalController?.openModal({
				name: 'test1', 
				children: <div data-testid='modalChild-1'>Child for test Modal 1</div>
			})
			modalController?.openModal({
				name: 'test2', 
				children: <div data-testid='modalChild-2'>Child for test Modal 2</div>
			})
			modalController?.openModal({
				name: 'test3', 
				children: <div data-testid='modalChild-3'>Child for test Modal 3</div>
			})
			modalController?.openModal({ 
				children: <div data-testid='modalChild-3'>Child for test Modal 3</div>
			})
			modalController?.openModal({
				name: 'test4', 
				children: <div data-testid='modalChild-4'>Child for test Modal 4</div>
			})
		}) 
	
		expect(_modal?.classList.contains('visible')).toBe(true)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBe('test1') 
		expect(_modalContainer.querySelector("[data-testid='modalChild-1']")).toBeInTheDocument()	

		//close current item, the second should be active
		act(() => { 
			modalController?.closeCurrent()
		}) 
		expect(_modal?.classList.contains('visible')).toBe(true)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBe('test2') 
		expect(_modalContainer.querySelector("[data-testid='modalChild-2']")).toBeInTheDocument()	


		//close item test2, the third should be active
		act(() => { 
			modalController?.closeName('test2')
		}) 
		expect(_modal?.classList.contains('visible')).toBe(true)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBe('test3') 
		expect(_modalContainer.querySelector("[data-testid='modalChild-3']")).toBeInTheDocument()	
	

		//close item test3, the fourth should be active (without provided any name, name should be "")
		act(() => { 
			modalController?.closeName('test3')
		}) 
		expect(_modal?.classList.contains('visible')).toBe(true)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBe("") 
		expect(_modalContainer.querySelector("[data-testid='modalChild-3']")).toBeInTheDocument()


		//close all items, no items should be active
		act(() => { 
			modalController?.closeAll()
		}) 
		expect(_modal?.classList.contains('visible')).toBe(false)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBeNull
		expect(_modalContainer.querySelector("[data-testid='modalChild-3']")).not.toBeInTheDocument()	
		expect(_modalContainer.querySelector("[data-testid='modalChild-4']")).not.toBeInTheDocument()	
   	})






	test('should close on button close click, should call onClose func if passed, ', async () => {
		let onCloseFn = jest.fn()
		act(() => {
		   createRoot(_container).render(
			   <Provider store={store}>
				   <Suspense fallback={<Preloader />}>
					   <App />
				   </Suspense>
			   </Provider>)
		})  
		const modalController = store.getState().base.modal.current
		let _modal = _modalContainer.querySelector("[data-testid='modal']")
		
		//should close itself if onClose was not passed
		act(() => {
			modalController?.openModal({
				name: 'test2', 
				children: <div data-testid='modalChild-1'>Child for test Modal 1</div>
			})
		}) 
		let _closerBtn = _modal?.querySelector("[data-testid='modal-closer']")
		expect(_closerBtn).toBeInTheDocument()
		expect(_modal?.classList.contains('visible')).toBe(true)
		act(() => {
            _closerBtn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(_modal?.classList.contains('visible')).toBe(false)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBeNull


		//if onClose passed should not close itself, only using methods in passed onClose func
		act(() => {
			modalController?.openModal({
				name: 'test1', 
				onClose: onCloseFn,
				children: <div data-testid='modalChild-1'>Child for test Modal 1</div>
			})
		}) 
		_closerBtn = _modal?.querySelector("[data-testid='modal-closer']")
		expect(_closerBtn).toBeInTheDocument()
		
		act(() => {
            _closerBtn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
		expect(onCloseFn).toBeCalledTimes(1)
		expect(_modal?.classList.contains('visible')).toBe(true)
		await waitFor(async () => {
			itemName = await modalController?.getName()
		})
		expect(itemName).toBe('test1')
		
		
		
		
		//if closable is false should not have close button
		act(() => { 
			modalController?.closeAll()
			modalController?.openModal({
				name: 'test1', 
				closable: false,
				children: <div data-testid='modalChild-1'>Child for test Modal 1</div>
			})
		}) 
		_closerBtn = _modal?.querySelector("[data-testid='modal-closer']")
		expect(_closerBtn).not.toBeInTheDocument()
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