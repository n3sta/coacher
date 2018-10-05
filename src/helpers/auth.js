import router from '../router'
import store from '../store'

export default {
	set(token, userId, email, coach, redirect = 1)  {
		store.dispatch('setUser', {token, userId, email, coach});

		if (redirect) {
			router.push({name: 'panel'});
		}
	},
}
