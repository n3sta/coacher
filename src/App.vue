<template>
    <div>
        <div class="loading" v-if="loading">
            <div class="loading__logo">TheCoacher.com</div>
            <div class="loading__loader">
                <svg class="spinner" width="44px" height="44px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
            <div class="loading__text">Wczytywanie...</div>
        </div>
        <div v-else>
            <header class="header">
                <h1 class="header__logo">TheCoacher.com</h1>
            </header>
            <main class="main">
                <aside class="aside">
                    <nav class="nav">
                        <ul class="nav__list">
                            <li class="nav__item"><router-link :to="{ name: 'panel' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">home</span><span>Panel główny</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'pupils' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">group</span><span>Zawodnicy</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'admin' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">directions_run</span><span>Treningi</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'questions' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">contact_support</span><span>Ankieta</span></router-link></li>
                            <hr class="nav__divider">
                            <li class="nav__item"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">fiber_new</span><span>Powiadomienia</span></a></li>
                            <li class="nav__item"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">message</span><span>Wiadomości</span></a></li>
                            <hr class="nav__divider">
                            <li class="nav__item"><router-link :to="{ name: 'account' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">person</span><span>Edytuj profil</span></router-link></li>
                            <li class="nav__item" @click="$store.commit('logout')"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">exit_to_app</span><span>Wyloguj</span></a></li>
                        </ul>
                    </nav>
                </aside>
                <div class="content">
                    <router-view></router-view>
                </div>
                <transition name="fadeIn">
                    <div :class="['snackbar', `snackbar--${snackbar.class}`]" v-show="snackbar.show">
                        <div class="snackbar__title">{{ snackbar.text }}</div>
                        <button type="button" class="snackbar__close button-icon" @click="$store.commit('closeSnackbar')"><span class="material-icons" aria-hidden="true">close</span></button>
                    </div>
                </transition>
            </main>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import store from './store';

    export default {
        created() {
            this.getUser();
        },
        computed: mapGetters(['alert', 'modal', 'loading', 'snackbar']),
        methods: {
            ...mapActions(['setSnackbar', 'closeAlert', 'getUser']),
            cancel() {
                store.state.main.alert.resolve(false);
                this.closeAlert();
            },
            confirm() {
                store.state.main.alert.resolve(true);
                this.closeAlert();
            }
        }
    }
</script>