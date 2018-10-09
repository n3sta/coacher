import Vue from 'vue'
import Vuex from 'vuex'

import style from './css/layout.scss';

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root');