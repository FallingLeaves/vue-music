// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from "vue"
import App from "./App"
import router from "./router"
import store from "./store"

import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  loading: require('common/image/default.png'),
  attempt: 1
})

fastclick.attach(document.body)

import 'common/stylus/index.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
})
