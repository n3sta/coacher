import Vue from 'vue';
import Vuex from 'vuex';
import Vuelidate from 'vuelidate';
import store from './store/index';
import './css/layout.scss';

import Index from './Index.vue'
import router from './router'

import Loader from './components/Loader';
import Select from './components/Select'
import SelectSimple from './components/SelectSimple'
import Button from './components/Button'
import Checkbox from './components/Checkbox'
import Datepicker from './components/Datepicker'
import Dropdown from './components/Dropdown'
import Input from './components/Input'
import Modal from './components/Modal'
import Textarea from './components/Textarea'

Vue.component('v-loader', Loader);
Vue.component('v-datepicker', Datepicker);
Vue.component('v-dropdown', Dropdown);
Vue.component('v-button', Button);
Vue.component('v-select', Select);
Vue.component('v-select-simple', SelectSimple);
Vue.component('v-checkbox', Checkbox);
Vue.component('v-input', Input);
Vue.component('v-modal', Modal);
Vue.component('v-textarea', Textarea);

Vue.use(Vuex);
Vue.use(Vuelidate);

new Vue({
  router,
  store,
  render: h => h(Index)
}).$mount('#root');