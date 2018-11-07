import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters/index';
import mutations from './mutations';
import actions from './actions';

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
        stats: {
            plan: 0,
            planDone: 0
        },
        types: [
            {name: 'Pole tekstowe', _id: 1},
            {name: 'Długie pole tekstowe', _id: 2},
            {name: 'Lista rozwijalna', _id: 3},
            {name: 'Checkbox', _id: 4},
            {name: 'Data', _id: 5},
        ],
        modal: false,
        calendar: {
            user: null,
            date: null
        }
    },
    getters: getters,
    mutations: mutations,
    actions: actions,    
});