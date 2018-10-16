<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Logowanie</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()">
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
                        <input type="text" class="form__input" v-model="form.password" id="password" @input="$v.form.email.$touch()">
                        <div v-if="$v.form.email.$error">
                            <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" :loading="isProcessing" :disabled="isProcessing">Zaloguj</v-button>
                    </div>
                </form>
            </div>
        </div>
        <router-link :to="{name: 'register'}" class="login-link">Załóż bezpłatne konto</router-link>
    </div>
</template>

<script>
    import { required, minLength, email } from 'vuelidate/lib/validators'
    import store from '../../store'
    import { post } from '../../helpers/api'

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
            submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                post('/auth/login', this.form)
                    .then((res) => {
                        store.dispatch('setUser', res.data);
                        this.$router.push({name: 'panel'})
                    })
                    .catch(() => {
                        this.isProcessing = false;
                    })
            }
        },
        validations: {
            form: {
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