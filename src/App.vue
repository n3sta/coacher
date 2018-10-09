<template>
    <div class="wrapper">
        <header class="header">
            <h1 class="header__logo">TheCoacher.com</h1>
        </header>
        <main class="main">
            <aside class="aside">
                <nav class="nav">
                    <ul class="nav__list">
                        <li class="nav__item"><router-link :to="{ name: 'panel' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">home</span><span>Panel główny</span></router-link></li>
                        <li class="nav__item"><router-link :to="{ name: 'admin' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">directions_run</span><span>Kalendarz</span></router-link></li>
                        <li class="nav__item"><router-link :to="{ name: 'pupils' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">group</span><span>Zawodnicy</span></router-link></li>
                        <li class="nav__item"><router-link :to="{ name: 'questions' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">contact_support</span><span>Ankieta</span></router-link></li>
                        <hr class="nav__divider">
                        <li class="nav__item"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">fiber_new</span><span>Powiadomienia</span></a></li>
                        <li class="nav__item"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">message</span><span>Wiadomości</span></a></li>
                        <hr class="nav__divider">
                        <li class="nav__item"><router-link :to="{ name: 'account' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">person</span><span>Edytuj profil</span></router-link></li>
                        <li class="nav__item"><router-link :to="{ name: 'settings' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">build</span><span>Ustawienia</span></router-link></li>
                        <li class="nav__item" @click="$store.dispatch('logout')"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">exit_to_app</span><span>Wyloguj</span></a></li>
                    </ul>
                </nav>
            </aside>
            <div class="content">
                <router-view></router-view>
            </div>
        </main>
    </div>
	<!-- <v-app>
		<v-content>
    		<v-toolbar color="blue darken-3" app :clipped-left="$vuetify.breakpoint.lgAndUp">
                <v-toolbar-title class="adminTitle white--text" @click="$router.push({name: 'admin'})">TheCoacher</v-toolbar-title>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn flat @click="$router.push({name: 'panel'})">Panel główny</v-btn>
                    <v-btn flat @click="$router.push({name: 'admin'})">Treningi</v-btn>
                    <v-btn flat @click="$router.push({name: 'settings'})">Ustawienia</v-btn>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn flat @click="$store.dispatch('logout')">Wyloguj</v-btn>
                </v-toolbar-items>
            </v-toolbar>

        </v-content>
		<v-snackbar :timeout="$store.state.snackbar.timeout" :color="$store.state.snackbar.color" v-model="$store.state.snackbar.show">
			{{ $store.state.snackbar.text }}
			<v-btn dark flat @click="closeSnackbar()">Zamknij</v-btn>
		</v-snackbar>
        <v-dialog v-model="alert.show" scrollable persistent  max-width="600px">
            <v-card>
                <v-card-title v-if="alert.title" class="headline">{{ alert.title }}</v-card-title>
                <v-card-text v-if="alert.body">{{ alert.body }}</v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="cancel()">Anuluj</v-btn>
                    <v-btn color="primary" @click="confirm()">Potwierdź</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
	</v-app> -->
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        created() {
            this.getUser();
        },
        computed: mapGetters(['alert']),
        methods: {
            ...mapActions(['setSnackbar', 'closeAlert', 'getTrainingTypes', 'getPupils', 'getUser']),
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