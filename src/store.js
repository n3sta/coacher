import Vue from 'vue'
import Vuex from 'vuex'
import { get,post } from './helpers/api.js'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: true,
        token: localStorage.getItem('token'),
        user: {
            _id: localStorage.getItem('_id'),
            email: null,
            coach: null,
            name: {
                firstName: null
            },
            activated: false
        },
        pupils: [],
        trainingTypes: [],
        snackbar: {
            show: false,
            text: '',
            class: '',
            timeout: null
        },
        alert: {
            show: false,
            title: '',
            body: '',
            type: null,
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
            {name: 'Długie pole tekstowe', _id: 2},
            {name: 'Lista rozwijalna', _id: 3},
            {name: 'Checkbox', _id: 4},
            {name: 'Data', _id: 5},
        ],
        modal: false
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
        loading: state => state.loading,
    },
    mutations: {
        setLoading(state) {
            state.loading = false
        },
        setUser(state, data) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('_id', data.user._id);
            state.user = data.user;
            state.token = data.token;
            if (!data.token) {
                router.push({name: 'login'});
            }
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('_id');
            state.user = {};
            state.token = null;
            router.push({name: 'login'});
        },
        getPupils (state, data) {
            state.pupils = data;
        },
        getTrainingTypes (state, data) {
            state.trainingTypes = data;
        },
        setSnackbar (state, data) {
            state.snackbar.class = data.class;
            state.snackbar.text = data.text;
            state.snackbar.show = true;
            clearTimeout(state.snackbar.timeout);
            delete state.snackbar.timeout;
            state.snackbar.timeout = setTimeout(() => {
                state.snackbar.show = false;
            }, 5000);
        },
        closeSnackbar (state) {
            state.snackbar.show = false;
            clearTimeout(state.snackbar.timeout);
            delete state.snackbar.timeout;
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
        async getPupils ({ commit, state }) {
            const res = await get(`/users`, {
                coachId: state.user._id
            });
            commit('getPupils', res.data);
        },
        async getTrainingTypes ({ commit, state }) {
            const res = await get(`/trainingTypes`, {
                userId: state.user._id
            });
            commit('getTrainingTypes', res.data);
        },
        async getUser({ commit, dispatch }) {
            if (!localStorage.getItem('_id')) {
                return false;
            }
            try {
                const res = await get(`/auth/logged/${localStorage.getItem('_id')}`);
                commit('setUser', res.data);
                dispatch('getStartData');
            } catch(e) {
                router.push({name: 'login'});
            }
        },
        setUser({ commit, dispatch }, data) {
            commit('setUser', data);
            dispatch('getStartData');
        },
        getStartData({ commit, dispatch }) {
            const getTrainingTypes = () => {
                return new Promise((resolve) => {
                    resolve(dispatch('getTrainingTypes'));
                });
            };
            const getPupils = () => {
                return new Promise((resolve) => {
                    resolve(dispatch('getPupils'));
                });
            };
            Promise.all([getTrainingTypes(), getPupils()]).then(() => {
                commit('setLoading');
            });
        },
        openAlert ({ commit }, { title, body, type }) {
            return new Promise((resolve, reject) => {
                commit('openAlert', {
                    show: true, title, body, type, resolve, reject
                });
            });
        },
        closeAlert({ commit }) {
            commit('closeAlert');
        },
    }
});