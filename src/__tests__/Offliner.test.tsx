import { act  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import ReactDOM from 'react-dom/client';
import Offliner from '../components/Offliner/Offliner';





describe('Tests for Offliner', () => {

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


    test('hidden should exist', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
        act(() => {
            ReactDOM.createRoot(container).render(<Offliner lang='en' />);
        });
        let offliner = container.querySelector('.offliner')
        expect(offliner).toBeInTheDocument()
    })

         
    test('should be hidden if online', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
        act(() => {
            ReactDOM.createRoot(container).render(<Offliner lang='en' />);
        });
        let offliner = container.querySelector('.offliner')
        expect(offliner?.querySelector('span')).not.toBeInTheDocument()
    })



    test('should be visible if offline', async () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
        act(() => {
            ReactDOM.createRoot(container).render(<Offliner lang='en' />);
        });
        let offliner = container.querySelector('.offliner')
        expect(offliner?.querySelector('span')).toBeInTheDocument()
    })


})

