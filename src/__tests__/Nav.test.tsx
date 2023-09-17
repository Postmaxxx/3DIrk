import { act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import store from '../redux/store';
import Preloader from '../components/Preloaders/Preloader';
import { Suspense } from "react";
import App from '../App';
import { setRes } from '../assets/js/testHelpers';
import { allActions } from '../redux/actions/all';


describe('Nav', () => {

    let _container: HTMLDivElement;


    beforeEach(() => {
        _container = document.createElement('div');
        _container.id = 'root'
        document.body.appendChild(_container);
    });



    afterEach(() => {
        document.body.removeChild(_container);
    });


    test('should render only one type of navigation', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { //desktop
			setRes('sm', 1)
		})
        expect(_container.querySelector("[data-testid='nav_mobile']")).not.toBeInTheDocument()
        expect(_container.querySelector("[data-testid='nav_desktop']")).toBeInTheDocument()

        act(() => { //mobile
			setRes('sm')
		})
        expect(_container.querySelector("[data-testid='nav_mobile']")).toBeInTheDocument()
        expect(_container.querySelector("[data-testid='nav_desktop']")).not.toBeInTheDocument()
    })


    test('desktop should be closes ond opened on click', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { //desktop
			setRes('sm', 1)
		})
        let _nav = _container.querySelector("[data-testid='nav_desktop']")
        let _navSwitcher = _container.querySelector("[data-testid='nav_dt__checkbox']")
        expect(_navSwitcher).toBeInTheDocument()
        expect(_nav?.classList.contains('opened')).toBe(true) //by default
        act(() => {
            _navSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        expect(_nav?.classList.contains('opened')).toBe(false) 
        act(() => {
            _navSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        expect(_nav?.classList.contains('opened')).toBe(true) 
    })


    test('mobile should be closes ond opened on click', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { //desktop
			setRes('sm')
		})
        let _nav = _container.querySelector("[data-testid='nav_mobile']")
        let _navSwitcher = _container.querySelector("[data-testid='nav_mob__checkbox']")
        expect(_navSwitcher).toBeInTheDocument()
        expect(_nav?.classList.contains('opened')).toBe(false) //by default
        act(() => {
            _navSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        expect(_nav?.classList.contains('opened')).toBe(true) 
        act(() => {
            _navSwitcher?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        expect(_nav?.classList.contains('opened')).toBe(false) 
    })




    test('desktop should contain 5 items', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { //desktop
			setRes('sm', 1)
		})
        let _nav = _container.querySelector("[data-testid='nav_desktop']")
        expect(_nav?.querySelectorAll("[data-testid='navListDesktop'] > .nav-item")?.length).toBe(5)
    })


    test('mobile should contain 5 items', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { //desktop
			setRes('sm')
		})
        let _nav = _container.querySelector("[data-testid='nav_mobile']")
        expect(_nav?.querySelectorAll("[data-testid='navListMobile'] > .nav-item")?.length).toBe(5)
    })



    test('desktop should have only one active item and item should be active on click on it', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => { 
			setRes('sm', 1)
		})
        let _nav = _container.querySelector("[data-testid='nav_desktop']")
        let _navItems = _nav?.querySelectorAll("[data-testid='navListDesktop'] > .nav-item") || []
        expect(_navItems?.length).toBeGreaterThan(0)

        _navItems.forEach((item, i) => {
            if (i===0) {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(true)
            } else {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(false)
            }
        })
        
        let _secondItem = _navItems[1].querySelector('.nav-text_level_1')
        act(() => {
            _secondItem?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })

        _navItems.forEach((item, i) => {
            if (i===1) {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(true)
            } else {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(false)
            }
        })
    })



    test('mobile should have only one active item and item should be active on click on it', () => {
		act(() => {
			createRoot(_container).render(
				<Provider store={store}>
					<Suspense fallback={<Preloader />}>
						<App />
					</Suspense>
				</Provider>)
		})
        act(() => {
			setRes('sm')
		})
        let _nav = _container.querySelector("[data-testid='nav_mobile']")
        let _navItems = _nav?.querySelectorAll("[data-testid='navListMobile'] > .nav-item") || []
        expect(_navItems?.length).toBeGreaterThan(0)

        act(() => {
            _navItems[0].querySelector('.nav-text_level_1')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })

        _navItems.forEach((item, i) => {
            if (i===0) {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(true)
            } else {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(false)
            }
        })
        
        //click on expandable item should not change selected
        let _inselectableItemIndex = [..._navItems].findIndex(item => item.querySelector(':scope > .nav-item__text'))
        let _inselectableItem = _navItems[_inselectableItemIndex]
        act(() => { 
            _inselectableItem?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        _navItems.forEach((item, i) => {
            if (i===0) {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(true)
            } else {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(false)
            }
        })


        //click on link item (not on already selected the first item) should change selected
        let newItemsList = [..._navItems]
        newItemsList.unshift()
        let _selectableItemIndex = newItemsList.findIndex(item => item.querySelector(':scope > a'))
        
        let _selectableItem = _navItems[_selectableItemIndex]
        act(() => { 
            _selectableItem?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        _navItems.forEach((item, i) => {
            if (i===_selectableItemIndex) {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(true)
            } else {
                expect(item.querySelector('.nav-text_level_1')?.classList.contains('selected')).toBe(false)
            }
        })
    })





    test('should create auth modal on login click for desktop and mobile', async () => {
        let _modalContainer: HTMLDivElement;

        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })
        _modalContainer = document.createElement('div');
        _modalContainer.id = 'modal'
        document.body.appendChild(_modalContainer);

        //desktop
        act(() => setRes('sm', 1))       
        let _loginDt: HTMLLIElement | null = _container.querySelector("[data-testid='btn_login_desktop']")
        expect(_loginDt).toBeInTheDocument()

        act(() => {
            _loginDt?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })


        await waitFor(async () => {
            let name = await store.getState().base.modal.current?.getName()
            expect(name).toBe('auth')
        })
        let _modal = _modalContainer.querySelector("[data-testid='modal']")
		expect(_modal).toBeInTheDocument()
        expect(_modal?.classList.contains('visible')).toBe(true)




        //mobile
        act(() => {
            store.getState().base.modal.current?.closeAll()
        })
        await waitFor(async () => {
            let name = await store.getState().base.modal.current?.getName()
            expect(name).toBeNull()
        })
        act(() => setRes('sm'))       
        let _loginMob: HTMLLIElement | null = _container.querySelector("[data-testid='btn_login_mobile']")
        expect(_loginMob).toBeInTheDocument()

        act(() => {
            _loginMob?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })


        await waitFor(async () => {
            let name = await store.getState().base.modal.current?.getName()
            expect(name).toBe('auth')
        })
        _modal = _modalContainer.querySelector("[data-testid='modal']")
		expect(_modal).toBeInTheDocument()
        expect(_modal?.classList.contains('visible')).toBe(true)

        document.body.removeChild(_modalContainer);
    })









    test('should logout on logout click for desktop', async () => {
        const originalReload = () => {
            window.location.reload()
        }

        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })

       
        act(() => {
            setRes('sm', 1)
            store.dispatch(allActions.user.setUser({name: 'testname'}))
            store.dispatch(allActions.user.setAuth({status: 'success', message: {ru: '', en: ''}}))
        })

        await waitFor(async () => {
            let name = await store.getState().user.name
            expect(name).toBe('testname')
        })

                
       
        let _logout: HTMLLIElement | null = _container.querySelector("[data-testid='btn_logout_desktop']")
        expect(_logout).toBeInTheDocument()


        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                reload: jest.fn()
            }
        })

        act(() => {
            _logout?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })


        await waitFor(async () => {
            let name = await store.getState().user.name
            expect(name).toBe('')
            expect(window.location.reload).toBeCalledTimes(1)
        })

        
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                reload: originalReload()
            }
        })
    })




    test('should logout on logout click for mobile', async () => {
        const originalReload = () => {
            window.location.reload()
        }


        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })

       
        act(() => {
            setRes('sm')
            store.dispatch(allActions.user.setUser({name: 'testname'}))
            store.dispatch(allActions.user.setAuth({status: 'success', message: {ru: '', en: ''}}))
        })

        await waitFor(async () => {
            let name = await store.getState().user.name
            expect(name).toBe('testname')
        })

       
        let _logout: HTMLLIElement | null = _container.querySelector("[data-testid='btn_logout_mobile']")
        expect(_logout).toBeInTheDocument()


        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                reload: jest.fn()
            }
        })

        act(() => {
            _logout?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })

        await waitFor(async () => {
            let name = await store.getState().user.name
            expect(name).toBe('')
            expect(window.location.reload).toBeCalled()
        })

        
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                reload: originalReload()
            }
        })
    })



    test('should open subnav for mobile', async () => {
        act(() => {
            createRoot(_container).render(
                <Provider store={store}>
                    <Suspense fallback={<Preloader />}>
                        <App />
                    </Suspense>
                </Provider>
            )
        })

        act(() => {
            setRes('sm')
        })
        let _navItem = _container.querySelector("[data-testid='navItemExpandable']")
        let _expander = _navItem?.querySelector(".nav-text_level_1")
        expect(_navItem).toBeInTheDocument()
        expect(_navItem?.classList.contains('expanded')).toBe(false)
        expect(_expander).toBeInTheDocument()

        act(() => {
            _expander?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        await waitFor(async () => {
            expect(_navItem?.classList.contains('expanded')).toBe(true)
        })

        act(() => {
            _expander?.dispatchEvent(new MouseEvent('click', {bubbles: true}))
        })
        await waitFor(async () => {
            expect(_navItem?.classList.contains('expanded')).toBe(false)
        })
    })


})