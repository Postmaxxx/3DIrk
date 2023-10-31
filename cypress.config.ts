import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '1yt2hw',
	e2e: {
		setupNodeEvents(on, config) {
		// implement node event listeners here
		},
	},
	env: {
		backendUrl: 'http://localhost:3030',
		testAdminName: 'Admin1',
		testAdminEmail: 'admin1@email.com',
		testAdminPhone: '123456789',
		testAdminPassword: 'testpassword',
		testUserName: 'Person1',
		testUserEmail: 'person1@email.com',
		testUserPhone: '123456789',
		testUserPassword: 'testpassword'
	}
});
