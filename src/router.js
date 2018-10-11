import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkActiveClass: 'nav__link--active',
    routes: [
        {
            path: '/panel',
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
            path: '/trening',
            name: 'addTraining',
            component: () => import('./components/form'),
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
            path: '/konto',
            name: 'account',
            component: () => import('./views/Settings/Account')
        },               
        {
            path: '/treningi',
            name: 'trainings',
            component: () => import('./views/Settings/Trainings')
        },
        {
            path: '/zawodnicy',
            name: 'pupils',
            component: () => import('./views/Settings/Pupils')
        },
        {
            path: '/ustawienia-ankiety',
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
            path: '/ankieta/',
            name: 'profiler',
            component: () => import('./views/Auth/Profiler'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/ustawienia-ankiety/pytanie/:id',
            name: 'addQuestion',
            props: true,
            component: () => import('./views/Settings/addQuestion'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
    ]
});

const guard = (to, from, next) => {
    if (store.getters.token) {
        next()
    } else {
        next('/logowanie');
    }
};