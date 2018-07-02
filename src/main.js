/* jshint esversion: 6 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import api from './api/config.js'
import store from './store/index.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
// Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  api,
  store,
  template: '<App/>',
  components: { App }
})
