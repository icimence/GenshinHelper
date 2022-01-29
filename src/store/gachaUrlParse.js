const os = require('os')
const path = require('path')
const readline = require('readline')
const fs = require('fs')
const basePath = path.join(os.tmpdir(), '../../LocalLow/miHoYo/原神/output_log.txt')
const baseURL = 'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog'
const gachaUrlParse = {
	url: '',
	getUrl: () => {
		return gachaUrlParse.url
	},
	setUrl: (url) => {
		gachaUrlParse.url = url
	},
	getGachaURL: (gachaType, callback) => {
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
				authSearch.append('gacha_type', gachaType)
				authSearch.append('end_id', '0')
				authSearch.append('size', '20')
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
	changeRequestParamEndId: (url, endId) => {
		let tempUrl = new URL(url)
		let tempSearchParam = new URLSearchParams(tempUrl.searchParams)
		tempSearchParam.delete('end_id')
		tempSearchParam.append('end_id', endId.toString())
		tempSearchParam.delete('timestamp')
		let timestamp = new Date().getTime()
		timestamp = Math.floor(timestamp / 1000)
		tempSearchParam.append('timestamp', timestamp.toString())
		tempUrl.search = tempSearchParam
		console.log(tempUrl)
		gachaUrlParse.setUrl(tempUrl.href)
		return tempUrl.href
	}
}
export default gachaUrlParse
