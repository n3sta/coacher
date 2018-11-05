<template>
    <div class="box box--medium">
        <div class="box__title">
            <div class="box__title-name">{{ title }}</div>
        </div>
        <div class="box__content">
            <form @submit.prevent="addOption()">
                <div class="form__box">
                    <v-input :id="'name'" :value="form.name" @input="form.name = $event" @keyup="$v.form.name.$touch()" ref="name">Nazwa biegu</v-input>
                    <div v-if="$v.form.name.$error">
                        <div class="form__error" v-if="!$v.form.name.required">To pole jest wymagane.</div>
                    </div>
                </div>
                <div class="form__box">
                    <v-input :id="'distance'" :value="form.distance" @input="form.distance = $event" @keyup="$v.form.distance.$touch()" ref="distance">Dystans</v-input>
                    <div v-if="$v.form.distance.$error">
                        <div class="form__error" v-if="!$v.form.distance.required">To pole jest wymagane.</div>
                        <div class="form__error" v-if="!$v.form.distance.numeric">To pole może zawierać tylko liczby.</div>
                    </div>
                </div>
                <div class="form__box">
                    <v-datepicker :value="form.date" @change="form.date = $event"></v-datepicker>
                    <label class="form__label" :data-filled="Boolean(form.date)">Data startu</label>
                    <div v-if="$v.form.date.$error">
                        <div class="form__error" v-if="!$v.form.date.required">To pole jest wymagane.</div>
                    </div>
                </div>
            </form>
        </div>
        <div class="box__content">
            <div class="form__buttons">
                <div v-if="this._id" @click="remove()">
                    <v-button type="button" color="red">Usuń</v-button>
                </div>
                <div class="spacer"></div>
                <div @click="$router.push({name: 'starts'})">
                    <v-button type="button">Anuluj</v-button>
                </div>
                <div @click="submit()">
                    <v-button type="button" color="blue">
                        <template v-if="this._id">Zaktualizuj</template>
                        <template v-else>Dodaj</template>
                    </v-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { required, minLength, numeric } from 'vuelidate/lib/validators'
    import { get, post, put, del } from '../../helpers/api';

    export default {
       props: {
            _id: {
                type: String
            },
        },
        data() {
            return {
                form: {
                    user: null,
                    name: null,
                    distance: null,
                    date: null,
                },
            }
        },
        created() {
            this.form.user = this.user._id;
            if (this._id) {
                this.getCompetition();
            }
        },
        computed: {
            ...mapGetters(['user']),
            title() {
                return (this._id) ? 'Edycja startu' : 'Dodawanie startu';
            }
        },
        methods: {
            ...mapMutations(['setSnackbar']),
            ...mapActions(['openAlert']),
            async getCompetition() {
                const res = await get(`/competitions/${this._id}`);
                this.form = res.data;
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                if (this._id) {
                    await put(`/competitions/${this._id}`, this.form);
                    this.setSnackbar({
                        class: 'success',
                        text: 'Pomyślnie edytowano start'
                    });
                } else {
                    await post('/competitions', this.form);
                    this.setSnackbar({
                        class: 'success',
                        text: 'Pomyślnie dodano start'
                    });
                }
                this.$router.push({name: 'starts'})
            },
            remove() {
                this.openAlert({
                    title: 'Jesteś tego pewien?',
                    body: 'Tej czynności nie można już cofnąć.',
                    type: 'question'
                }).then(async (confirmation) => {
                    if (confirmation) {
                        await del(`/competitions/${this._id}`);
                        this.$router.push({name: 'starts'})
                        this.setSnackbar({
                            class: 'success',
                            text: 'Pomyślnie usunięto start'
                        })
                    }
                });
            }
        },
        validations: {
            form: {
                name: {
                    required,
                    minLength: minLength(3)
                },
                distance: {
                    required,
                    numeric
                },
                date: {
                    required
                }
            }
        }
    }
</script>