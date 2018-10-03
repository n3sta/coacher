<template>
    <v-container class="loginPage" fluid fill-height>
        <v-layout justify-center>
            <v-flex xs12 sm8 md4>
                <h1 class="display-1">TheCoacher</h1>
                <v-form>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Rejestracja</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                        prepend-icon="email"
                                        label="Adres e-mail"
                                        type="email"
                                        v-model="form.email"
                                        data-vv-name="email"
                                        :error-messages="errors.collect('email')"
                                        v-validate="'required|email|uniqueEmail'">
                                </v-text-field>
                                <v-text-field
                                        prepend-icon="lock"
                                        label="Hasło"
                                        type="password"
                                        v-model="form.password"
                                        data-vv-name="password"
                                        name="password"
                                        :error-messages="errors.collect('password')"
                                        v-validate="'required:min:8'">
                                </v-text-field>
                                <v-checkbox
                                        label="Jestem trenerem"
                                        persistent-hint
                                        hint="Konto trenera zezwala na układnie planów treningowych swoim zawodnikom."
                                        v-model="form.coach">
                                </v-checkbox>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="register" :loading="isProcessing" :disabled="isProcessing">Zarejestruj</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
                <v-btn class="login" color="primary" flat @click="$router.push({name: 'login'})">Zaloguj się</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Auth from '../../helpers/auth'
    import { post } from '../../helpers/api'

    export default {
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                    coach: 0,
                },
                isProcessing: false,
            }
        },
        methods: {
            register() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false;
                    }
                    this.isProcessing = true;
                    post('/auth/register', this.form)
                        .then((res) => {
                            Auth.set(res.data.token, res.data.user._id, res.data.user.email, res.data.user.coach);
                        })
                        .catch(() => {
                            this.isProcessing = false;
                        })
                });
            },
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
    .login {
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