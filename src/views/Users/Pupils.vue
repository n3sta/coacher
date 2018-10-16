<template>
    <div>
        <div class="box box--medium box--margin">
            <div class="box__title">
                <div class="box__title-name">Zawodnicy</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()">
                    <div class="form__box">
                        <div class="form__box-helper">
                            <v-input :type="'email'" :id="'pupil'" :value="form.email" @input="form.email = $event" @keyup="$v.form.email.$touch()">Email nowego zawodnika</v-input>
                            <div v-if="$v.form.email.$error">
                                <div class="form__error" v-if="!$v.form.email.required">To pole jest wymagane.</div>
                                <div class="form__error" v-if="!$v.form.email.email">Nieprawidłowy format e-mail.</div>
                            </div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" class="button--inline">Wyślij zaproszenie</v-button>
                    </div>
                </form>
            </div>
            <div class="box__content box__content--no-padding" v-if="pupils.length">
                <div class="list">
                    <div class="list__item" v-for="item in pupils" :key="item._id">
                        <div class="list__item-content">
                            <div class="list__avatar">{{ item.name.firstName.charAt(0) }}{{ item.name.lastName.charAt(0) }}</div>
                            <router-link :to="{name: 'pupil', params: {userId: item._id}}" class="list__name">{{ item.name.firstName }} {{ item.name.lastName }}</router-link>
                        </div>
                        <div class="list__buttons">
                            <span class="material-icons text--red" aria-hidden="true" @click="deletePupil(item._id)">delete</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Zaproszenia oczekujące</div>
            </div>
            <div class="box__content box__content--no-padding">
                <div class="list" v-if="invitations.length">
                    <div class="list__item list__item--large" v-for="item in invitations" :key="item._id">
                        <div class="list__item-content">
                            <div class="list__name text--bold">{{ item.email }}</div>
                        </div>
                        <div class="list__buttons">
                            <span class="text--red text--bold" @click="deleteInvitation(item._id)">Anuluj</span>
                            <span> lub </span>
                            <span class="text--blue text--bold">Wyślij ponownie</span>
                        </div>
                    </div>
                </div>
                <div class="blank" v-else>
                    <span>Nie znaleziono oczekujących zaproszeń</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { required, email } from 'vuelidate/lib/validators'
    import store from '../../store'
    import { get, post, del, patch } from '../../helpers/api'

    export default {
        data() {
            return {
                form: {
                    email: '',
                },
                invitations: [],
                user: store.getters.user,
                pupils: store.getters.pupils
            }
        },
        created() {
            console.log('getPupils')
            this.getInvitations();
        },
        methods: {
            async getInvitations() {
                const res = await get('/invitations', {coach: this.user._id});
                this.invitations = res.data;
            },
            async deletePupil(id) {
                await patch(`/users/${id}`, {coachId: null});
                store.dispatch('getPupils');
            },
            async deleteInvitation(id) {
                await del(`/invitations/${id}`);
                this.getInvitations();
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                await post('/invitations', {email: this.form.email, coach: this.user._id});
                this.getInvitations();
                this.form.email = '';
                this.$v.$reset();
            }
        },
        validations: {
            form: {
                email: {
                    required,
                    email
                },
            }
        }
    }
</script>