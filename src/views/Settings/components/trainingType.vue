<template>
    <v-dialog v-model="isDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <h3 class="headline">{{ formTitle }}</h3>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                label="Rodzaj treningu"
                                v-model="name">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-3" flat @click="isForm = false">Anuluj</v-btn>
                <v-btn color="primary" :loading="isProcessing" :disabled="isProcessing" v-if="edit" @click="update()">Aktualizuj</v-btn>
                <v-btn color="primary" :loading="isProcessing" :disabled="isProcessing" v-if="!edit" @click="save()">Dodaj</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            id: {
                type: Number,
                default: 0
            },
            name: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                isDialog: false,
                isProcessing: false,
            }
        },
        computed: {
            formTitle() {
                return (this.edit) ? 'Edycja rodzaju treningu' : 'Dodawanie rodzaju treningu';
            }
        },
        methods: {
            save() {
                this.isProcessing = true;
                    post('/trainingTypes', {name: this.name})
                        .then((res) => {
                            if (res.data) {
                                store.dispatch('setSnackbar', {color: 'green', text: 'Rodzaj treningu został dodany.'});
                                store.dispatch('getTrainingTypes');
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            }
                            this.close();
                        })
                        .catch((err) => {
                            this.isProcessing = false;
                        })
            },
            update() {
                this.isProcessing = true;
                    put(`/trainingTypes/${this.id}`, {name: this.name})
                        .then((res) => {
                            if(res.data) {
                                store.dispatch('setSnackbar', {color: 'green', text: 'Rodzaj treningu został zmieniony.'});
                                store.dispatch('getTrainingTypes');
                                this.isForm = false;
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            }
                            this.close();
                        })
                        .catch((err) => {
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            this.isProcessing = false;
                        })
            },
            close() {
                this.isDialog = false;
                this.isProcessing = false;
                setTimeout(() => {
                    this.$emit('close');
                }, 300);
            },
        }
    }
</script>