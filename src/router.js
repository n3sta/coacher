import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import App from './App'
import Auth from './Auth'

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkActiveClass: 'nav__link--active',
    routes: [
        {
            path: '/auth',
            name: 'Home',
            component: Auth,
            children: [
                {
                    path: '/register',
                    name: 'register',
                    component: () => import('./views/Auth/Register')
                },
                {
                    path: '/login',
                    name: 'login',
                    component: () => import('./views/Auth/Login')
                },
                {
                    path: '/profiler',
                    name: 'profiler',
                    component: () => import('./views/Auth/Profiler'),
                    beforeEnter: (to, from, next) => {
                        guard(to, from, next)
                    },
                },
            ]
        },
        {
            path: '/',
            component: App,
            children: [
                {
                    path: '/',
                    name: 'panel',
                    component: () => import('./views/Panel/Index'),
                },
                {
                    path: '/trainings',
                    name: 'admin',
                    component: () => import('./views/Trainings/Index'),
                },
                {
                    path: '/trainings/add/:user/:createdAt',
                    name: 'addTraining',
                    props: true,
                    component: () => import('./views/Trainings/Form'),
                },
                {
                    path: '/trainings/edit/:_id',
                    name: 'editTraining',
                    props: true,
                    component: () => import('./views/Trainings/Form'),
                },
                {
                    path: '/starts',
                    name: 'starts',
                    component: () => import('./views/Starts/Index'),
                },
                {
                    path: '/starts/add',
                    name: 'addStart',
                    component: () => import('./views/Starts/Form'),
                },
                {
                    path: '/starts/edit/:_id',
                    name: 'editStart',
                    props: true,
                    component: () => import('./views/Starts/Form'),
                },
                {
                    path: '/trainingTypes',
                    name: 'trainingTypes',
                    component: () => import('./views/Trainings/trainingTypes'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/account',
                    name: 'account',
                    component: () => import('./views/Users/Account')
                },
                {
                    path: '/pupils',
                    name: 'pupils',
                    component: () => import('./views/Users/Pupils'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/pupils/:_id',
                    name: 'pupil',
                    props: true,
                    component: () => import('./views/Users/Pupil')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('./views/Users/Users'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('./views/Questions/Index')
                },
                {
                    path: '/questions/form',
                    name: 'addQuestion',
                    component: () => import('./views/Questions/Form'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions/edit/:_id',
                    name: 'editQuestion',
                    props: true,
                    component: () => import('./views/Questions/Form'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                }
            ],
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        { path: "*", component: () => import('./views/Errors/E404') }
    ]
});

const guard = (to, from, next) => {
    if (store.getters.token) {
        next()
    } else {
        next('/login');
    }
};

const coach = (to, from, next) => {
    if (store.getters.user.coach) {
        next()
    } else {
        next('/');
    }
};