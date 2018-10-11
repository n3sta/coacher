<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Rejestracja</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()" autocomplete="off">
                    <div class="row">
                        <div class="form__box col-sm-6 col-xs-12">
                            <label class="form__label" for="firstName">Imię</label>
                            <input type="text" class="form__input" id="firstName" v-model="form.name.firstName" @input="$v.form.name.firstName.$touch()">
                            <div v-if="$v.form.name.firstName.$error">
                                <div class="form__error" v-if="!$v.form.name.firstName.required">To pole jest wymagane.</div>
                                <div class="form__error" v-if="!$v.form.name.firstName.minLength">To pole musi mieć co najmniej {{ $v.firstName.$params.minLength.min }} znaki</div>
                            </div>
                        </div>
                        <div class="form__box col-sm-6 col-xs-12">
                            <label class="form__label" for="lastName">Nazwisko</label>
                            <input type="text" class="form__input" id="lastName" v-model="form.name.lastName" @input="$v.form.name.lastName.$touch()">
                            <div v-if="$v.form.name.lastName.$error">
                                <div class="form__error" v-if="!$v.form.name.lastName.required">To pole jest wymagane.</div>
                                <div class="form__error" v-if="!$v.form.name.lastName.minLength">To pole musi mieć co najmniej {{ $v.form.name.lastName.$params.minLength.min }} znaki</div>
                            </div>
                        </div>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="email">Adres e-mail</label>
                        <input type="email" class="form__input" v-model="form.email" id="email" @input="$v.form.email.$touch()">
                        <div v-if="$v.form.email.$error">
                            <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="password">Hasło</label>
                        <input type="text" class="form__input" v-model="form.password" id="password" @input="$v.form.password.$touch()">
                        <div v-if="$v.form.password.$error">
                            <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.password.minLength">To pole musi mieć co najmniej {{ $v.form.password.$params.minLength.min }} znaków</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing">Zaloguj</v-button>
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
    import button from '../../components/Button';

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
        components: {
            'v-button': button
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