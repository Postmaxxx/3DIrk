describe('LangSwitcher', () => {

	const timeLimit = 2000 //time limit for switch theme
	beforeEach(async () => {
		if (!window.navigator || !navigator.serviceWorker) {
			return null;
		}
		const registrations = await navigator.serviceWorker.getRegistrations();
		return Promise.all(registrations.map(registration => registration.unregister()));
	})


	it('should change lang on desktop', () => {
		cy.viewport(1600, 1000)
		cy.intercept('GET', `${Cypress.env('backendUrl')}/**`).as('allGets')
		cy.visit('localhost')
		cy.wait('@allGets')

		let initialTheme: 'light' | 'dark'
		cy.get('body').then($body => {
			initialTheme = $body.hasClass('dark') ? 'dark' : 'light'
		})

		cy.scrollTo('top').wait(timeLimit) //to make themeSwitcher visible
		
		//theme switch to another theme
		cy.get('body').then($body => { 
			cy.wrap($body).find('#theme-switcher').click()
			cy.wait(timeLimit).then(() => {
				const newTheme = $body.hasClass('dark') ? 'dark' : 'light'
				expect(newTheme).not.to.deep.eq(initialTheme)
			})
		})

		//theme switch to initial theme
		cy.get('body').then($body => {
			cy.wrap($body).find('#theme-switcher').click()
			cy.wait(timeLimit).then(() => {
				const newTheme = $body.hasClass('dark') ? 'dark' : 'light'
				expect(newTheme).to.deep.eq(initialTheme)
			})
		})
	})




	it('should change lang on mobile', () => {
		cy.viewport(450, 800)
		cy.intercept('GET', `${Cypress.env('backendUrl')}/**`).as('allGets')
		cy.visit('localhost')
		cy.wait('@allGets')

		let initialTheme: 'light' | 'dark'
		cy.get('body').then($body => {
			initialTheme = $body.hasClass('dark') ? 'dark' : 'light'
		})

		cy.get('[data-testid="navMobOpener"]').click() //to make themeSwitcher visible
		
		//theme switch to another theme
		cy.get('body').then($body => { 
			cy.wrap($body).find('#theme-switcher').click()
			cy.wait(timeLimit).then(() => {
				const newTheme = $body.hasClass('dark') ? 'dark' : 'light'
				expect(newTheme).not.to.deep.eq(initialTheme)
			})
		})

		//theme switch to initial theme
		cy.get('body').then($body => {
			cy.wrap($body).find('#theme-switcher').click()
			cy.wait(timeLimit).then(() => {
				const newTheme = $body.hasClass('dark') ? 'dark' : 'light'
				expect(newTheme).to.deep.eq(initialTheme)
			})
		})
	})
})