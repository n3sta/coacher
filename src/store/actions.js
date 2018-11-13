import { get } from '../helpers/api.js'
import router from '../router'

const actions = {
    async getUser({ commit }) {
        try {
            const res = await get(`/auth/logged/${localStorage.getItem('_id')}`);
            commit('SET_USER', res.data);
            commit('SET_CALENDAR', {user: res.data.user._id, date: new Date()});
            commit('SET_LOADING');
        } catch(e) {
            router.push({name: 'login'});
        }
    },
    setUser({ commit }, data) {
        commit('SET_USER', data);
        commit('SET_CALENDAR', {user: data.user._id, date: new Date()})
        commit('SET_LOADING');
    },
    setAlert ({ commit }, { show, title, body, type }) {
        return new Promise((resolve, reject) => {
            commit('SET_ALERT', {
                show: show || true, title, body, type, resolve, reject
            });
        });
    },
    setNotifications({ commit }, data) {
        commit('SET_NOTIFICATIONS', data)
    },
    setCalendar({ commit }, data) {
        commit('SET_CALENDAR', data)
    },
    logout({ commit }) {
        commit('LOGOUT');
    },
    setSnackbar({ commit }, data) {
        commit('SET_SNACKBAR', data);
    },
    setStats({ commit }, data) {
        commit('SET_STATS', data);
    },
    closeAlert({ commit }) {
        commit('CLOSE_ALERT');
    }
}

export default actions