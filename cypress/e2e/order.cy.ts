describe('order items', () => {

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

	/*
	DB should have:
	at least 1 product "Product 2" in "Category 3" with at least 
		types: "prod 2 type 20",
		fiber: "fiber 1"
		color: "color red"
		images: 4 items
	*/ 

	const testValues = {
		products: [
			{
				category: {
					en: 'Category 3',
					ru: 'Продукт 2'
				},
				name: {
					en: 'Product 2',
					ru: 'Продукт 2'
				},
				type: {
					en: 'Prod 2 type 20',
					ru: 'Продукт 2 тип 20'
				},
				fiber: {
					en: 'Fiber 1',
					ru: 'Матер 1'
				},
				color: {
					en: 'Color Red',
					ru: 'Цвет красный'
				},
				amount: {
					input: 3,
					clicks: 1
				}
			},
			{
				category: {
					en: 'Категория 3',
					ru: 'Продукт 2'
				},
				name: {
					en: 'Product 2',
					ru: 'Продукт 2'
				},
				type: {
					en: 'Prod 2 type 20',
					ru: 'Продукт 2 тип 20'
				},
				fiber: {
					en: 'Fiber 1',
					ru: 'Матер 1'
				},
				color: {
					en: 'Color green',
					ru: 'Цвет зеленый'
				},
				amount: {
					input: 15,
					clicks: 3
				}
			}

		],
		message: 'Test order text 1'
	}
	


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


	it('user can add some items to cart', { scrollBehavior: false }, ()=> {
		cy.intercept('GET', `${Cypress.env('backendUrl')}/**`).as('allGets')
		cy.intercept('GET', `${Cypress.env('backendUrl')}/api/colors/load-all`).as('colors')
		cy.visit('localhost')
		cy.wait('@allGets')
			
		// user login
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
			.type(Cypress.env('testUserPassword'), { log: false })

		cy.intercept('POST', `${Cypress.env('backendUrl')}/api/user/login`).as('login')
		cy.get('[data-testid="authBtnLogin"]').click()
		cy.wait('@login').its('response.statusCode').should('eq', 200)

		//go to cart
		cy.get('a').contains(/(Cart|Корзина)/i).click()
		cy.wait('@colors').its('response.statusCode').should('eq', 200)


		//remove all items from cart (if items exist) and go to catalog
		cy.get('.cart').should('exist').then($cart => {	
			if ($cart.find('.cart__item').length > 0) {
				cy.wrap($cart).find('.cart__item').each(($item, i, $list) => {
					cy.wrap($list[0])
						.find('.remover').click({force: true})
						.find('.remover__confirmation').should('have.class', 'visible')
					cy.wrap($list[0])
						.find('button').contains(/(delete|удалить)/i).click()
				})
			} 

			
			cy.wrap($cart).find('.cart__item').should('not.exist').then(() => {
				cy.get('a').contains(/(catalog|каталог)/i).click()
			})
		})
		
		//select category and product
		cy.get('.catalog').should('exist')
			.find('.catalog-list').should('exist').then($list => {
				cy.wrap($list).find('li').then(($category) => {
					const hasEnType = $category.toArray().some(category => category.innerText.toLowerCase().includes(testValues.products[0].category.en.toLowerCase()))
					cy.wrap($list).find('li').contains(testValues.products[0].category[hasEnType ? 'en' : 'ru']).click({force: true})
				})
			})




		cy.get('.catalog').should('exist')
			.find('.splider_catalog').should('exist')
			.find('.gallery').should('exist').then($gallery => {
				cy.wrap($gallery).find('a').then(($product) => {
					const hasEnType = $product.toArray().some(product => product.innerText.toLowerCase().includes(testValues.products[0].name.en.toLowerCase()))
					cy.wrap($gallery).find('a').contains(testValues.products[0].name[hasEnType ? 'en' : 'ru']).click({force: true})
				})
			})


			




		//select 3rd image in preview
		cy.get('.product__images').should('exist')
			.find('#spliderThumbs').should('exist')
			.find('.splide__list').should('exist')
			.find('li').should('have.length', 4).then($images => {
				cy.wrap($images[2]).click({force: true})
			})

		//view main image and close it
		cy.get('#spliderMain').should('exist').click()
		cy.get('#modal')
			.find('.modal-window').should('have.class', 'visible')
			.find('.image_modal').should('exist')
			.find('img').should('exist').should('be.visible')
		cy.get('#modal').find('[data-testid="modal-closer"]').should('exist').and('be.visible').click()
	
		/* change language
		cy.get('body').then($body => { 
			cy.wrap($body).find('[data-testid="lang-switcher"]').click()
			cy.wait(2000)
		})*/
		
		//set product options
		cy.get('.product__info').should('exist')
			.find('.features').should('exist')
			.find('#selector_type').should('exist').then($selector => {
				cy.wrap($selector).find('option').then(($options) => {
					const hasEnType = $options.toArray().some(option => option.innerText.toLowerCase().includes(testValues.products[0].type.en.toLowerCase()))
					cy.wrap($selector).select(testValues.products[0].type[hasEnType ? 'en' : 'ru'])
				})
			})
		
		
		cy.get('.product__info')
			.find('.features')
			.find('#selector_fiber').should('exist').then($selector => {
				cy.wrap($selector).find('option').then(($options) => {
					const hasEnType = $options.toArray().some(option => option.innerText.toLowerCase().includes(testValues.products[0].fiber.en.toLowerCase()))
					cy.wrap($selector).select(testValues.products[0].fiber[hasEnType ? 'en' : 'ru'])
				})
			})
		cy.get('.product__info')
			.find('.features')
			.find('.fiber__link').should('exist')


		cy.get('.product__info')
			.find('.features')
			.find('#selector_color').should('exist').then($selector => {
				cy.wrap($selector).find('.color_selected').should('exist').click({force: true})
				cy.wrap($selector).find('.color__name').then(($options) => {
					const hasEnType = $options.toArray().some(option => option.innerText.toLowerCase().includes(testValues.products[0].color.en.toLowerCase()))
					cy.wrap($selector).find('.color__name').contains(testValues.products[0].color[hasEnType ? 'en' : 'ru'], {matchCase: false}).click({force: true})
				})
			})

		//set amount 
		cy.get('.product__info')
			.find('.cart-adder').should('exist')
			.find('.amount-changer').should('exist').then($changer => {
				cy.wrap($changer).find('input').should('exist').clear().type(testValues.products[0].amount.input.toString())
				Cypress._.times(testValues.products[0].amount.clicks, () => {
					cy.wrap($changer).find('button.button_increase').should('exist').click({force: true})
				})
				cy.wrap($changer).find('input').should('have.value', (testValues.products[0].amount.input + testValues.products[0].amount.clicks).toString())
			})

		//add to cart
		cy.get('.product__info')
			.find('.cart-adder')
			.find('.button_add-cart').should('exist').click({force: true})
		//close modal
		cy.get('#modal').find('.modal-window').should('have.class', 'visible')
			.find('.message_modal').should('exist')
			.find('.message_modal__buttons').should('exist')
			.find('button').contains(/(close|закрыть)/i).should('exist').click({force: true})


		//add the same item with another color
		//change color
		cy.get('.product__info')
		.find('.features')
		.find('#selector_color').should('exist').then($selector => {
			cy.wrap($selector).find('.color_selected').should('exist').click({force: true})
			cy.wrap($selector).find('.color__name').then(($options) => {
				const hasEnType = $options.toArray().some(option => option.innerText.toLowerCase().includes(testValues.products[1].color.en.toLowerCase()))
				cy.wrap($selector).find('.color__name').contains(testValues.products[1].color[hasEnType ? 'en' : 'ru'], {matchCase: false}).click({force: true})
			})
		})
		//set amount 
		cy.get('.product__info')
			.find('.cart-adder').should('exist')
			.find('.amount-changer').should('exist').then($changer => {
				cy.wrap($changer).find('input').should('exist').clear().type(testValues.products[1].amount.input.toString())
				Cypress._.times(testValues.products[1].amount.clicks, () => {
					cy.wrap($changer).find('button.button_increase').should('exist').click({force: true})
				})
				cy.wrap($changer).find('input').should('have.value', (testValues.products[1].amount.input + testValues.products[1].amount.clicks).toString())
			})



		//add to cart
		cy.get('.product__info')
			.find('.cart-adder')
			.find('.button_add-cart').should('exist').click({force: true})
		//go to cart
		cy.get('#modal').find('.modal-window').should('have.class', 'visible')
			.find('.message_modal').should('exist')
			.find('.message_modal__buttons').should('exist')
			.find('button').contains(/(go to cart|Перейти в корзину)/i).should('exist').click({force: true})


		//add info to order
		cy.get('.form_order').should('exist')
			.find("#message").should('exist').should('have.value', '').type(testValues.message)

		cy.get('.form_order')
			.find('.cart')
			.find('.cart__item').should('have.length', testValues.products.length).each(($cartItem, i) => {
				cy.wrap($cartItem).find('.amount-changer').should('exist')
					.find('input').should('have.value', (testValues.products[i].amount.input + testValues.products[i].amount.clicks).toString())
				cy.wrap($cartItem).find('[data-testid="productImageWrapper"] img').should('exist').should('be.visible')
				cy.wrap($cartItem).find('.description__name a').should('exist').should('have.value', testValues.products[i].fiber)

			})

	})
})