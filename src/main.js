import Vue from 'vue';
import Vuex from 'vuex';
import Vuelidate from 'vuelidate';
import store from './store/index';
import './css/layout.scss';

import Index from './Index.vue'
import router from './router'

import BaseLoader from './components/BaseLoader';
import BaseSelect from './components/BaseSelect'
import BaseSelectSimple from './components/BaseSelectSimple'
import BaseButton from './components/BaseButton'
import BaseCheckbox from './components/BaseCheckbox'
import BaseDatepicker from './components/BaseDatepicker'
import BaseDropdown from './components/BaseDropdown'
import BaseInput from './components/BaseInput'
import BaseModal from './components/BaseModal'
import BaseTextarea from './components/BaseTextarea'
import wysiwyg from "vue-wysiwyg";

Vue.component('v-loader', BaseLoader);
Vue.component('v-datepicker', BaseDatepicker);
Vue.component('v-dropdown', BaseDropdown);
Vue.component('v-button', BaseButton);
Vue.component('v-select', BaseSelect);
Vue.component('v-select-simple', BaseSelectSimple);
Vue.component('v-checkbox', BaseCheckbox);
Vue.component('v-input', BaseInput);
Vue.component('v-modal', BaseModal);
Vue.component('v-textarea', BaseTextarea);

Vue.use(wysiwyg, {});
Vue.use(Vuex);
Vue.use(Vuelidate);

new Vue({
  router,
  store,
  render: h => h(Index)
}).$mount('#root');