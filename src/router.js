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
            component: () => import('./views/Panel/Index')
        },
        {
            path: '/treningi',
            name: 'admin',
            component: () => import('./views/Calendar/Index')
        },
        {
            path: '/ustawienia',
            name: 'settings',
            component: () => import('./views/Settings/Index')
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
            component: () => import('./views/Auth/Profiler')
        },
    ]
});