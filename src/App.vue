<template>
	<div class="appContainer">
		<div @mouseenter="unfold" @mouseleave="fold" style="z-index: 1">
			<t-menu theme="light" default-value="item1" :collapsed="collapsed"
			        style="height: 100vh;background-color: #f7f7f7;border-right:solid 1px gainsboro">
				<template #logo @click="$router.push('/')">
					<div
						style="display: flex;flex-direction: row;justify-content: center;align-items: center;height: inherit;width: inherit">
						<img
							:src="collapsed? 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png': 'https://www.tencent.com/img/index/menu_logo_hover.png'"
							:width="collapsed? 35:136" alt="logo">
					</div>
				</template>
				<t-menu-item value="item1" @click="$router.push('/')">
					<template #icon>
						<img src="./assets/stone.png" alt="stone" style="height: 30px;width: 30px;margin-left: -5px">
					</template>
					祈愿总览
				</t-menu-item>
				<t-submenu value="2" mode="popup">
					<template #icon>
						<img src="./assets/genshin.png" alt="genshinLogo" style="height: 20px;width: 20px;margin-right: 5px">
					</template>
					<template #title>
						<span>祈愿详细数据</span>
					</template>
					<t-menu-item value="2-1"> 角色祈愿池</t-menu-item>
					<t-menu-item value="2-2"> 武器祈愿池</t-menu-item>
					<t-menu-item value="2-3"> 常驻祈愿池</t-menu-item>
				</t-submenu>
				<t-menu-item value="item2">
					<template #icon>
						<t-icon name="play-circle"/>
					</template>
					视频区
				</t-menu-item>
				<t-menu-item value="item3" @click="$router.push('/about')">
					<template #icon>
						<t-icon name="setting"/>
					</template>
					软件设置
				</t-menu-item>
				<template #operations>
					<t-icon class="operations-icon" :name="iconName" @click="changeCollapsed"/>
					<span v-if="!collapsed" style="transition: all 0.25s">收起侧边栏</span>
				</template>
			</t-menu>
		</div>
		<router-view class="content_container"/>
	</div>
</template>

<script>
import {ref, computed} from 'vue';
import localConfig from '@/store/localStorage.js'
export default {
	setup() {
		const collapsed = ref(true)
		const iconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));
		const sidebarSetting = ref(localConfig.getItem('sidebar') === 'true')
		const changeCollapsed = () => {
			collapsed.value = !collapsed.value;
		};
		const unfold = () =>{
			if (!sidebarSetting.value)
				collapsed.value = false
		}
		const fold=()=>{
			collapsed.value = true
		}
		return {
			collapsed,
			iconName,
			fold,
			unfold,
			changeCollapsed
		}
	}
}
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	
	color: #2c3e50;
}

.appContainer {
	display: flex;
	flex-direction: row;
}

.content_container {
	left: 64px;
	position: absolute;
}

.operations-icon {
	width: 32px;
	height: 32px;
	padding: 8px;
	cursor: pointer;
	color: var(--td-font-gray-1);
	transition: background-color .24s cubic-bezier(.38, 0, .24, 1);
}


.operations-icon:hover {
	background-color: #eeeeee;
}

#nav {
	padding: 30px;
	
	a {
		font-weight: bold;
		color: #2c3e50;
		
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
