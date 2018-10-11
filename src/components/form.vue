<template>
    <div>
        <form class="form" @submit.prevent="submit()">
            <div class="box box--medium">
                <div class="box__title">
                    <span class="box__title-name">{{ action }}</span>
                </div>
                <div class="box__content">
                    <div class="row">
                        <div class="form__box col-sm-6 col-xs-12">
                            <v-select :items="trainingTypes" :label="'Typ treningu'" :id="'trainingType'" :value="training.trainingType" @change="training.trainingType = $event"></v-select>
                            <div v-if="$v.training.trainingType.$error">
                                <div class="form__error" v-if="!$v.training.trainingType.required">To pole jest wymagane.</div>
                            </div>
                        </div>
                        <div class="form__box col-sm-6 col-xs-12">
                            <label class="form__label" for="amount">Suma kilometrów</label>
                            <input type="number" class="form__input" id="amount" v-model="training.amount" min="0" :max="$v.training.amount.$params.maxValue" @input="$v.training.amount.$touch()">
                            <div v-if="$v.training.amount.$error">
                                <div class="form__error" v-if="!$v.training.amount.required">To pole jest wymagane.</div>
                                <div class="form__error" v-if="!$v.training.amount.numeric">To pole może zawierać tylko liczby.</div>
                                <div class="form__error" v-if="!$v.training.amount.maxValue">Maksymalna możliwa liczba wynosi 256</div>
                            </div>
                        </div>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="content">Przebieg treningu</label>
                        <textarea class="form__textarea" v-model="training.content" id="content" rows="3"></textarea>
                        <div v-if="$v.training.content.$error">
                            <div class="form__error" v-if="!$v.training.content.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.training.content.minLength">To pole musi mieć co najmniej {{ $v.training.content.$params.minLength.min }} znaki</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="note">Komentarz</label>
                        <textarea class="form__textarea" v-model="training.note" id="note" rows="3"></textarea>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="note">Data treningu</label>
                        <v-datepicker :value="training.createdAt" @change="training.createdAt = $event"></v-datepicker>
                        <div v-if="$v.training.createdAt.$error">
                            <div class="form__error" v-if="!$v.training.createdAt.required">To pole jest wymagane.</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-checkbox :id="'done'" :checked="training.done" @change="training.done = $event" :disabled="!canBeDone()">Wykonany</v-checkbox>
                        <div class="hint" v-if="!canBeDone()">Jako wykonane można oznaczyć tylko treningi z datą dzisiejszą i wcześniejszą.</div>
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
    import { required, minLength, numeric, maxValue, date } from 'vuelidate/lib/validators'
    import moment from 'moment';
    import { get,post,del,put } from './../helpers/api'
    import store from './../store'
    import select from './Select';
    import button from './Button';
    import checkbox from './Checkbox';
    import Datepicker from './Datepicker';

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
                }
            }
        },
        components: {
            'v-select': select,
            'v-button': button,
            'v-checkbox': checkbox,
            'v-datepicker': Datepicker,
        },
        watch: {
            'training.createdAt': function() {
                if (this.canBeDone()) {
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
                            store.dispatch('setSnackbar', {color: 'green', text: 'Trening został zaktualizowany'});
                            this.back();
                        })
                        .catch(() => {
                            this.isSubmitting = false;
                        })
                } else {
                    post(`/trainings`, this.training)
                        .then(() => {
                            store.dispatch('setSnackbar', {color: 'green', text: 'Trening został dodany'});
                            this.back();
                        })
                        .catch(() => {
                            this.isSubmitting = false;
                        })
                }
            },
            remove() {
                del(`/trainings/${this.id}`)
                    .then(() => {
                        store.dispatch('setSnackbar', {color: 'green', text: 'Trening został usunięty'});
                        this.back();
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
                    minLength: minLength(3)
                },
                createdAt: {
                    required
                }
            }
        }
    }
</script>