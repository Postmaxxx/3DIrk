import Dotenv from "dotenv-webpack";
const {InjectManifest} = require("workbox-webpack-plugin");

const path = require('path')

module.exports = {
	entry: "./public/index.html",
	output: {
		filename: "bundle.js"
	},
	devtool: "inline-source-map",
	module: {
		rules: 
            {
            	test: /\.[ac]ss$/,
            	use: [
            		// Creates `style` nodes from JS strings
                	"style-loader",
            		// Translates CSS into CommonJS
            		"css-loader",
            		// Compiles Sass to CSS
            		"sass-loader",
            	],
            },
		},


	plugins: [
		new Dotenv(),
		new InjectManifest({
			swSrc: "./service-worker.js",
			swDest: "service-worker.js",
		})
	]
};