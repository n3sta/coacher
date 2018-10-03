import router from '../router'

export default {
	state: {
		token: null,
		userId: null,
        email: null,
        coach: null
	},
	initialize() {
		this.state.token = localStorage.getItem('token');
		this.state.userId = localStorage.getItem('userId');
		this.state.email = localStorage.getItem('email');
		this.state.coach = localStorage.getItem('coach');
	},
	set(token, userId, email, coach, redirect = 1) {
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
		localStorage.setItem('email', email);
		localStorage.setItem('coach', coach);
		this.initialize();
		if (redirect) {
			router.push({name: 'panel'});
		}
	},
	remove() {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('email');
		localStorage.removeItem('coach');
		this.initialize();
	}
}
