const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const OUTPUT_DIRECTORY = 'public/js'

// grab environment name from .env
//const ENV = require('dotenv').config()
//const WP_ENV = process.env.WP_ENV || 'local'
//const mode = ['staging', 'prod'].indexOf(WP_ENV) < 0 ? 'development' : 'production'


let config = {
	mode: 'development',
	entry: [
		"./build/index.js"
	],
	output: {
		path: path.join(__dirname, OUTPUT_DIRECTORY),
		publicPath: `/${OUTPUT_DIRECTORY}`,
		filename: 'main.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader'},
					{ loader: "resolve-url-loader"},
					//{ loader: 'style-loader' },
				],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					//{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: "resolve-url-loader"},
					{ loader: 'sass-loader' },
				],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'url-loader',
			},
			{
				// Exposes jQuery for use outside Webpack build
				test: require.resolve('jquery'),
				use: [{
					loader: 'expose-loader',
					options: 'jQuery'
				},{
					loader: 'expose-loader',
					options: '$'
				}]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new MiniCssExtractPlugin({
			filename: '../css/[name].css',
			chunkFilename: '[id].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),
		new BrowserSyncPlugin({
			files: ["views/**/*.hbs"],
			proxy: 'http://localhost:3000',
			port: 80,
		}),
	]
}

// if (mode === 'production') {
// 	config.optimization = {
// 		minimizer: [
// 			new UglifyJsPlugin({
// 				cache: true,
// 				parallel: true,
// 				sourceMap: true // set to true if you want JS source maps
// 			}),
// 			new OptimizeCSSAssetsPlugin({})
// 		]
// 	}
//
// 	config.plugins.push(new OptimizeCSSAssetsPlugin())
// 	config.plugins.push(new UglifyJsPlugin())
// }

module.exports = config
