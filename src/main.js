import {createApp} from 'vue'
import TDesign from "tdesign-vue-next";
import App from './App.vue'
import router from './router'
import store from './store'
import {createPinia} from 'pinia';
import 'tdesign-vue-next/es/style/index.css'

createApp(App).use(store).use(router).use(TDesign).use(createPinia()).mount('#app')
