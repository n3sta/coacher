<template>
    <v-container class="loginPage" fluid fill-height>
        <v-layout justify-center>
            <v-flex xs12 sm8 md4>
                <h1 class="display-1">TheCoacher</h1>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Logowanie</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                    prepend-icon="email"
                                    placeholder="Wpisz swój adres e-mail"
                                    label="Adres e-mail"
                                    v-model="form.email"
                                    type="email"
                                    name="email"
                                    data-vv-name="email"
                                    :error-messages="errors.collect('email')"
                                    v-validate="'required|email'">
                            </v-text-field>
                            <v-text-field
                                    prepend-icon="lock"
                                    placeholder="Wpisz Hasło"
                                    name="password"
                                    label="Hasło"
                                    type="password"
                                    v-model="form.password"
                                    data-vv-name="password"
                                    :error-messages="errors.collect('password')"
                                    v-validate="'required'">
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="login()" :loading="isProcessing" :disabled="isProcessing">Zaloguj</v-btn>
                    </v-card-actions>
                </v-card>
                <v-btn class="register" color="primary" flat @click="$router.push({name: 'register'})">Zarejestuj się</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Auth from '../../helpers/auth'
    import { post, get } from '../../helpers/api'

    export default {
        data() {
            return {
                isProcessing: false,
                form: {
                    email: '',
                    password: ''
                }
            }
        },
        methods: {
            login() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false;
                    }
                    this.isProcessing = true;
                    post('/auth/login', this.form)
                        .then(res => {
                            Auth.set(res.data.token, res.data.user._id, res.data.user.email, res.data.user.coach);
                        })
                        .catch((res) => {
                            this.isProcessing = false;
                        })
                });
            }
        }
    }
</script>

<style>
    .display-1 {
        display: block;
        text-align: center;
        margin: 50px 0;
        color: #cccccc;
    }
    .register {
        display: flex;
        margin: 30px auto 0;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #fff inset;
        transition: background-color 5000s ease-in-out 0s;
    }
</style>