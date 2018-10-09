import Vue from 'vue'
import Vuex from 'vuex'
import { get,post } from './helpers/api.js'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            _id: localStorage.getItem('_id'),
            token: localStorage.getItem('token'),
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
        trainingData: {
            _id: null,
            createdAt: null,
            userId: null
        },
        stats: {
            week: 0,
            weekDone: 0,
            month: 0,
            monthDone: 0,
            plan: 0,
            planDone: 0,
            planPercent: 0
        }
    },
    getters: {
        snackbar: state => state.snackbar,
        alert: state => state.alert,
        user: state => state.user,
        trainingData: state => state.trainingData,
        stats: state => state.stats,
        pupils: state => state.pupils,
    },
    mutations: {
        setUser(state, data) {
            Object.assign(state.user, data);
            if (!localStorage.getItem('token')) {
                localStorage.setItem('token', data.token);
            }
            localStorage.setItem('_id', data._id);
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('_id');
            router.push({name: 'login'});
            state.user = {};
        },
        getPupils (state, data) {
            if (data.length) {
                state.pupils = data;
            } else {
                state.pupils = [
                    {name: 'Janek Jakiś', _id: '154353454354354354354354522323sdfwerw'},
                    {name: 'Wojtek Silny', _id: '3432432432432434kjnkjfdngkjdfngkjfkgj'},
                    {name: 'Kamyk pijany', _id: '5435435431223233v213v23v243243sdfwerw'},
                ]
            }
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
        setTrainingData (state, data) {
            state.trainingData = data;
        },
        setStats (state, data) {
            state.stats = data;
        }
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
            if (!localStorage.getItem('_id')) {
                return false;
            }
            get(`/users`, {
                _id: localStorage.getItem('_id')
            }).then((res) => {
                commit('setUser', {_id: res.data[0]._id, email: res.data[0].email, coach: res.data[0].coach});
                dispatch('getStartData');
            });
        },
        getStartData({ dispatch, state }) {
            dispatch('getTrainingTypes');
            if (state.user.coach) {
                dispatch('getPupils');   
            }
        },
        getPupils ({ commit, state }) {
            get(`/users`, {
                coachId: state.user._id
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
        },
        setTrainingDate({ commit }, data) {
            commit('setTrainingData', data);
        },
        setStats({ commit }, data) {
            commit('setStats', data);
        }
    }
});