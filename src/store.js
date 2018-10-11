import Vue from 'vue'
import Vuex from 'vuex'
import { get,post } from './helpers/api.js'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token'),
        user: {
            _id: localStorage.getItem('_id'),
            email: null,
            coach: null
        },
        pupils: [],
        trainingTypes: [],
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
        },
        types: [
            {name: 'Pole tekstowe', _id: 1},
            {name: 'Lista rozwijalna', _id: 2},
            {name: 'Pole wyboru', _id: 3},
        ]
    },
    getters: {
        snackbar: state => state.snackbar,
        alert: state => state.alert,
        user: state => state.user,
        token: state => state.token,
        trainingData: state => state.trainingData,
        stats: state => state.stats,
        pupils: state => state.pupils,
        types: state => state.types,
    },
    mutations: {
        setUser(state, data) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('_id', data.user._id);
            state.user = data.user;
            state.token = data.token;
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('_id');
            state.user = {};
            state.token = null;
            router.push({name: 'login'});
        },
        getPupils (state, data) {
            if (data.length) {
                state.pupils = data;
            } else {
                state.pupils = [
                    {name: {firstName: 'Janek', lastName: 'Mądry'}, _id: '154353454354354354354354522323sdfwerw'},
                    {name: {firstName: 'Zbyszko', lastName: 'Szybki'}, _id: '3432432432432434kjnkjfdngkjdfngkjfkgj'},
                    {name: {firstName: 'Bartek', lastName: 'Silny'}, _id: '5435435431223233v213v23v243243sdfwerw'},
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
            get(`/auth/logged/${localStorage.getItem('_id')}`).then((res) => {
                commit('setUser', res.data);
                dispatch('getStartData');
            });
        },
        getStartData({ dispatch }) {
            dispatch('getTrainingTypes');
            dispatch('getPupils');
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
                userId: state.user._id
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