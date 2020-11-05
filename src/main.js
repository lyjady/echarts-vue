import Vue from 'vue'
import App from './App.vue'
import echarts from 'echarts'
import axios from 'axios'
import router from '@/router';
import '@/assets/css/global.less'
import '../public/static/theme/chalk'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
