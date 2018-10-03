import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import messages from 'vee-validate/dist/locale/pl';
import VeeValidate, { Validator } from 'vee-validate';

import style from './css/layout.scss';

import App from './App.vue'
import router from './router'
import store from './store'
import { get } from './helpers/api';
import auth from './helpers/auth'
import axios from "axios/index";

Vue.use(Vuetify, {
    theme: {
        primary: '#1565C0',
        primaryDark: '#3177C7',
        gray: 'e5e6e7',
        green: '50b94b',
        error: '#ff7978',
        white: '#ffffff'
    }
});
Vue.use(Vuex);

Validator.localize('pl', messages);

Vue.use(VeeValidate, {
    changes: 'blur',
    locale: 'pl'
});

const uniqueLogin = (value) => {
    return get(`/users`, {
        login: value
    }).then((res) => {
        return !!(res.data);
    });
};

const uniqueEmail = (value) => {
    return get(`/users`, {
        params: {
            email: value
        }
    }).then((res) => {
        return !!(res.data);
    });
};

const oldPassword = (value) => {
    return get(`/api/oldPassword/${Auth.state.user_id}/${value}`).then((res) => {
        return {
            valid: res.data.valid,
            data: {
                message: res.data.message
            }
        };
    });
};

VeeValidate.Validator.extend('uniqueLogin', {
    validate: uniqueLogin,
    getMessage: (field, params, data) => {
        return data.message;
    }
});

VeeValidate.Validator.extend('uniqueEmail', {
    validate: uniqueEmail,
    getMessage: (field, params, data) => {
        return data.message;
    }
});

VeeValidate.Validator.extend('oldPassword', {
    validate: oldPassword,
    getMessage: (field, params, data) => {
        return data.message;
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root');