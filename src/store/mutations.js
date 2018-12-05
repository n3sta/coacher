import router from '../router'
import { SET_LOADING, SET_USER, LOGOUT, GET_PUPILS, SET_SNACKBAR, CLOSE_SNACKBAR, SET_ALERT, CLOSE_ALERT, SET_STATS, SET_CALENDAR, SET_NOTIFICATIONS } from './mutations_types';


const mutations = {
    [SET_LOADING] (state) {
        state.loading = false;
    },
    [SET_USER] (state, data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('_id', data.user._id);
        state.user = data.user;
        state.token = data.token;
        if (!data.token) router.push({name: 'login'});
    },
    [LOGOUT] (state) {
        localStorage.removeItem('token');
        localStorage.removeItem('_id');
        state.user = {};
        state.token = null;
        router.push({name: 'login'});
    },
    [GET_PUPILS] (state, data) {
        state = {...state, pupils: data || []}
    },
    [SET_SNACKBAR] (state, data) {
        clearTimeout(state.snackbar.timeout);
        delete state.snackbar.timeout;
        state.snackbar.class = data.class;
        state.snackbar.text = data.text;
        state.snackbar.show = !state.snackbar.show;
        state.snackbar.timeout = setTimeout(() => {
            state = {...state, show: false}
        }, 5000);
    },
    [CLOSE_SNACKBAR] (state) {
        state.snackbar.show = false;
        clearTimeout(state.snackbar.timeout);
        delete state.snackbar.timeout;
    },
    [SET_ALERT] (state, data) {
        state.alert = data;
    },
    [CLOSE_ALERT] (state) {
        state.alert.show = false;
    },
    [SET_STATS] (state, data) {
        state.stats = data;
    },
    [SET_CALENDAR] (state, data) {
        state.calendar = data;
    },
    [SET_NOTIFICATIONS] (state, data) {
        state.notifications = data;
    }
}

export default mutations