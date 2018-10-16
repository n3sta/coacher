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
            component: () => import('./views/Trainings/Index'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/trening',
            name: 'addTraining',
            component: () => import('./views/Trainings/addTraining'),
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        {
            path: '/konto',
            name: 'account',
            component: () => import('./views/Users/Account')
        },               
        {
            path: '/treningi',
            name: 'trainings',
            component: () => import('./views/Users/Account')
        },
        {
            path: '/zawodnicy',
            name: 'pupils',
            component: () => import('./views/Users/Pupils')
        },
        {
            path: '/zawodnicy/:userId',
            name: 'pupil',
            props: true,
            component: () => import('./views/Users/Pupil')
        },
        {
            path: '/ustawienia-ankiety',
            name: 'questions',
            component: () => import('./views/Questions/Index')
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
            path: '/ustawienia-ankiety/ankieta',
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
            component: () => import('./views/Questions/addQuestion'),
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