<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm6 class="no-padding">
                <v-flex xs12>
                    <v-form @submit.prevent="changeEmail()">
                        <v-card>
                            <v-card-title>
                                <h2 class="headline">Zmiana e-maila</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                        prepend-icon="email"
                                        label="Nowy adres e-mail"
                                        type="email"
                                        persistent-hint
                                        :hint="`Obecny adres e-mail: ${user.email}`"
                                        v-model="form.email">
                                </v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn type="submit" color="primary">Zapisz</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>   
                </v-flex>
                <v-flex xs12>
                    <v-form @submit.prevent="changePassword()">
                        <v-card>
                            <v-card-title>
                                <h2 class="headline">Zmiana hasła</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                        prepend-icon="lock"
                                        label="Stare hasło"
                                        type="password"
                                        v-model="form.oldPassword">
                                </v-text-field>
                                <v-text-field
                                        prepend-icon="lock"
                                        label="Nowe hasło"
                                        type="password"
                                        v-model="form.password">
                                </v-text-field>
                                <v-text-field
                                        prepend-icon="lock"
                                        label="Powtórz nowe hasło"
                                        type="password"
                                        v-model="form.password_confirmation">
                                </v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="changePassword()" :loading="isProcessingPass" :disabled="isProcessingPass">Zapisz</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>   
                </v-flex>
            </v-flex>
            <v-flex xs12 sm6 class="no-padding">
                <v-flex xs12>
                    <v-form @submit.prevent="changeCoach()" data-vv-scope="changeCoach">
                        <v-card>
                            <v-card-title>
                                <h2 class="headline">Ustawienia konta trenerskiego</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-switch
                                    :label="`Jestem trenerem`"
                                    v-model="user.coach"
                                    color="green"
                                    true-value="1"
                                ></v-switch>
                                <div class="subheading">Dostępnych kont zawodników: 3</div>
                                <div class="subheading">Premium ważne do: 2018-10-31</div>
                                <div class="subheading">Wykupiony pakiet: <v-btn color="green">Zawodowiec</v-btn></div>
                            </v-card-text>
                        </v-card>
                    </v-form>   
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { get,post,put } from '../../helpers/api'
    import store from '../../store'

    export default {
        data() {
            return {
                form: {
                    login: '',
                    email: '',
                    oldPassword: '',
                    password: '',
                    password_confirmation: '',
                },
                user: store.getters.user,
                isProcessingEmail: false,
                isProcessingPass: false,
            }
        },
        watch: {
            'user.coach': function() {
                this.changeCoach();
            }
        },
        methods: {
            changeEmail() {
                this.isProcessingEmail = true;
                    put(`/users/${this.user.userId}`, {email: this.form.email})
                        .then((res) => {
                            if(res.data.status) {
                                Auth.set(res.data.token, res.data.entity._id, res.data.entity.email, res.data.entity.coach);
                                this.user.email = res.data.email;
                                store.dispatch('setSnackbar', {color: 'green', text: 'Email został zmieniony'});
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Ten adres e-mail jest zarezerwowany.'});
                            }
                            this.isProcessingEmail = false;
                        })
                        .catch((err) => {
                            this.isProcessingEmail = false;
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        })
            },
            changePassword() {
                this.isProcessingPass = true;
                    put('/api/changePassword', {id: Auth.state.user_id, oldPassword: this.form.oldPassword, password: this.form.password})
                        .then((res) => {
                            if(res.data) {
                                store.dispatch('setSnackbar', {color: 'green', text: 'Hasło zostało zmienione'});
                                this.form.oldPassword = '';
                                this.form.password = '';
                                this.form.password_confirmation = '';
                            } else {
                                this.isLogin = false;
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            }
                            this.isProcessingPass = false;
                        })
                        .catch((err) => {
                            this.isProcessingPass = false;
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        })
            },
            changeCoach() {
                put(`/users/${Auth.state.userId}`, {coach: this.user.coach*1}).then((res) => {
                    if (res.data.coach) {
                        store.dispatch('setSnackbar', {color: 'green', text: 'Konto trenerskie włączone.'});
                        Auth.set(res.data.token, res.data.user._id, res.data.user.email, res.data.user.coach, 0);
                    } else {
                        store.dispatch('setSnackbar', {color: 'green', text: 'Konto trenerskie wyłączone.'});
                    }
                });
            },
        }
    }
</script>