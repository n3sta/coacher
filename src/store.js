import Vue from 'vue'
import Vuex from 'vuex'
import { get,post } from './helpers/api.js'
import Auth from './helpers/auth'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            token: localStorage.getItem('token'),
            userId: null,
            email: null,
            coach: null
        },
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
        user: state => state.user
    },
    mutations: {
        setUser(state, data) {
            Object.assign(state.user, data);
            if (!localStorage.getItem('token')) {
                localStorage.setItem('token', data.token);
            }
            localStorage.setItem('userId', data.userId);
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            router.push({name: 'login'});
            state.user = {};
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
        logout ({ commit }) {
            commit('logout');
        },
        setUser({ commit, dispatch }, data) {
            commit('setUser', data);
            dispatch('getStartData');
        },
        getUser({ commit, dispatch }) {
            if (!localStorage.getItem('userId')) {
                return false;
            }
            get(`/users`, {
                _id: localStorage.getItem('userId')
            }).then((res) => {
                commit('setUser', {userId: res.data[0]._id, email: res.data[0].email, coach: res.data[0].coach});
                dispatch('getStartData');
            });
        },
        getStartData({ commit, dispatch, state }) {
            dispatch('getTrainingTypes');
            if (state.user.coach) {
                dispatch('getPupils');   
            }
        },
        getPupils ({ commit, state }) {
            get(`/users`, {
                coachId: state.user.userId
            }).then((res) => {
                commit('getPupils', res.data);
            });
        },
        getTrainingTypes ({ commit, state }) {
            get(`/trainingTypes`, {
                userId: state.user.userId
            }).then((res) => {
                commit('getTrainingTypes', res.data);
            });
        },
        setSnackbar ({ commit }, data) {
            commit('setSnackbar', data);
        },
        openAlert ({ commit }, { title, body }) {
            return new Promise((resolve, reject) => {
                commit('openAlert', {
                    show: true,
                    title,
                    body,
                    resolve,
                    reject
                });
            });
        },
        closeAlert({ commit }) {
            commit('closeAlert');
        }
    }
});