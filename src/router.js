import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
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
                    path: '/types',
                    name: 'types',
                    component: () => import('./views/types/Index'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/types/create',
                    name: 'createType',
                    props: true,
                    component: () => import('./views/types/Form.vue'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/types/edit/:_id',
                    name: 'editType',
                    props: true,
                    component: () => import('./views/types/Form.vue'),
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
                    component: () => import('./views/Users/Index'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/pupils/:_id',
                    name: 'pupil',
                    props: true,
                    component: () => import('./views/Users/Pupil'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('./views/Questions/Index'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
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