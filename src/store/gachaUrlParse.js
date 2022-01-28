const os = require('os')
const path = require('path')
const readline = require('readline')
const fs = require('fs')
const basePath = path.join(os.tmpdir(), '../../LocalLow/miHoYo/原神/output_log.txt')
const baseURL = 'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog'
const gachaUrlParse = {
	url: '',
	getGachaURL: () => {
		const lineReader = readline.createInterface({
			input: fs.createReadStream(basePath),
			output: process.stdout,
			terminal: false
		})
		lineReader.on('line', (line) => {
			if (line.toString().startsWith('OnGetWebViewPageFinish:') && line.toString().endsWith('#/log')) {
				let temp = new URL(line.toString().substring(23, line.toString().length - 5))
				let authSearch = new URLSearchParams(temp.searchParams)
				authSearch.append('gacha_type','301')
				authSearch.append('end_id','0')
				authSearch.append('size','20')
				authSearch.delete('timestamp')
				let timestamp = new Date().getTime()
				timestamp = Math.floor(timestamp / 1000)
				authSearch.append('timestamp', timestamp.toString())
				let gachaURL = new URL(baseURL)
				gachaURL.search = authSearch
				console.log(gachaURL.href)
				gachaUrlParse.url = gachaURL
			}
		})
	}
}
export default gachaUrlParse
