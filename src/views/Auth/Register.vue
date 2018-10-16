<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Rejestracja</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()">
                    <div class="row">
                        <div class="col-sm-6 col-xs-12">
                            <div class="form__box">
                                <v-input v-model="form.name.firstName" :value="form.name.firstName" :id="'firstName'" @input="form.name.firstName = $event" @keyup="$v.form.name.firstName.$touch()">Imię</v-input>
                                <div v-if="$v.form.name.firstName.$error">
                                    <div class="form__error" v-if="!$v.form.name.firstName.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.name.firstName.minLength">To pole musi mieć co najmniej {{ $v.firstName.$params.minLength.min }} znaki</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <div class="form__box">
                                <v-input v-model="form.name.lastName" :value="form.name.lastName" :id="'email'" @input="form.name.lastName = $event" @keyup="$v.form.name.lastName.$touch()">Nazwisko</v-input>
                                <div v-if="$v.form.name.lastName.$error">
                                    <div class="form__error" v-if="!$v.form.name.lastName.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.name.lastName.minLength">To pole musi mieć co najmniej {{ $v.form.name.lastName.$params.minLength.min }} znaki</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-input :type="'email'" v-model="form.email" :value="form.email" :id="'email'" @input="form.email = $event" @keyup="$v.form.email.$touch()">Adres e-mail</v-input>
                        <div v-if="$v.form.email.$error">
                            <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-input :type="'password'" v-model="form.password" :value="form.password" :id="'email'" @input="form.password = $event" @keyup="$v.form.password.$touch()">Hasło</v-input>
                        <div v-if="$v.form.password.$error">
                            <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.password.minLength">To pole musi mieć co najmniej {{ $v.form.password.$params.minLength.min }} znaków</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing">Zarejestruj</v-button>
                    </div>
                </form>
            </div>
        </div>
        <router-link :to="{name: 'login'}" class="login-link">Zaloguj się</router-link>
    </div>
</template>

<script>
    import { required, minLength, email } from 'vuelidate/lib/validators'
    import store from '../../store';
    import { post } from '../../helpers/api'

    export default {
        data() {
            return {
                form: {
                    name: {
                        firstName: null,
                        lastName: null,
                    },
                    email: '',
                    password: '',
                },
                isProcessing: false,
            }
        },
        methods: {
            submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                post('/auth/register', this.form).then((res) => {
                    store.dispatch('setUser', {token: res.data.token, user: res.data.user});
                    this.$router.push({name: 'panel'})
                })
                .catch(() => {
                    this.isProcessing = false;
                })
            },
        },
        validations: {
            form: {
                name: {
                    firstName: {
                        required,
                        minLength: minLength(3)
                    },
                    lastName: {
                        required,
                        minLength: minLength(3)
                    }
                },
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8)
                }
            }
        }
    }
</script>