import Vue from 'vue'
import App from './App.vue'
import echarts from 'echarts'
import axios from 'axios'
import router from '@/router';
import '@/assets/css/global.less'
import '../public/static/theme/chalk'
import './assets/font/iconfont.css'
import WebsocketServer from '@/service/websocket_service';
WebsocketServer.Instance.connect()
Vue.prototype.$socket = WebsocketServer.Instance

axios.defaults.baseURL = 'http://127.0.0.1:8888/api'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
