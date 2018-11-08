import router from '../../router'

const mutations = {
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
        state.pupils = data || [];
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
    setStats (state, data) {
        state.stats = data;
    },
    setCalendar(state, data) {
        state.calendar = data;
        console.log(data);
    },
    setNotifications(state, data) {
        state.notifications = data;
    }
}

export default mutations