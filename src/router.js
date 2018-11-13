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
                    component: () => import('./views/auth/Register')
                },
                {
                    path: '/login',
                    name: 'login',
                    component: () => import('./views/auth/Login')
                },
                {
                    path: '/profiler',
                    name: 'profiler',
                    component: () => import('./views/auth/Profiler'),
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
                    component: () => import('./views/panel/Index'),
                },
                {
                    path: '/trainings',
                    name: 'admin',
                    component: () => import('./views/trainings/Index'),
                },
                {
                    path: '/trainings/add/:user/:createdAt',
                    name: 'addTraining',
                    props: true,
                    component: () => import('./views/trainings/Form'),
                },
                {
                    path: '/trainings/edit/:_id',
                    name: 'editTraining',
                    props: true,
                    component: () => import('./views/trainings/Form'),
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
                    component: () => import('./views/users/Account')
                },
                {
                    path: '/pupils',
                    name: 'pupils',
                    component: () => import('./views/users/Index'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/pupils/:_id',
                    name: 'pupil',
                    props: true,
                    component: () => import('./views/users/Pupil'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('./views/questions/Index'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions/form',
                    name: 'addQuestion',
                    component: () => import('./views/questions/Form'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/questions/edit/:_id',
                    name: 'editQuestion',
                    props: true,
                    component: () => import('./views/questions/Form'),
                    beforeEnter: (to, from, next) => {
                        coach(to, from, next);
                    }
                },
                {
                    path: '/notifications',
                    name: 'notifications',
                    component: () => import('./components/Notifications')
                }
            ],
            beforeEnter: (to, from, next) => {
                guard(to, from, next)
            },
        },
        { path: "*", component: () => import('./views/errors/E404') }
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