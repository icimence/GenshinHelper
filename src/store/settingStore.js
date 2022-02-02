import {defineStore} from "pinia";
import localConfig from '@/store/localStorage'

export const useSettingStore = defineStore('settingStore',{
	state:()=>{
		return{
			sidebar: localConfig.getItem('sidebar') === 'true'
		}
	}
})