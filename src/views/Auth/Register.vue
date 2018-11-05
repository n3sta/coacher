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
                                <v-input v-model="form.name.lastName" :value="form.name.lastName" :id="'lastName'" @input="form.name.lastName = $event" @keyup="$v.form.name.lastName.$touch()">Nazwisko</v-input>
                                <div v-if="$v.form.name.lastName.$error">
                                    <div class="form__error" v-if="!$v.form.name.lastName.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.form.name.lastName.minLength">To pole musi mieć co najmniej {{ $v.form.name.lastName.$params.minLength.min }} znaki</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-input :type="'email'" v-model="form.email" :value="form.email" :id="'email'" @input="form.email = $event" @keyup="delayTouch($v.form.email)">Adres e-mail</v-input>
                        <div v-if="$v.form.email.$error">
                            <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                            <div class="form__error" v-if="!$v.form.email.correct">Ten e-mail jest zajęty.</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-input :type="'password'" v-model="form.password" :value="form.password" :id="'password'" @input="form.password = $event" @keyup="$v.form.password.$touch()">Hasło</v-input>
                        <div v-if="$v.form.password.$error">
                            <div class="form__error" v-if="!$v.form.password.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.password.minLength">To pole musi mieć co najmniej {{ $v.form.password.$params.minLength.min }} znaków</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing" :loading="isProcessing">Zarejestruj</v-button>
                    </div>
                </form>
            </div>
        </div>
        <router-link :to="{name: 'login'}" class="login-link">Zaloguj się</router-link>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { required, minLength, email } from 'vuelidate/lib/validators'
    import { get, post } from '../../helpers/api'

    const touchMap = new WeakMap();

    export default {
        data() {
            return {
                form: {
                    name: {
                        firstName: 'asdsd',
                        lastName: 'dsadasd',
                    },
                    email: 'asd@dsa.pl',
                    password: 'asdasdasdasd',
                    coachId: null,
                    coach: true
                },
                isProcessing: false,
            }
        },
        created() {
            if (this.$route.query.ref) {
                this.form.coachId = this.$route.query.ref;
                this.form.coach = false;
            }            
        },
        methods: {
            ...mapActions(['setUser']),
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                try {
                    const res = await post('/auth/register', this.form);
                    this.setUser({token: res.data.token, user: res.data.user});
                    if (!this.form.coachId) {
                        localStorage.setItem('firstLogin', true);
                        this.$router.push({name: 'panel'});
                    } else {
                        this.$router.push({name: 'profiler'});
                    }
                } catch (e) {
                    this.isProcessing = false;
                }
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
                    email,
                    async correct(value) {
                        if (value === '') return true;
                        const res = await get('/auth/email', {email: value});
                        return !res.data;
                    }
                },
                password: {
                    required,
                    minLength: minLength(8)
                }
            }
        }
    }
</script>