<template>
    <v-layout row justify-center>
        <v-dialog content-class="mobileFull" v-model="isDialog" persistent max-width="500px">
            <div v-show="isLoading">
                <v-card style="display: flex; min-height: 300px">
                    <v-container fluid fill-height>
                        <v-layout justify-center align-center>
                            <v-progress-circular
                                    indeterminate
                                    :size="45"
                                    color="primary"
                            ></v-progress-circular>
                        </v-layout>
                    </v-container>
                </v-card>
            </div>
            <v-card v-show="!isLoading">
                <v-card-title>
                    <h2 class="headline headline--nowrap">{{ action }} </h2>
                        <v-menu
                                ref="menu"
                                :close-on-content-click="false"
                                v-model="menu"
                                :nudge-right="40"
                                min-width="290px"
                                :return-value.sync="training.createdAt">
                            <v-text-field
                                    class="dateInput"
                                    slot="activator"
                                    v-model="training.createdAt"
                                    readonly></v-text-field>
                            <v-date-picker v-model="training.createdAt"
                                           no-title
                                           scrollable
                                           locale="pl">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="menu = false">Anuluj</v-btn>
                                <v-btn color="primary" @click="$refs.menu.save(training.createdAt)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md class="no-padding">
                        <v-layout wrap>
                            <v-flex xs12 sm6>
                                <v-select
                                        :items="trainingTypes"
                                        v-model="training.trainingType"
                                        label="Typ treningu"
                                        item-value="_id"
                                        item-text="name"
                                        v-validate="'required'"
                                        data-vv-name="trainingType"
                                        :error-messages="errors.collect('trainingType')"
                                        required
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        type="number"
                                        label="Suma kilometrów"
                                        data-vv-name="amount"
                                        :error-messages="errors.collect('amount')"
                                        v-model.number="training.amount"
                                        v-validate="'required|decimal|max_value:999|min_value:0'"
                                        min="0"
                                        max="999"
                                        required>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                        label="Przebieg treningu"
                                        rows="1"
                                        data-vv-name="content"
                                        :error-messages="errors.collect('content')"
                                        auto-grow
                                        v-model="training.content"
                                        v-validate="'required'"
                                        required>
                                </v-textarea>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                        label="Komentarz"
                                        rows="1"
                                        auto-grow
                                        v-model="training.note">
                                </v-textarea>
                            </v-flex>
                            <v-flex xs12 v-if="canDone">
                                <v-checkbox
                                        true-value="1"
                                        label="Wykonany"
                                        :disabled="canBeDone()"
                                        v-model="training.done"
                                        persistent-hint
                                        :hint="(canBeDone()) ? 'Tylko treningi z datą dzisiejszą lub wcześniejszą' : ''">
                                </v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red"  flat v-if="training._id" @click="remove()">Usuń</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-3" flat @click="close()">Anuluj</v-btn>
                    <v-btn v-if="!_id" color="primary" :loading="isSubmitting" :disabled="isSubmitting"  @click="save()">Dodaj</v-btn>
                    <v-btn v-else color="primary" :loading="isSubmitting" :disabled="isSubmitting"  @click="update()">Zaktualizuj</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import moment from 'moment';
    import { get,post,del,put } from './../helpers/api'
    import store from './../store'

    export default {
        props: {
            _id: {
                type: String
            },
            user: {
                type: String
            },
            date: {
                type: String,
            },
            canDone: {
                type: Boolean
            }
        },
        data() {
            return {
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                isSubmitting: false,
                isLoading: true,
                isDialog: false,
                menu: false,
                trainingTypes: [],
                training: {
                    content: '',
                    note: '',
                    amount: '',
                    done: '',
                    user: this.user,
                    trainingType: '',
                    createdAt: this.date
                }
            }
        },
        computed: {
            action() {
                return (this._id) ? 'Edycja treningu' : 'Dodawanie treningu';
            }
        },
        created() {
            (this._id) ? this.getTraining() : this.isLoading = false;
            this.getTrainingTypes();
        },
        mounted() {
            this.isDialog = true;
        },
        methods: {
            getTrainingTypes() {
                get(`/trainingTypes`, {user: this.user})
                    .then((res) => {
                        this.trainingTypes = res.data;
                    });
            },
            getTraining() {
                get(`/trainings/${this._id}`)
                    .then((res) => {
                        this.training = res.data;
                        this.isLoading = false;
                    });
            },
            save() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isSubmitting = true;
                    this.training.createdAt = new Date(this.training.createdAt);
                    post(`/trainings`, this.training)
                        .then((res) => {
                            this.close();
                            this.$emit('getEvents');
                            store.dispatch('setSnackbar', {color: 'green', text: 'Trening został dodany'});
                        })
                        .catch((err) => {
                            this.isSubmitting = false;
                        })
                });
            },
            update() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isSubmitting = true;
                    put(`/trainings/${this._id}`, this.training)
                        .then((res) => {
                            this.close();
                            this.$emit('getEvents');
                            store.dispatch('setSnackbar', {color: 'green', text: 'Trening został zaktualizowany'});
                        })
                        .catch(() => {
                            this.isSubmitting = false;
                        })
                });
            },
            remove() {
                del(`/trainings/${this._id}`,)
                    .then((res) => {
                        this.close();
                        this.$emit('getEvents');
                        store.dispatch('setSnackbar', {color: 'green', text: 'Trening został usunięty'});
                    })
            },
            close() {
                this.isDialog = false;
                setTimeout(() => {
                    this.$emit('close');
                }, 300);
            },
            canBeDone() {
                const today = moment();
                const trainingDate = moment(this.training.createdAt);
                return 0;
                return !!(trainingDate >= today);
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