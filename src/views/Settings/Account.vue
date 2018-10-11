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
                                        <input type="text" class="form__input" id="firstName" v-model="user.name.firstName" @input="$v.user.name.firstName.$touch()">
                                        <div v-if="$v.user.name.firstName.$error">
                                            <div class="form__error" v-if="!$v.user.name.firstName.required">To pole jest wymagane.</div>
                                            <div class="form__error" v-if="!$v.user.name.firstName.minLength">To pole musi mieć co najmniej {{ $v.user.name.firstName.$params.minLength.min }} znaki.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <div class="form__box">
                                        <label class="form__label" for="lastName">Nazwisko</label>
                                        <input type="text" class="form__input" id="lastName" v-model="user.name.lastName" @input="$v.user.name.lastName.$touch()">
                                        <div v-if="$v.user.name.lastName.$error">
                                            <div class="form__error" v-if="!$v.user.name.lastName.required">To pole jest wymagane.</div>
                                            <div class="form__error" v-if="!$v.user.name.lastName.minLength">To pole musi mieć co najmniej {{ $v.user.name.lastName.$params.minLength.min }} znaki.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="email">Adres e-mail</label>
                                <input type="email" class="form__input" id="email" v-model="user.email" @input="$v.user.email.$touch()">
                                <div v-if="$v.user.email.$error">
                                    <div class="form__error" v-if="!$v.user.email.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.user.email.email">Nieprawidłowy format e-mail.</div>
                                </div>
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
                                <input type="password" class="form__input" id="oldPassword" v-model="form.oldPassword" @input="delayTouch($v.form.oldPassword)">
                                <div v-if="$v.form.oldPassword.$error">
                                    <div class="form__error" v-if="!$v.form.oldPassword.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.oldPassword.correct">Nieprawidłowe hasło.</div>
                                </div>
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="newPassword">Nowe hasło</label>
                                <input type="password" class="form__input" id="newPassword" v-model="form.password" @input="$v.form.password.$touch()">
                                <div v-if="$v.form.password.$error">
                                    <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.password.minLength">To pole musi mieć co najmniej {{ $v.form.password.$params.minLength.min }} znaków.</div>
                                </div>
                            </div>
                            <div class="form__box">
                                <label class="form__label" for="newPasswordConfirm">Powtórz nowe hasło</label>
                                <input type="password" class="form__input" id="newPasswordConfirm" v-model="form.confirm" @input="$v.form.confirm.$touch()">
                                <div v-if="$v.form.confirm.$error">
                                    <div class="form__error" v-if="!$v.form.confirm.sameAsPassword">Wpisane hasła różnią się od siebie.</div>
                                </div>
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
    import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
    import { get, put, patch } from '../../helpers/api'
    import store from '../../store'
    import checkbox from '../../components/Checkbox'
    import button from '../../components/Button'

    const touchMap = new WeakMap();

    export default {
        data() {
            return {
                isSubmitting: false,
                form: {
                    oldPassword: '',
                    password: '',
                    confirm: '',
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
            },
        },
        methods: {
            async submitUserData() {
                this.$v.$touch();
                if (this.$v.user.$invalid) {
                    return false;
                }
                await put(`/users/${this.user._id}`, this.user);
                store.dispatch('getUser');
            },
            async submitPassword() {
                this.$v.$touch();
                if (this.$v.form.$invalid) {
                    return false;
                }
                await patch(`/users/changePassword`, {password: this.form.password});
            },
            async changeCoach(value) {
                await put(`/users/${this.user._id}`, {coach: value});
                store.dispatch('getUser');
            },
            delayTouch($v) {
                $v.$reset();
                if (touchMap.has($v)) {
                    clearTimeout(touchMap.get($v));
                }
                touchMap.set($v, setTimeout($v.$touch, 150));
            }
        },
        validations: {
            user: {
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
            },
            form: {
                oldPassword: {
                    required,
                    async correct(value) {
                        if (value === '') return true;
                        const res = await get('users/checkPassword', {password: value});
                        return res.data;
                    }
                },
                password: {
                    required,
                    minLength: minLength(8)
                },
                confirm: {
                    sameAsPassword: sameAs('password')
                },
            }
        }
    }
</script>