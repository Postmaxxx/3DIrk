const Dotenv = require('dotenv-webpack');
const {InjectManifest} = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: path.join(__dirname, "src", "index.tsx"),
	output: {
		path: path.join(__dirname, "/dist"), // the bundle output path
		filename: "bundle.js", // the name of the bundle
		clean: true
	},
	plugins: [
		new HtmlWebpackPlugin({
		template: path.join(__dirname, "/public/index.html"), // to import index.html file inside index.js
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].css',
		}),
		new Dotenv(),
		new InjectManifest({
			swSrc: './src/sw.js',
			swDest: 'sw.js',
			include: [/\.(html|js|css|woff2)$/],
			maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
		}),
		new CopyWebpackPlugin({
			patterns: [
			  { from: 'public', to: '', filter: (resourcePath) => !/index\.html$/.test(resourcePath) }
			]
		  })
	],
	devServer: {
		port: 3030, // change the port
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".*"],    
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
				},
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.(sa|sc|c)ss$/, // styles files
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},

			{
				test: /\.(png|svg|webp|jpeg|jpg)$/, // to import images 
				type: "asset/resource",
				generator: {
					filename: 'assets/images/[name].[ext]',
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]',
				},
			},
			
		
		],
	},
};