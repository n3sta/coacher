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
                            <v-select :items="trainingTypes" :label="'Typ treningu'" :id="'trainingType'" @change="training.trainingType = id"></v-select>
                        </div>
                        <div class="form__box col-sm-6 col-xs-12">
                            <label class="form__label" for="amount">Suma kilometrów</label>
                            <input type="number" class="form__input" id="amount" v-model="training.amount" min="0">
                        </div>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="content">Przebieg treningu</label>
                        <textarea class="form__textarea" v-model="training.content" id="content" rows="3"></textarea>
                    </div>
                    <div class="form__box">
                        <label class="form__label" for="note">Komentarz</label>
                        <textarea class="form__textarea" v-model="training.note" id="note" rows="3"></textarea>
                    </div>
                    <div class="form__box">
                        <v-checkbox :id="'done'" :checked="training.done" @change="training.done = checked" :disabled="canBeDone()">Wykonany</v-checkbox>
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
    import moment from 'moment';
    import { get,post,del,put } from './../helpers/api'
    import store from './../store'
    import select from './Select';
    import button from './Button';
    import checkbox from './Checkbox';

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
                    done: '',
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
                console.log(this.$router);
                this.$router.go(-1);
            },
            canBeDone() {
                const today = moment();
                const trainingDate = moment(this.training.createdAt);
                return trainingDate >= today;
            }
        }
    }
</script>

<style>
    .card__title {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
    .card__title .input-group {
        padding-top: 0;
    }
    .card__title .input-group__details {
        display: none;
    }
    .card__title input {
        font-size: 24px!important;
        font-weight: 400;
        line-height: 32px!important;
        letter-spacing: normal!important;
    }
</style>