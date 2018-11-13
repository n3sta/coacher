<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Logowanie</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()">
                    <div class="form__box">
                        <v-input :type="'email'" v-model="form.email" :value="form.email" :id="'email'" @input="form.email = $event" @keyup="$v.form.email.$touch()">Adres e-mail</v-input>
                        <div v-if="$v.form.email.$error">
                            <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-input :type="'password'" v-model="form.password" :value="form.password" :id="'password'" @input="form.password = $event" @keyup="$v.form.password.$touch()">Hasło</v-input>
                        <div v-if="$v.form.password.$error">
                            <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing" :loading="isProcessing">Zaloguj</v-button>
                    </div>
                </form>
            </div>
        </div>
        <router-link :to="{name: 'register'}" class="login-link">Załóż bezpłatne konto</router-link>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { required, email } from 'vuelidate/lib/validators'
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
            ...mapActions(['setUser', 'setSnackbar']),
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                try {
                    const res = await post('/auth/login', this.form);
                    this.setUser(res.data);
                    this.$router.push({name: 'panel'})
                } catch(e) {
                    this.isProcessing = false;
                    this.setSnackbar({class: 'error', text: e.message});
                }
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
                }
            }
        }
    }
</script>