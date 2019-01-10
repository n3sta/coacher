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
                                        <v-input id="firstName" v-model="user.name.firstName" @input="user.name.firstName = $event" @keyup="$v.user.name.firstName.$touch()">Imię</v-input>
                                        <div v-if="$v.user.name.firstName.$error">
                                            <div class="form__error" v-if="!$v.user.name.firstName.required">To pole jest wymagane.</div>
                                            <div class="form__error" v-if="!$v.user.name.firstName.minLength">To pole musi mieć co najmniej {{ $v.user.name.firstName.$params.minLength.min }} znaki.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <div class="form__box">
                                        <v-input id="lastName" v-model="user.name.lastName" @input="user.name.lastName = $event" @keyup="$v.user.name.lastName.$touch()">Nazwisko</v-input>
                                        <div v-if="$v.user.name.lastName.$error">
                                            <div class="form__error" v-if="!$v.user.name.lastName.required">To pole jest wymagane.</div>
                                            <div class="form__error" v-if="!$v.user.name.lastName.minLength">To pole musi mieć co najmniej {{ $v.user.name.lastName.$params.minLength.min }} znaki.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form__box">
                                <v-input id="city" v-model="user.city" @input="user.city = $event" @keyup="$v.user.city.$touch()">Miasto</v-input>
                                <div v-if="$v.user.city.$error">
                                    <div class="form__error" v-if="!$v.user.city.required">To pole jest wymagane.</div>
                                </div>
                            </div>
                            <div class="form__box">
                                <v-input :type="'email'" :id="'email'" v-model="user.email" @input="user.email = $event" @keyup="$v.user.email.$touch()">Adres e-mail</v-input>
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
            </div>
            <div class="col-xs-12 col-sm-6">
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Ustawienia hasła</div>
                    </div>
                    <div class="box__content">
                        <form @submit.prevent="submitPassword()">
                            <div class="form__box">
                                <v-input :type="'password'" :id="'oldPassword'" v-model="form.oldPassword" @input="form.oldPassword = $event" @keyup="delayTouch($v.form.oldPassword.$touch())">Stare hasło</v-input>
                                <div v-if="$v.form.oldPassword.$error">
                                    <div class="form__error" v-if="!$v.form.oldPassword.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.oldPassword.correct">Nieprawidłowe hasło.</div>
                                </div>
                            </div>
                            <div class="form__box">
                                <v-input :type="'password'" :id="'newPassword'" v-model="form.password" @input="form.password = $event" @keyup="$v.form.password.$touch()">Nowe hasło</v-input>
                                <div v-if="$v.form.password.$error">
                                    <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.password.minLength">To pole musi mieć co najmniej {{ $v.form.password.$params.minLength.min }} znaków.</div>
                                </div>
                            </div>
                            <div class="form__box">
                                <v-input :type="'password'" :id="'newPasswordConfirm'" v-model="form.confirm" @input="form.confirm = $event" @keyup="$v.form.confirm.$touch()">Powtórz nowe hasło</v-input>
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
            <div class="col-xs-12 col-sm-12">
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Ustawienia trenerskie</div>
                    </div>
                    <div class="box__content">
                        <form @submit.prevent="submitUserData()">
                            <div class="row">
                                <div class="col-xs-12 col-sm-4">
                                    <div class="form__box">
                                        <v-select-simple :items="disciplines" label="Dyscyplina" id="discipline" :value="user.discipline" @input="user.discipline = $event"></v-select-simple>
                                        <div v-if="$v.user.discipline.$error">
                                            <div class="form__error" v-if="!$v.user.discipline.required">To pole jest wymagane.</div>
                                        </div>
                                    </div>
                                 </div>
                                <div class="col-xs-12 col-sm-4">
                                    <div class="form__box">
                                        <v-input type="number" id="hour" v-model="user.price.hour" @input="user.price.hour = $event" @keyup="$v.user.price.hour.$touch()">Cena za godzinę [PLN]</v-input>
                                        <div v-if="$v.user.price.hour.$error">
                                            <div class="form__error" v-if="!$v.user.price.hour.numeric">To pole powinno być liczbą.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4">
                                    <div class="form__box">
                                        <v-input type="number" id="month" v-model="user.price.month" @input="user.price.month = $event" @keyup="$v.user.price.month.$touch()">Cena za miesiąc [PLN]</v-input>
                                        <div v-if="$v.user.price.month.$error">
                                            <div class="form__error" v-if="!$v.user.price.month.numeric">To pole powinno być liczbą.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form__buttons">
                                <div class="spacer"></div>
                                <v-button type="submit" color="blue">Zapisz</v-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12">
                <div class="box">
                    <div class="box__title">
                        <div class="box__title-name">Opis</div>
                    </div>
                    <div class="box__content">
                        <form @submit.prevent="submitDescription()">
                            <div class="form__box">
                                <wysiwyg v-model="user.description"></wysiwyg>
                            </div>
                            <div class="form__buttons">
                                <div class="spacer"></div>
                                <v-button type="submit" color="blue">Zapisz</v-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "vue-wysiwyg/dist/vueWysiwyg.css";
    import { mapGetters, mapActions } from 'vuex';
    import { required, minLength, email, sameAs, numeric } from 'vuelidate/lib/validators'
    import { get, put, patch } from '../../helpers/api'

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
            }
        },
        computed: mapGetters(['user', 'disciplines']),
        watch: {
            'user.coach': function() {
                this.changeCoach();
            },
        },
        methods: {
            ...mapActions(['getUser', 'setSnackbar']),
            async submitUserData() {
                this.$v.user.$touch();
                if (this.$v.user.$invalid) {
                    return false;
                }
                await put(`/users/${this.user._id}`, this.user);
                this.getUser();
                this.setSnackbar({class: 'success', text: 'Zapisano pomyślnie.'});
            },
            async submitPassword() {
                this.$v.form.$touch();
                if (this.$v.form.$invalid) {
                    return false;
                }
                await patch(`/users/changePassword`, {password: this.form.password});
                this.setSnackbar({class: 'success', text: 'Zapisano pomyślnie.'});
            },
            async submitDescription() {
                await put(`/users/${this.user._id}`, {description: this.user.description});
                this.setSnackbar({class: 'success', text: 'Zapisano pomyślnie.'});
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
                city: {
                    required
                },
                discipline: {
                    required
                },
                price: {
                    hour: {
                        numeric
                    },
                    month: {
                        numeric
                    }
                }
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