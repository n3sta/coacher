<template>
    <div>
        <div class="box box--border">
            <div class="box__title">
                <div class="box__title-name">Zawodnicy</div>
            </div>
            <div class="box__content">
                <p>Wyślij link rejestracyjny swoim zawodnikom. Po rejestracji automatycznie trafią pod Twoje skrzydła.</p>
                <p>{{ link }}</p>
            </div>
            <div v-if="!isLoading">
                <div class="box__content box__content--no-padding" v-if="pupils.length">
                    <div class="list">
                        <div class="list__item" v-for="item in pupils" :key="item._id">
                            <div class="list__item-content">
                                <div class="list__avatar">{{ item.name.firstName.charAt(0) }}{{ item.name.lastName.charAt(0) }}</div>
                                <router-link :to="{name: 'pupil', params: {_id: item._id}}" class="list__name">{{ item.name.firstName }} {{ item.name.lastName }}</router-link>
                            </div>
                            <div class="list__buttons">
                                <button class="button-icon" @click="deletePupil(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="blank" v-else>
                    <span>Nie znaleziono żadnych zawodników</span>
                </div>
            </div>
            <div class="blank" v-else>
                <v-loader></v-loader>
            </div>
        </div>
        <div class="box" v-if="newPupils.length && !isLoading">
            <div class="box__title">
                <div class="box__title-name">Czekający zawodnicy</div>
            </div>
            <div class="box__content box__content--no-padding">
                <div class="list">
                    <div class="list__item" v-for="item in newPupils" :key="item._id">
                        <div class="list__item-content">
                            <div class="list__avatar">{{ item.name.firstName.charAt(0) }}{{ item.name.lastName.charAt(0) }}</div>
                            <router-link :to="{name: 'pupil', params: {_id: item._id}}" class="list__name">{{ item.name.firstName }} {{ item.name.lastName }}</router-link>
                        </div>
                        <div class="list__buttons">
                            <div @click="accept(item._id)">
                                <v-button color="green">Przyjmij</v-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { required, email } from 'vuelidate/lib/validators';
    import { get, patch } from '../../helpers/api';

    export default {
        data() {
            return {
                isLoading: true,
                pupils: [],
                newPupils: []
            }
        },
        computed: {
            ...mapGetters(['user']),
            link() {
                return `${window.location.origin}/register?ref=${this.user._id}`;
            }
        },
        created() {
            this.getPupils();
        },
        methods: {
            ...mapActions(['setAlert', 'setSnackbar']),
            async getPupils() {
                const res = await get(`/users`, {coachId: this.user._id});
                this.pupils = res.data.filter(item => item.accepted);
                this.newPupils = res.data.filter(item => !item.accepted);
                this.isLoading = false;
            },
            async deletePupil(_id) {
                this.setAlert({
                    title: 'Czy jesteś pewien?',
                    body: 'Użytkownik przestanie być Twoim trenerem. Tej operacji nie można już cofnąć.',
                    type: 'question'
                }).then(async confirmation => {
                    if (confirmation) {
                        await patch(`/users/${_id}`, {coachId: null});
                        this.getPupils();
                   }
                })
            },
            async accept(_id) {
                await patch(`/users/${_id}`, {accepted: true});
                this.getPupils();
            },
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