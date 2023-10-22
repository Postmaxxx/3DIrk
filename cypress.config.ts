import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
		// implement node event listeners here
		},
	},
	env: {
		backendUrl: 'http://localhost:3030',
		testUserName: 'TestPerson1',
		testUserEmail: 'testUser@test.test',
		testUserPhone: '604604604',
		testUserPassword: '223322223'
	}
});
