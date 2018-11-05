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
                        <v-button type="button" :color="'red'" v-if="_id" @click.native="remove()">Usuń</v-button>
                        <div class="spacer"></div>
                        <div @click="back()">
                            <v-button type="button" :color="'white'">Anuluj</v-button>
                        </div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing" :loading="isProcessing">
                            <template v-if="_id">Zaktualizuj</template>
                            <template v-else>Dodaj</template>
                        </v-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { required, minLength, numeric, maxValue } from 'vuelidate/lib/validators'
    import moment from 'moment';
    import { get,post,del,put } from '../../helpers/api'

    export default {
        props: {
            canDone: {
                type: Boolean
            },
            _id: {
                type: String
            }
        },
        data() {
            return {
                isProcessing: false,
                trainingTypes: [],
                training: {
                    user: this.$route.params.user,
                    trainingType: '',
                    content: '',
                    note: '',
                    amount: '',
                    done: false,
                    createdAt: this.$route.params.createdAt
                }
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
            ...mapGetters(['user']),
            action() {
                return (this._id) ? 'Edycja treningu' : 'Dodawanie treningu';
            }
        },
        created() {
            this.getTrainingTypes();
            if (this._id) {
                this.getTraining();
            }
        },
        methods: {
            ...mapMutations(['setSnackbar']),
            ...mapActions(['openAlert']),
            async getTrainingTypes() {
                const user = (this.user.coach) ? this.user._id : this.user.coachId;
                const res = await get(`/trainingTypes`, {user: user, active: true});
                this.trainingTypes = res.data;
                if (!res.data.length) {
                    this.openAlert({
                    title: 'Brak aktywnych typów treningów!',
                    body: 'Zostaniesz przeniesiony na wiodok ustawień treningów. Przynajmniej jeden musi być aktywny.',
                    type: 'statement'
                    }).then(async (confirmation) => {
                        if (confirmation) {
                            this.$router.push({name: 'trainingTypes'});
                        }
                    })
                }
            },
            async getTraining() {
                const res = await get(`/trainings/${this._id}`);
                this.training = res.data;
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isSubmitting = true;
                if (this._id) {
                    try {
                        await put(`/trainings/${this._id}`, this.training)
                        this.setSnackbar({class: 'success', text: 'Trening został zaktualizowany'});
                        this.back();
                    } catch(e) {
                        this.isSubmitting = false;
                    }
                } else {
                    try {
                        await post(`/trainings`, this.training);
                        this.setSnackbar({class: 'success', text: 'Trening został dodany'});
                        this.back();
                    } catch(e) {
                        this.isSubmitting = false;
                    }
                }
            },
            remove() {
                this.openAlert({
                    title: 'Czy jesteś pewny?',
                    body: 'Usuniętego treningu nie można już przywrócić.',
                    type: 'question'
                }).then(async (confirmation) => {
                    if (confirmation) {
                        await del(`/trainings/${this._id}`)
                        this.setSnackbar({class: 'success', text: 'Trening został usunięty'});
                        this.back();
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
                    minLength: minLength(3)
                },
                createdAt: {
                    required
                }
            }
        }
    }
</script>