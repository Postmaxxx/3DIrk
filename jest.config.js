/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	transformIgnorePatterns: [
		"/node_modules/",
		"^.+\\.s?css$" // Ignore SCSS files
	],
	setupFiles: ['./jest.setup.js'],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	moduleNameMapper: {
		"\\.(scss|sass|css)$": "identity-obj-proxy",
		"\\.(svg|jpg|jpeg|png|gif)$": "<rootDir>/svgMock.js" // Provide the correct path to the mock file
	},
	verbose: true,
    testURL: "http://localhost/"
};


