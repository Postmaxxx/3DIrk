describe('order desktop', () => {

	/*const user = {
		name: Cypress.env('testUserName'),
		email: Cypress.env('testUserEmail'),
		phone: Cypress.env('testUserPhone'),
		token: '',
		isAdmin: true,
		cart: [],
		fixed: true
	}*/

			/*cy.intercept('POST', `${Cypress.env('backendUrl')}/api/user/login`, (req) => {

			req.on('response', res => {
				res.send({ 
					status: 200, 
					ok: true,
					body: {
						user
					}
				 })
			})
		})*/
	


	beforeEach(async () => { //stop sw, otherwise infinite loading
		cy.viewport(1500, 900);
		if (!window.navigator || !navigator.serviceWorker) {
		  	return null;
		}
		const registrations = await navigator.serviceWorker.getRegistrations();
		return Promise.all(registrations.map(registration => registration.unregister()));
		/*cy.visit('localhost', {
			onBeforeLoad(win) {
				// @ts-ignore
				delete win.navigator.__proto__.ServiceWorker
			}
		})*/
	});


	//login
	it('user can add some items to cart', ()=> {
		cy.log(`${Cypress.env('backendUrl')}/**`)
		cy.intercept('GET', `${Cypress.env('backendUrl')}/**`).as('allBEFetchs')
		cy.visit('localhost')
		cy.wait('@allBEFetchs')
			
		
		// login
		cy.get("[data-testid='btn_login_desktop']").click()
		cy.get(".modal-window").should('be.visible')
		cy.get('[data-testid="authBtnToLogin"]').click()
		cy.get('.modal-window')
			.find('#authUserEmail')
			.should('have.value', '')
			.type(Cypress.env('testUserEmail'))

		cy.get('.modal-window')
			.find('#authUserPassword')
			.should('have.value', '')
			.type(Cypress.env('testUserPassword'))


		
		cy.intercept('POST', `${Cypress.env('backendUrl')}/api/user/login`).as('login')
		cy.get('[data-testid="authBtnLogin"]').click()
		cy.wait('@login').its('response.statusCode').should('eq', 200)

	})
})