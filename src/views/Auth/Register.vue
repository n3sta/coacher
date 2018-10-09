<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Rejestracja</div>
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
        <router-link :to="{name: 'login'}" class="login-link">Zaloguj się</router-link>
    </div>
</template>

<script>
    import store from '../../store';
    import { post } from '../../helpers/api'
    import button from '../../components/Button';

    export default {
        data() {
            return {
                form: {
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
                this.isProcessing = true;
                post('/auth/register', this.form).then((res) => {
                    store.dispatch('setUser', {token: res.data.token, _id: res.data.user._id, email: res.data.user.email, coach: res.data.user.coach});
                    this.$router.push({name: 'panel'})
                })
                .catch(() => {
                    this.isProcessing = false;
                })
            },
        }
    }
</script>