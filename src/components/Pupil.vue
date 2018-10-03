<template>
    <v-layout row justify-center>
        <v-dialog v-model="isDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Zaproś zawodnika</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                        label="Adres e-mail"
                                        v-model="form.email"
                                        v-validate="'required|email'"
                                        data-vv-name="email"
                                        :error-messages="errors.collect('email')"
                                        required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" flat @click="close()">Anuluj</v-btn>
                    <v-btn color="primary" :loading="isSending" :disabled="isSending" @click="send()">Zaproś</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import { get,post } from '../helpers/api'
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
        data() {
            return {
                form: {
                    email: '',
                    user_id: this.user
                },
                isDialog: false,
                isSending: false
            }
        },
        mounted() {
              this.isDialog = true;
        },
        methods: {
            send() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isSending = true;
                    post(`/api/sendInvitation`, this.form)
                        .then((res) => {
                            if (res.data.status) {
                                this.$emit('closePupil');
                                store.dispatch('setSnackbar', {color: 'green', text: 'Zawodnik otrzymał zaproszenie.'});
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Bład. Zaproszenie nie zostało wysłane'});
                            }
                            this.isSending = false;
                        })
                        .catch((err) => {
                            this.isSending = false;
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        })
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