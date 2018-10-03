import Vue from 'vue'
import Vuex from 'vuex'
import { get,post } from './helpers/api.js'
import Auth from './helpers/auth'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: true,
        pupils: {},
        trainingTypes: {},
        snackbar: {
            show: false,
            color: '',
            text: '',
            timeout: 0,
        },
        alert: {
            show: false,
            title: '',
            body: '',
            resolve: null,
            reject: null,
        },
    },
    getters: {
        snackbar: state => state.snackbar,
        alert: state => state.alert,
    },
    mutations: {
        logout(state) {
            Auth.remove();
            router.push({name: 'login'});
        },
        getPupils (state, data) {
            state.pupils = data;
        },
        getTrainingTypes (state, data) {
            state.trainingTypes = data;
        },
        setSnackbar (state, data) {
            state.snackbar.color = data.color;
            state.snackbar.text = data.text;
            state.snackbar.timeout = data.timeout || 5000;
            state.snackbar.show = !data.hide;
        },
        openAlert (state, data) {
            Object.assign(state.alert, data)
        },
        closeAlert (state) {
            state.alert.show = false;
        },
    },
    actions: {
        logout (context) {
            context.commit('logout');
        },
        getPupils (context) {
            get(`/users`, {
                coachId: localStorage.getItem('userId')
            }).then((res) => {
                context.commit('getPupils', res.data)
            });
        },
        getTrainingTypes (context) {
            get(`/trainingTypes`)
                .then((res) => {
                    context.commit('getTrainingTypes', res.data);
                })
        },
        setSnackbar (context, data) {
            context.commit('setSnackbar', data);
        },
        openAlert ({ context }, { title, body }) {
            return new Promise((resolve, reject) => {
                context.commit('openAlert', {
                    show: true,
                    title,
                    body,
                    resolve,
                    reject
                });
            });
        },
        closeAlert({ context }) {
            context.commit('closeAlert');
        }
    }
});