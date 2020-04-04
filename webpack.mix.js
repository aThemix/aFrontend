/*
 * Laravel Mix Starter
 *
 * Check the documentation at
 * https://laravel.com/docs/5.6/mix
 */

const mix = require('laravel-mix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

// BrowserSync and LiveReload on `npm run watch` command
// Update the `proxy` and the location of your SSL Certificates if you're developing over HTTPS
mix.browserSync({
	server: {
		baseDir: './'
	},
	proxy: false,
	// https: {
	// 	key: '/your/certificates/location/your-local-domain.key',
	// 	cert: '/your/certificates/location/your-local-domain.crt'
	// },
	files: [
		'**/*.html',
		'assets/dist/css/**/*.css',
		'assets/dist/js/**/*.js'
	],
	injectChanges: true,
	open: true
});

// Autloading jQuery to make it accessible to all the packages, because, you know, reasons
// You can comment this line if you don't need jQuery
mix.autoload({
	jquery: ['$', 'window.jQuery', 'jQuery'],
});

mix.setPublicPath('./assets/dist');

// Compile assets
mix.js('assets/src/scripts/app.js', 'assets/dist/js')
	.extract()
	.sass('assets/src/scss/style.scss', 'assets/dist/css')
	.options({
		postCss: [
			require("css-mqpacker")
		]
	})
	.webpackConfig({
		plugins: [
			//Compress images
			new CopyWebpackPlugin([{
				from: 'assets/src/images', // FROM
				to: 'images/', // TO
			}]),
			new ImageminPlugin({
				test: /\.(jpe?g|png|gif|svg)$/i,
				pngquant: {
					quality: '65-80'
				},
				plugins: [
					imageminMozjpeg({
						quality: 70,
						//Set the maximum memory to use in kbytes
						maxMemory: 1000 * 512
					})
				]
			})
		],
	})
	.options({
		processCssUrls: false
	});

// Add versioning to assets in production environment
if (mix.inProduction()) {
	mix.version();
}
