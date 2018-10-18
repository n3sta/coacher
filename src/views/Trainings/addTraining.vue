<template>
    <div>
        <form class="form" @submit.prevent="submit()">
            <div class="box box--medium">
                <div class="box__title">
                    <span class="box__title-name">{{ action }}</span>
                </div>
                <div class="box__content">
                    <div class="row">
                        <div class="col-sm-6 col-xs-12">
                            <div class="form__box">
                                <v-select :items="trainingTypes" :label="'Typ treningu'" :id="'trainingType'" :value="training.trainingType" @change="training.trainingType = $event"></v-select>
                                <div v-if="$v.training.trainingType.$error">
                                    <div class="form__error" v-if="!$v.training.trainingType.required">To pole jest wymagane.</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <div class="form__box">
                                <v-input :type="'number'" :for="'amount'" v-model="training.amount" :value="training.amount" @change="training.amount = $event" @input="$v.training.amount.$touch()">Suma kilometrów</v-input>
                                <div v-if="$v.training.amount.$error">
                                    <div class="form__error" v-if="!$v.training.amount.required">To pole jest wymagane.</div>
                                    <div class="form__error" v-if="!$v.training.amount.numeric">To pole może zawierać tylko liczby.</div>
                                    <div class="form__error" v-if="!$v.training.amount.maxValue">Maksymalna możliwa liczba wynosi 256</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-textarea :value="training.content" :id="'content'" @input="training.content = $event" @keyup="$v.training.content.$touch()">Przebieg treningu</v-textarea>
                        <div v-if="$v.training.content.$error">
                            <div class="form__error" v-if="!$v.training.content.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.training.content.minLength">To pole musi mieć co najmniej {{ $v.training.content.$params.minLength.min }} znaki</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-textarea :value="training.note" :id="'note'" @input="training.note = $event">Komentarz</v-textarea>
                    </div>
                    <div class="form__box">
                        <v-datepicker :value="training.createdAt" @change="training.createdAt = $event"></v-datepicker>
                        <label class="form__label" :data-filled="Boolean(training.createdAt)">Data treningu</label>
                        <div v-if="$v.training.createdAt.$error">
                            <div class="form__error" v-if="!$v.training.createdAt.required">To pole jest wymagane.</div>
                        </div>
                    </div>
                    <div class="form__box" v-if="user._id === training.user">
                        <v-checkbox :id="'done'" :checked="training.done" @change="training.done = $event" :disabled="training.createdAt && !canBeDone()">Wykonany</v-checkbox>
                        <div class="hint" v-if="training.createdAt && !canBeDone()">Jako wykonane można oznaczyć tylko treningi z datą dzisiejszą i wcześniejszą.</div>
                    </div>
                    <div class="form__buttons">
                        <v-button type="button" :color="'red'" v-if="id" @click.native="remove()">Usuń</v-button>
                        <div class="spacer"></div>
                        <div @click="back()">
                            <v-button type="button" :color="'white'">Anuluj</v-button>
                        </div>
                        <v-button type="submit" :color="'blue'" v-if="!id" :loading="isSubmitting" :disabled="isSubmitting">Dodaj</v-button>
                        <v-button type="submit" :color="'blue'" v-else :loading="isSubmitting" :disabled="isSubmitting">Zaktualizuj</v-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { required, minLength, numeric, maxValue } from 'vuelidate/lib/validators'
    import moment from 'moment';
    import { get,post,del,put } from '../../helpers/api'
    import store from '../../store'

    export default {
        props: {
            canDone: {
                type: Boolean
            }
        },
        data() {
            return {
                id: store.getters.trainingData._id,
                isSubmitting: false,
                trainingTypes: [],
                training: {
                    content: '',
                    note: '',
                    amount: '',
                    done: false,
                    user: store.getters.trainingData.userId,
                    trainingType: '',
                    createdAt: store.getters.trainingData.createdAt
                },
                user: store.getters.user,
            }
        },
        watch: {
            'training.createdAt': function() {
                if (this.training.createdAt && !this.canBeDone()) {
                    this.training.done = false;
                }
            },
        },
        computed: {
            action() {
                return (this.id) ? 'Edycja treningu' : 'Dodawanie treningu';
            }
        },
        created() {
            this.getTrainingTypes();
            if (this.id) {
                this.getTraining();
            }
        },
        methods: {
            getTrainingTypes() {
                get(`/trainingTypes`, {user: this.user})
                    .then((res) => {
                        this.trainingTypes = res.data;
                    });
            },
            getTraining() {
                get(`/trainings/${this.id}`)
                    .then((res) => {
                        this.training = res.data;
                    });
            },
            submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isSubmitting = true;
                if (this.id) {
                    put(`/trainings/${this.id}`, this.training)
                        .then(() => {
                            store.commit('setSnackbar', {class: 'success', text: 'Trening został zaktualizowany'});
                            this.back();
                        })
                        .catch(() => {
                            this.isSubmitting = false;
                        })
                } else {
                    post(`/trainings`, this.training)
                        .then(() => {
                            store.commit('setSnackbar', {class: 'success', text: 'Trening został dodany'});
                            this.back();
                        })
                        .catch(() => {
                            this.isSubmitting = false;
                        })
                }
            },
            remove() {
                store.dispatch('openAlert', {
                    title: 'Czy jesteś pewny?',
                    body: 'Usuniętego treningu nie można już przywrócić.'
                }).then(confirmation => {
                    if (confirmation) {
                        del(`/trainings/${this.id}`).then(() => {
                            store.commit('setSnackbar', {class: 'success', text: 'Trening został usunięty'});
                            this.back();
                        })
                    }
                })
            },
            back() {
                this.$router.go(-1);
            },
            canBeDone() {
                const today = moment().format('YYYY-MM-DD');
                const trainingDate = moment(this.training.createdAt).format('YYYY-MM-DD');
                return trainingDate <= today;
            }
        },
        validations: {
            training: {
                trainingType: {
                    required
                },
                amount: {
                    required,
                    numeric,
                    maxValue: maxValue(256)
                },
                content: {
                    required,
                },
                createdAt: {
                    required
                }
            }
        }
    }
</script>