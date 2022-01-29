<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<p>
			For a guide and recipes on how to configure / customize this project,<br>
			check out the
			<a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
		</p>
		<h3>Ecosystem</h3>
		<ul>
			<li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
			<li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
			<li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
			</li>
			<li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
			<li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
		</ul>
		<button style="width:150px;height:50px"  id="output">拿到url</button>
		<t-button theme="primary" shape="round" variant="base" style="margin-left: 20px" @click="getData"> 获取角色祈愿池数据
		</t-button>
	</div>
</template>

<script>
import {ref, toRefs} from 'vue'
import gachaUrlParse from "@/store/gachaUrlParse";
import util from '@/store/util'
import {NotifyPlugin} from "tdesign-vue-next";
import axios from 'axios'

export default {
	props: {
		msg: String
	},
	setup(props) {
		const str = toRefs(props)
		const notificationFlag = ref(null);
		const getData = () => {
			gachaUrlParse.getGachaURL('301', async (initUrl) => {
				let res = []
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
				
				let proxyUrl = '/gacha' + initUrl.substring(initUrl.indexOf('/api'))
				console.log(proxyUrl)
				let tempRes
				let count = 0
				tempRes = await (await axios.get(proxyUrl)).data.data.list
				console.log(tempRes)
				console.log(count)
				for (let i = 0; i < tempRes.length; i++) {
					res.push(tempRes[i])
				}
				while (tempRes.length === 20) {
					count++;
					util.sleep(Math.round(Math.random() * 200 + 800))
					gachaUrlParse.changeRequestParamEndId(initUrl, tempRes[tempRes.length - 1].id)
					tempRes = await (await axios.get(proxyUrl)).data.data.list
					console.log(tempRes)
					console.log(count)
					for (let i = 0; i < tempRes.length; i++) {
						console.log(tempRes[i])
						res.push(tempRes[i])
					}
				}
				console.log(res)
			})
		}
		return {
			str,
			getData
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
