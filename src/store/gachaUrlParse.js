const os = require('os')
const path = require('path')
const readline = require('readline')
const fs = require('fs')
const basePath = path.join(os.tmpdir(), '../../LocalLow/miHoYo/原神/output_log.txt')
// const basePath = path.join(os.tmpdir(), '../../LocalLow/test.txt')
const baseURL = 'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog'
const gachaUrlParse = {
	url: '',
	getUrl: () => {
		return gachaUrlParse.url
	},
	setUrl: (url) => {
		gachaUrlParse.url = url
	},
	getGachaURL: (callback) => {
		let gachaURL = new URL(baseURL)
		let flag = true
		const lineReader = readline.createInterface({
			input: fs.createReadStream(basePath),
			output: process.stdout,
			terminal: false
		})
		lineReader.on('line', (line) => {
			if (line.toString().startsWith('OnGetWebViewPageFinish:') && line.toString().endsWith('#/log')) {
				let temp = new URL(line.toString().substring(23, line.toString().length - 5))
				let authSearch = new URLSearchParams(temp.searchParams)
				authSearch.append('end_id', '0')
				authSearch.append('size', '6')
				authSearch.delete('timestamp')
				let timestamp = new Date().getTime()
				timestamp = Math.floor(timestamp / 1000)
				authSearch.append('timestamp', timestamp.toString())
				gachaURL.search = authSearch
				console.log(gachaURL.href)
				gachaUrlParse.setUrl(gachaURL.href)
			}
		})
		lineReader.on('close', () => {
				if (gachaUrlParse.getUrl() === '') {
					const NOTIFICATION_TITLE = '通知'
					const NOTIFICATION_BODY = '获取url数据失败，请打开祈愿界面'
					const CLICK_MESSAGE = '通知已被点击'
					new Notification(NOTIFICATION_TITLE, {body: NOTIFICATION_BODY})
						.onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
					flag = false
					callback('')
				} else
					callback(gachaUrlParse.getUrl())
			}
		)
	},
	setTimestamp: (tempSearchParam) => {
		tempSearchParam.delete('timestamp')
		let timestamp = new Date().getTime()
		timestamp = Math.floor(timestamp / 1000)
		tempSearchParam.append('timestamp', timestamp.toString())
		return tempSearchParam
	},
	changeRequestParam: (url, key, value) => {
		let tempUrl = new URL(url)
		let tempSearchParam = new URLSearchParams(tempUrl.searchParams)
		if (tempSearchParam.get(key) !== null)
			tempSearchParam.delete(key)
		tempSearchParam.append(key, value.toString())
		console.log('更改了url属性')
		console.log(key)
		console.log(value.toString())
		if (key === 'gacha_type') {
			tempSearchParam.delete('end_id')
			tempSearchParam.append('end_id', '0')
		}
		tempUrl.search = gachaUrlParse.setTimestamp(tempSearchParam)
		gachaUrlParse.setUrl(tempUrl.href)
		console.log(tempUrl.href)
		return tempUrl.href
	}
}
export default gachaUrlParse
