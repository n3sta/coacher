<template>
    <div>
        <div class="row">
            <div class="col-xs-12 col-sm-6">
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Ustawienia konta</div>
                    </div>
                    <div class="box__content">
                        <form @submit.prevent="submitUserData()">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <div class="form__box">
                                        <label class="form__label" for="firstName">Imię</label>
                                        <input type="text" class="form__input" id="firstName" v-model="user.name.firstName">
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <div class="form__box">
                                        <label class="form__label" for="lastName">Nazwisko</label>
                                        <input type="text" class="form__input" id="lastName" v-model="user.name.lastName">
                                    </div>
                                </div>
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="email">Adres e-mail</label>
                                <input type="email" class="form__input" id="email" v-model="user.email">
                            </div>
                            <div class="form__buttons">
                                <div class="spacer"></div>
                                <v-button type="submit" :color="'blue'" :loading="isSubmitting" :disabled="isSubmitting">Zapisz</v-button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Ustawienia hasła</div>
                    </div>
                    <div class="box__content">
                        <form @submit.prevent="submitPassword()">
                            <div class="form__box">
                                <label class="form__label" for="oldPassword">Stare hasło</label>
                                <input type="password" class="form__input" id="oldPassword" v-model="form.oldPassword">
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="newPassword">Nowe hasło</label>
                                <input type="password" class="form__input" id="newPassword" v-model="form.password">
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="newPasswordConfirm">Powtórz nowe hasło</label>
                                <input type="password" class="form__input" id="newPasswordConfirm" v-model="form.password_confirmation">
                            </div>
                            <div class="form__buttons">
                                <div class="spacer"></div>
                                <v-button type="submit" :color="'blue'" :loading="isSubmitting" :disabled="isSubmitting">Zapisz</v-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6">
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Ustawienia trenerskie</div>
                    </div>
                    <div class="box__content">
                        <div class="form__box">
                            <v-checkbox :id="'coach'" :checked="user.coach" v-model="user.coach" @change="changeCoach($event)">Jestem trenerem</v-checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { put } from '../../helpers/api'
    import store from '../../store'
    import checkbox from '../../components/Checkbox'
    import button from '../../components/Button'

    export default {
        data() {
            return {
                isSubmitting: false,
                form: {
                    password: '',
                    password_confirmation: '',
                },
                user: store.getters.user,
            }
        },
        components: {
            'v-checkbox': checkbox,
            'v-button': button,
        },
        watch: {
            'user.coach': function() {
                this.changeCoach();
            }
        },
        methods: {
            async submitUserData() {
                await put(`/users/${this.user._id}`, this.user);
                store.dispatch('getUser');
            },
            async submitPassword() {
                await put(`/users/${this.user._id}`, {password: this.form.password});
            },
            async changeCoach(value) {
                await put(`/users/${this.user._id}`, {coach: value});
                store.dispatch('getUser');
            },
        }
    }
</script>