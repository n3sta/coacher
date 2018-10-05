<template>
	<v-app>
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

            <router-view></router-view>
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
	</v-app>
</template>

<script>
    import Auth from './helpers/auth';
    import store from './store'
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