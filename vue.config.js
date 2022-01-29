module.exports = {
	devServer:{
		proxy: {
			'/gacha':{
				target: 'https://hk4e-api.mihoyo.com/event/gacha_info/',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/gacha':''
				}
			}
		}
	},
	pluginOptions: {
		electronBuilder: {
			preload: 'src/preload.js',
			nodeIntegration: true
		}
	}
}