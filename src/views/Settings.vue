<template>
	<div class="about">
		<h1>This is an about page</h1>
		<div>
			<t-switch v-model="hideChecked" size="large" :label="['开', '关']" @change="hideSetting"></t-switch>
			<span style="margin-left: 20px">{{ hideChecked ? '任务栏驻留' : '直接退出' }}</span>
		</div>
		<div>
			<t-switch v-model="sidebarChecked" size="large" :label="['开', '关']" @change="sidebarSetting"></t-switch>
			<span style="margin-left: 20px">{{ sidebarChecked ? '点击展开' : '鼠标悬浮展开' }}</span>
		</div>
	</div>
</template>
<script>
import localConfig from '../store/localStorage.js'
import {onMounted, ref} from "vue";
import {useSettingStore} from "@/store/settingStore";

export default {
	setup() {
		let settingStore = useSettingStore()
		const sidebarChecked = ref(settingStore.sidebar)
		const hideChecked = ref(settingStore.hide)
		const hideSetting = () => {
			console.log('00000000000000000')
			localConfig.setItem('hide', (!hideChecked.value).toString())
			console.log(localConfig.getItem('hide'))
			console.log(localConfig.configUrl)
		}
		const sidebarSetting = () => {
			localConfig.setItem('sidebar', (!sidebarChecked.value).toString())
			settingStore.sidebar = !sidebarChecked.value
		}
		return {
			hideChecked,
			sidebarChecked,
			hideSetting,
			sidebarSetting
		}
	}
}
</script>
<style>
.about {
	margin-left: 200px;
}
</style>