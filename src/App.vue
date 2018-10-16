<template>
    <div>
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
                        <li class="nav__item" @click="$store.dispatch('logout')"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">exit_to_app</span><span>Wyloguj</span></a></li>
                    </ul>
                </nav>
            </aside>
            <div class="content">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        created() {
            this.getUser();
        },
        computed: mapGetters(['alert', 'modal']),
        methods: {
            ...mapActions(['setSnackbar', 'closeAlert', 'getUser']),
            closeSnackbar() {
                this.setSnackbar({hide: true})
            },
            cancel() {
                this.$store.state.main.alert.resolve(false);
                this.closeAlert();
            },
            confirm() {
                this.$store.state.main.alert.resolve(true);
                this.closeAlert();
            }
        }
    }
</script>