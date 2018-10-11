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
                        <input type="email" class="form__input" v-model="form.email" id="email">
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="password">Hasło</label>
                        <input type="text" class="form__input" v-model="form.password" id="password">
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
    import store from '../../store'
    import { post } from '../../helpers/api'
    import button from '../../components/Button';

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
        components: {
            'v-button': button
        },
        methods: {
            submit() {
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
        }
    }
</script>