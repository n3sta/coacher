import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'panel',
            component: () => import('./views/Panel/Index'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/treningi',
            name: 'admin',
            component: () => import('./views/Calendar/Index'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/ustawienia',
            name: 'settings',
            component: () => import('./views/Settings/Index'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/ustawienia/konto',
            name: 'account',
            component: () => import('./views/Settings/Account')
        },               
        {
            path: '/ustawienia/treningi',
            name: 'trainings',
            component: () => import('./views/Settings/Trainings')
        },
        {
            path: '/ustawienia/zawodnicy',
            name: 'pupils',
            component: () => import('./views/Settings/Pupils')
        },
        {
            path: '/ustawienia/pytania',
            name: 'questions',
            component: () => import('./views/Settings/Questions')
        },
        {
            path: '/rejestracja',
            name: 'register',
            component: () => import('./views/Auth/Register')
        },
        {
            path: '/logowanie',
            name: 'login',
            component: () => import('./views/Auth/Login')
        },
        {
            path: '/ankieta',
            name: 'profiler',
            component: () => import('./views/Auth/Profiler'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
    ]
});

const guard = (to, from, next) => {
    if (store.getters.user.token) {
        next()
    } else {
        next('/logowanie');
    }
};