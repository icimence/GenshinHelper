<template>
	<div class="container">
		<div id="limitCharacter" class="card"></div>
		<div id="weapon" class="card"></div>
		<div id="commonCharacter" class="card"></div>
	</div>
	<t-button theme="primary" shape="round" variant="base" @click="getData"> 获取角色祈愿池数据</t-button>
	<t-button theme="primary" shape="round" variant="base" @click="setChart"> 渲染数据</t-button>
</template>

<script>
import {onMounted, reactive, ref, toRefs} from 'vue'
import gachaUrlParse from "@/store/gachaUrlParse";
import util from '@/store/util'
import {NotifyPlugin} from "tdesign-vue-next";
import axios from 'axios'
import * as echarts from 'echarts'
import {useLimitCharacterStore} from "@/store/gachaStore";

export default {
	props: {
		msg: String
	},
	setup(props) {
		const str = toRefs(props)
		const notificationFlag = ref(null);
		const limitGacha = useLimitCharacterStore()
		
		
		const setChart = () => {
			let chartDom = document.getElementById('limitCharacter')
			let limitChart = echarts.init(chartDom)
			const option = reactive({
				tooltip: {
					trigger: 'item'
				},
				
				series: [
					{
						name: '数量',
						type: 'pie',
						radius: ['40%', '70%'],
						avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 10,
							borderColor: '#fff',
							borderWidth: 2
						},
						label: {
							show: false,
							position: 'center'
						},
						emphasis: {
							label: {
								show: true,
								fontSize: '24',
								fontWeight: 'bold'
							}
						},
						labelLine: {
							show: false
						},
						data: [
							{value: limitGacha.fiveStarCount, name: '五星'},
							{value: limitGacha.fourStarCount, name: '四星'},
							{value: limitGacha.threeStarCount, name: '三星'}
						]
					}
				]
			})
			option && limitChart.setOption(option)
		}
		onMounted(() => {
			if (limitGacha.initState)
				setChart()
		})
		const getData = () => {
			limitGacha.$reset()
			gachaUrlParse.getGachaURL('301', async (initUrl) => {
				console.log('这里是调用的url')
				console.log(initUrl)
				console.log('调用url打印结束')
				if (initUrl === '') {
					notificationFlag.value = NotifyPlugin.info({
						placement: 'top-right',
						duration: 3000,
						title: '通知',
						content: '请打开祈愿历史记录界面',
						closeBtn: true
					})
					return
				}
				let proxyUrl = 'http://localhost:8080/' + initUrl
				console.log(proxyUrl)
				let tempRes
				let count = 0
				console.log(`获取第${count + 1}页`)
				tempRes = await (await axios.get(proxyUrl)).data.data.list
				console.log(tempRes)
				console.log(`第${count + 1}页获取成功`)
				limitGacha.setLimitCharacterData(tempRes)
				while (tempRes.length === 6) {
					count++;
					util.sleep(Math.round(Math.random() * 200 + 800))
					gachaUrlParse.changeRequestParamEndId(initUrl, tempRes[tempRes.length - 1].id)
					console.log(`获取第${count + 1}页`)
					proxyUrl = 'http://localhost:8080/' + gachaUrlParse.getUrl()
					tempRes = await (await axios.get(proxyUrl)).data.data.list
					console.log(tempRes)
					console.log(`第${count + 1}页获取成功`)
					limitGacha.setLimitCharacterData(tempRes)
				}
				console.log('请求结束')
				setChart()
				limitGacha.initState = true
				console.log(limitGacha.fiveStarCount)
				console.log(limitGacha.fourStarCount)
				console.log(limitGacha.threeStarCount)
			})
			
		}
		return {
			str,
			getData,
			setChart
		}
	}
}
// export default {
// 	name: 'HelloWorld',
// 	props: {
// 		msg: String
// 	},
// 	methods: {
// 		sysNot: function () {
// 			const NOTIFICATION_TITLE = 'Title'
// 			const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
// 			const CLICK_MESSAGE = 'Notification clicked!'
//
// 			new Notification(NOTIFICATION_TITLE, {body: NOTIFICATION_BODY})
// 				.onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
//
// 		}
// 	}
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card {
	width: 100px;
	height: 300px;
}

.container {
	display: flex;
	flex-direction: row;
}

h3 {
	margin: 40px 0 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
