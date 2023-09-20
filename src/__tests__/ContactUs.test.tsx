import { createRoot } from 'react-dom/client';
import { act, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux';
import store from '../redux/store';
import fetchMock from 'jest-fetch-mock';
import App from '../App';




describe('ContactUs', () => {
    let _container: HTMLDivElement;
    let signal = new AbortController().signal
    const onCancelClick = jest.fn()
    let _modalContainer: HTMLDivElement;

    beforeEach(() => {
        _container = document.createElement('div');
        _container.id = 'root'
        document.body.appendChild(_container);
        fetchMock.enableMocks()
        fetchMock.doMock()
    });

    afterEach(() => {
        document.body.removeChild(_container);
        fetchMock.resetMocks();
        fetchMock.disableMocks()
    });


    test('should show content', async () => {
        await act(async () => {
            createRoot(_container).render(
                <Provider store={store}>
                    <App />
                </Provider>
            )
        })
        _modalContainer = document.createElement('div');
        _modalContainer.id = 'modal'
        document.body.appendChild(_modalContainer);

        let _modal = _modalContainer.querySelector("[data-testid='modal']")
        let _email: HTMLInputElement = _container.querySelector("#contacter_email") as HTMLInputElement
        let _name: HTMLInputElement = _container.querySelector("#contacter_name") as HTMLInputElement
        let _phone: HTMLInputElement = _container.querySelector("#contacter_phone") as HTMLInputElement
        let _message: HTMLTextAreaElement = _container.querySelector("#contacter_message") as HTMLTextAreaElement
        let _btnSend: HTMLTextAreaElement = _container.querySelector("[data-testid='sendMessage']") as HTMLTextAreaElement
        let _map: HTMLImageElement = _container.querySelector("[data-testid='mapImg']") as HTMLImageElement
        await waitFor(() => {
            expect(screen.getByText('Свяжитесь с нами')).toBeInTheDocument()
            expect(screen.getByText('Компания Стрежень')).toBeInTheDocument()
            expect(_map).toBeInTheDocument()
            expect(screen.getByTestId('mapLink')).toBeInTheDocument()
            expect((screen.getByTestId('mapLink') as HTMLLinkElement).href.includes('https://go.2gis.com')).toBe(true)
            expect(_email).toBeInTheDocument()
            expect(_name).toBeInTheDocument()
            expect(_phone).toBeInTheDocument()
            expect(_message).toBeInTheDocument()
        })
        
        await act(() => {
            screen.getByTestId('mapImg')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })

        await act(() => {})
        await waitFor(async () => {
            let modal = await store.getState().base.modal.current?.getName()
            expect(modal).toBe('location')
        })



        await act(() => {
            fireEvent.focus(_email)
            fireEvent.change(_email, { target: { value: 'testmail@gmail.com' } });
            fireEvent.blur(_email)
            fireEvent.focus(_name)
            fireEvent.change(_name, { target: { value: 'TestName' } });
            fireEvent.blur(_name)
            fireEvent.focus(_phone)
            fireEvent.change(_phone, { target: { value: '+32223332' } });
            fireEvent.blur(_phone)
            fireEvent.focus(_message)
            fireEvent.change(_message, { target: { value: 'test_message_with_length_more_than_20' }});
            fireEvent.blur(_message)
            fireEvent.click(_btnSend)
        })


    })


})