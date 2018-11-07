import { get } from '../../helpers/api.js'
import router from '../../router'

const actions = {
    async getUser({ commit, dispatch }) {
        if (!localStorage.getItem('_id')) {
            return false;
        }
        try {
            const res = await get(`/auth/logged/${localStorage.getItem('_id')}`);
            commit('setUser', res.data);
            commit('setCalendar', {user: res.data.user._id, date: new Date()})
            dispatch('getStartData');
        } catch(e) {
            router.push({name: 'login'});
        }
    },
    setUser({ commit, dispatch }, data) {
        commit('setUser', data);
        commit('setCalendar', {user: data.user._id, date: new Date()})
        dispatch('getStartData');
    },
    getStartData({ commit, dispatch }) {
        commit('setLoading');
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

export default actions