<template>
	<div class="about">
		<h1>This is an about page</h1>
		<div>
			<t-switch v-model="checked" size="large" :label="['开', '关']" @change="hideSetting"></t-switch>
			<span style="margin-left: 20px">{{ checked ? '任务栏驻留' : '直接退出' }}</span>
		</div>
	</div>
</template>
<script>
import localConfig from '../store/localStorage.js'
import {ref} from "vue";
export default {
	setup() {
		const checked = ref(localConfig.getItem('hide') === 'true');
		const hide = ref(localConfig.getItem('hide') === 'true')
		const hideSetting = () => {
			console.log('00000000000000000')
			localConfig.setItem('hide', hide.value ? 'false' : 'true')
			hide.value = !hide.value
			console.log(hide.value)
			console.log(localConfig.getItem('hide'))
			console.log(localConfig.configUrl)
		}
		return {
			checked,
			hide,
			hideSetting
		}
	}
}
</script>
