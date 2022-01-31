<template>
	<div class="container">
		<div class="titleContainer">
			<h2>祈愿概览</h2>
			<div class="switchesContainer"></div>
		</div>
		<div class="chartContainer">
			<div class="card">
				<h4>限定角色池</h4>
				<div id="301" class="chart"></div>
			</div>
			<div class="card">
				<h4>限定武器池</h4>
				<div id="302" class="chart"></div>
			</div>
			<div class="card">
				<h4>常驻池</h4>
				<div id="200" class="chart"></div>
			</div>
		</div>
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
import {useCommonCharacterStore, useLimitCharacterStore, useWeaponStore} from "@/store/gachaStore";

export default {
	props: {
		msg: String
	},
	setup(props) {
		const str = toRefs(props)
		const notificationFlag = ref(null)
		const gachaData = ref([])
		const limitGacha = useLimitCharacterStore()
		const commonGacha = useCommonCharacterStore()
		const weaponGacha = useWeaponStore()
		const gachaTypeList = ref(['301', '302', '200'])
		const limitChart = ref()
		const weaponChart = ref()
		const commonChart =ref()
		
		const destroyChartIfExists=(chart)=>{
			if (chart !== null&& chart !== undefined && chart !=='')
				chart.dispose()
		}
		
		const setChart = (chartType) => {
			let gacha
			let chart
			let chartDom = document.getElementById(chartType)
			gachaData.value = []
			switch (chartType) {
				case '301':
					gacha = limitGacha
					chart = limitChart.value
					break
				case '200':
					gacha = commonGacha
					chart = commonChart.value
					break
				case '302':
					gacha = weaponGacha
					chart = weaponChart.value
					break
				default:
					console.log('炸裂了')
					break
			}
			gachaData.value.push({value: gacha.fiveStarCount, name: '五星'})
			gachaData.value.push({value: gacha.fourStarCount, name: '四星'})
			gachaData.value.push({value: gacha.threeStarCount, name: '三星'})
			const option = reactive({
				tooltip: {
					trigger: 'item'
				},
				legend: {
					top: '5%',
					left: 'center'
				},
				series: [
					{
						name: '数量',
						type: 'pie',
						radius: ['20%', '70%'],
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
						data: gachaData
					}
				]
			})
			switch (chartType){
				case '301':
					destroyChartIfExists(limitChart.value)
					limitChart.value = echarts.init(chartDom)
					option && limitChart.value.setOption(option)
					break
				case '302':
					destroyChartIfExists(weaponChart.value)
					weaponChart.value = echarts.init(chartDom)
					option && weaponChart.value.setOption(option)
					break
				case '200':
					destroyChartIfExists(commonChart.value)
					commonChart.value = echarts.init(chartDom)
					option && commonChart.value.setOption(option)
					break
				default:
					console.log('炸了')
					break
			}
		}
		onMounted(() => {
			if (limitGacha.initState)
				setChart('301')
			if (weaponGacha.initState)
				setChart('302')
			if (commonGacha.initState)
				setChart('200')
		})
		const getData = () => {
			limitGacha.$reset()
			commonGacha.$reset()
			weaponGacha.$reset()
			gachaUrlParse.getGachaURL(async (initUrl) => {
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
				await getDataFromMihoyo()
			})
			const getDataFromMihoyo = async () => {
				let gacha
				for (let i = 0; i < gachaTypeList.value.length; i++) {
					switch (gachaTypeList.value[i]) {
						case '301':
							gacha = limitGacha
							break
						case '302':
							gacha = weaponGacha
							break
						case '200':
							gacha = commonGacha
					}
					gachaUrlParse.changeRequestParam(gachaUrlParse.getUrl(), 'gacha_type', gachaTypeList.value[i])
					let proxyUrl = 'http://47.94.215.253:58177/' + gachaUrlParse.getUrl()
					let tempRes
					let count = 0
					console.log(`获取第${count + 1}页`)
					tempRes = await (await axios.get(proxyUrl)).data.data.list
					console.log(tempRes)
					console.log(`第${count + 1}页获取成功`)
					gacha.setLimitCharacterData(tempRes)
					while (tempRes.length === 6) {
						count++;
						util.sleep(Math.round(Math.random() * 200 + 800))
						gachaUrlParse.changeRequestParam(gachaUrlParse.getUrl(), 'end_id', tempRes[tempRes.length - 1].id)
						console.log(`获取第${count + 1}页`)
						proxyUrl = 'http://47.94.215.253:58177/' + gachaUrlParse.getUrl()
						tempRes = await (await axios.get(proxyUrl)).data.data.list
						console.log(tempRes)
						console.log(`第${count + 1}页获取成功`)
						gacha.setLimitCharacterData(tempRes)
					}
					console.log('请求结束')
					setChart(gachaTypeList.value[i])
					gacha.initState = true
					console.log(gacha.fiveStarCount)
					console.log(gacha.fourStarCount)
					console.log(gacha.threeStarCount)
				}
			}
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
	width: 300px;
	height: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.chart{
	width: inherit;
	height: 300px;
}

.container {
	display: flex;
	flex-direction: column;
}

.chartContainer {
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
