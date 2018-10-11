import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import style from './css/layout.scss';

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Vuex);
Vue.use(Vuelidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root');