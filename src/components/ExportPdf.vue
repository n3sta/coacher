<template>
    <v-layout row justify-center>
        <v-dialog v-model="isDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Exportuj plan do PDF</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-select
                                        label="Użytkownik"
                                        v-model="form.user_id"
                                        :items="pupils"
                                        item-text="login"
                                        item-value="id"
                                        v-validate="'required'"
                                        data-vv-name="type"
                                        name="type"
                                        :error-messages="errors.collect('type')"
                                        required>
                                    <template slot="item" slot-scope="data">
                                        <template>
                                            <v-list-tile-content>
                                                <v-list-tile-title v-html="data.item.login"></v-list-tile-title>
                                                <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                                            </v-list-tile-content>
                                        </template>
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-select
                                        label="Typ exportu"
                                        v-model="form.type"
                                        :items="types"
                                        item-text="name"
                                        item-value="id"
                                        v-validate="'required'"
                                        data-vv-name="type"
                                        name="type"
                                        :error-messages="errors.collect('type')"
                                        required>
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-menu
                                        ref="menuDateFrom"
                                        :close-on-content-click="false"
                                        v-model="menuDateFrom"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="40"
                                        min-width="290px"
                                        :return-value.sync="form.dateFrom"
                                        slot="activator"
                                >
                                    <v-text-field
                                            label="Data od"
                                            v-model="form.dateFrom"
                                            v-validate="'required'"
                                            data-vv-name="dateFrom"
                                            name="dateFrom"
                                            :error-messages="errors.collect('dateFrom')"
                                            slot="activator"
                                            readonly
                                            required>
                                    </v-text-field>
                                    <v-date-picker v-model="form.dateFrom" no-title scrollable locale="pl" @input="$refs.menuDateFrom.save(form.dateFrom)"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-menu
                                        ref="menuDateTo"
                                        :close-on-content-click="false"
                                        v-model="menuDateTo"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="40"
                                        min-width="290px"
                                        :return-value.sync="form.dateTo"
                                        slot="activator"
                                >
                                    <v-text-field
                                            label="Data od"
                                            v-model="form.dateTo"
                                            v-validate="'required'"
                                            data-vv-name="dateTo"
                                            name="dateTo"
                                            :error-messages="errors.collect('dateTo')"
                                            slot="activator"
                                            readonly
                                            required>
                                    </v-text-field>
                                    <v-date-picker v-model="form.dateTo" no-title scrollable locale="pl" @input="$refs.menuDateTo.save(form.dateTo)"></v-date-picker>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" flat @click="close()">Anuluj</v-btn>
                    <v-btn color="primary" :loading="isExporting" :disabled="isExporting" @click="exportPdf()">Exportuj</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import { pdf,post } from '../helpers/api'
    import store from './../store'

    export default {
        props: {
            user: {
                type: Number,
                default() {
                    return 0;
                },
            },
        },
        mounted() {
            this.isDialog = true
        },
        data() {
            return {
                form: {
                    dateFrom: '',
                    dateTo: '',
                    user_id: this.user,
                    type: null,
                },
                types: [
                    {
                        id: 0,
                        name: 'Wyślij na e-mail do zawodnika'
                    },
                    {
                        id: 1,
                        name: 'Pobierz bezpośrednio'
                    }
                ],
                isDialog: false,
                isExporting: false,
                menuDateFrom: false,
                menuDateTo: false,
            }
        },
        computed: {
            pupils() {
                let pupils = [];
                pupils.push({id: store.getters.user.userId, login: 'Mój plan treningowy', email: store.getters.user.email});
                for (let pupil of this.$store.state.pupils) {
                    pupils.push({id: pupil.id, login: pupil.login, email: pupil.email})
                }
                return pupils;
            }
        },
        methods: {
            exportPdf() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isExporting = true;
                    if (this.form.type === 0) {
                        post(`/api/exportPdf/${this.form.user_id}`, this.form)
                            .then((res) => {
                                if (res.data) {
                                    store.dispatch('setSnackbar', {color: 'green', text: 'Plan został wysłany pomyślnie.'});
                                } else {
                                    store.dispatch('setSnackbar', {color: 'red', text: 'Nie udało się wysłać planu. Spróbuj ponownie.'});
                                }
                                this.isExporting = false;
                            })
                            .catch((err) => {
                                this.isExporting = false;
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            })
                    } else {
                        pdf(`/api/exportPdf/${this.form.user_id}`, this.form)
                            .then((res) => {
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'Plan treningowy.pdf');
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                                this.isExporting = false;
                            })
                            .catch((err) => {
                                this.isExporting = false;
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            })
                    }
                });
            },
            close() {
                this.isDialog = false;
                setTimeout(() => {
                    this.$emit('close');
                }, 300)
            },
        }
    }
</script>