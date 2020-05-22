import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
import '@/css/index.css';
import store from "@/store";
import hasPermission from '@/libs/hasPermission';
import axios from "axios"
import "@/assets/iconfont/iconfont.css"

import config from '@/config'
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config


Vue.use(ViewUI);
Vue.use(hasPermission);
// Vue.use(axios);

// 设置网络超时
/* Vue.prototype.$axios = axios.create({
  timeout: 60000
}); */

// axios.defaults.timeout = 5000;// 请求超时
//axios.defaults.baseURL = '/admin/';// admin 即 vue.config.js 中配置的地址

Vue.config.productionTip = false

window.vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
