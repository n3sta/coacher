<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <div class="panel-box">
                    <v-card-title>
                        <h2 class="headline">
                            Profiler zawodników
                            <v-btn color="primary" @click="create()">Dodaj pytanie</v-btn>
                            <v-btn color="primary" @click="$router.push({name: 'profiler'})">Wypełnij ankiete</v-btn>
                        </h2>
                    </v-card-title>
                    <v-data-table
                            :headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <tr :key="props.item.id" :id="props.item.id">
                                <td class="text-xs-left">
                                    <v-tooltip top>
                                        <v-btn style="cursor: move" icon class="sortHandle mx-0" slot="activator">
                                            <v-icon>drag_handle</v-icon>
                                        </v-btn>
                                        <span>Przeciągnij i upuść</span>
                                    </v-tooltip>
                                </td>
                                <td class="text-xs-left">{{ props.item.question }}</td>
                                <td class="text-xs-left">{{ findOption(props.item.type_input) }}</td>
                                <td class="justify-center layout px-0">
                                    <v-tooltip top>
                                        <v-btn icon class="mx-0" @click="editItem(props.item.id)" slot="activator">
                                            <v-icon color="primary">edit</v-icon>
                                        </v-btn>
                                        <span>Edytuj</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <v-btn icon class="mx-0" @click="deleteItem(props.item)" slot="activator">
                                            <v-icon color="red">delete</v-icon>
                                        </v-btn>
                                        <span>Usuń pytanie</span>
                                    </v-tooltip>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="isForm" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <h3 class="headline">{{ formTitle }}</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field
                                                    label="Pytanie"
                                                    v-model="form.question"
                                                    v-validate="'required|min:3'"
                                                    :error-messages="errors.collect('question')"
                                                    data-vv-name="question"
                                                    required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-select
                                                    :items="options"
                                                    v-model="form.type_input"
                                                    label="Typ treningu"
                                                    item-value="id"
                                                    item-text="name"
                                                    v-validate="'required'"
                                                    data-vv-name="type_input"
                                                    :error-messages="errors.collect('type_input')"
                                                    required
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 v-if="form.type_input === 6">
                                            <v-text-field
                                                    label="Wypisz pozycje listy rozwijalnej po średniku (bez spacji)"
                                                    v-model="form.select_options"
                                                    v-validate="{required: form.input_type === 6}"
                                                    :error-messages="errors.collect('select_options')"
                                                    data-vv-name="select_options"
                                                    required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-checkbox
                                                    label="Wymagane"
                                                    v-model="form.required"
                                                    true-value="1"
                                            ></v-checkbox>
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
                    <v-dialog v-model="isDeleting" max-width="300">
                        <v-card>
                            <v-card-title class="headline">Jesteś pewny?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="grey darken-3" flat @click="isDeleting = false">Anuluj</v-btn>
                                <v-btn color="red" :loading="isProcessing" :disabled="isProcessing" class="white--text" @click="remove()">Tak, usuń</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Auth from '../../helpers/auth'
    import { get, post, put, del } from '../../helpers/api'
    import store from './../../store'
    import Sortable from 'sortablejs'

    export default {
        data() {
            return {
                headers: [
                    { text: 'Pozycja', sortable: false },
                    { text: 'Pytanie', sortable: false, value: 'question' },
                    { text: 'Typ pola', sortable: false, value: 'input_type'},
                    { text: 'Akcje', sortable: false, align: 'center' }
                ],
                form: {
                    order: 0
                },
                isProcessing: false,
                isForm: false,
                isDeleting: false,
                edit: null,
                user: Auth.state,
                items: [],
                options: [
                    {
                        id: 1,
                        name: 'Pole tekstowe'
                    },
                    {
                        id: 2,
                        name: 'Długie pole tekstowe'
                    },
                    {
                        id: 3,
                        name: 'Liczba'
                    },
                    {
                        id: 4,
                        name: 'Data'
                    },
                    {
                        id: 5,
                        name: 'Checkbox'
                    },
                    {
                        id: 6,
                        name: 'Lista rozwijalna'
                    }
                ]
            }
        },
        computed: {
            formTitle() {
                return (this.edit) ? 'Edycja pytania' : 'Dodawanie pytania';
            }
        },
        created() {
            this.getData();
        },
        mounted() {
            new Sortable(document.getElementsByTagName('tbody')[0], {
                    draggable: 'tr',
                    handle: '.sortHandle',
                    onEnd: this.reorder
                }
            )
        },
        methods: {
            reorder({oldIndex, newIndex}) {
                post(`/api/questions/changeOrder`, {
                    oldIndex: oldIndex + 1,
                    newIndex: newIndex + 1
                })
            },
            findOption(id) {
                return this.options.find(option => option.id === id).name;
            },
            getData() {
                get(`/api/questions/${this.user.user_id}`)
                    .then((res) => {
                        if(res.data) {
                            this.items = res.data;
                        }
                    })
            },
            create() {
                this.isForm = true;
                this.edit = false;
                this.form = {
                    user_id: Auth.state.user_id,
                    question: '',
                    order: null,
                    required: 0,
                }
            },
            editItem(id) {
                get(`/api/questions/${id}/edit`)
                    .then((res) => {
                        if(res.data) {
                            this.form = res.data;
                            this.isForm = true;
                            this.edit = true;
                        }
                    })
            },
            deleteItem(item) {
                this.isDeleting = true;
                this.form = item;
            },
            save() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isProcessing = true;
                    post(`/api/questions`, this.form)
                        .then((res) => {
                            if(res.data) {
                                store.dispatch('setSnackbar', {color: 'green', text: 'Pytanie zostało dodane.'});
                                this.isForm = false;
                                this.getData();
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            }
                            this.isProcessing = false;
                        })
                        .catch(() => {
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            this.isProcessing = false;
                        })
                });
            },
            remove() {
                this.isProcessing = true;
                del(`/api/questions/${this.form.id}`)
                    .then((res) => {
                        if(res.data) {
                            store.dispatch('setSnackbar', {color: 'green', text: 'Pytanie zostało usunięte.'});
                            this.isDeleting = false;
                            this.getData();
                        } else {
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        }
                        this.isProcessing = false;
                    })
                    .catch(() => {
                        store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.isProcessing = false;
                    })
            },
            update() {
                this.$validator.validateAll().then((result) => {
                    if (!result) {
                        return false
                    }
                    this.isProcessing = true;
                    put(`/api/questions/${this.form.id}`, this.form)
                        .then((res) => {
                            if(res.data) {
                                store.dispatch('setSnackbar', {color: 'green', text: 'Pytanie zostało zaktualizowane.'});
                                this.isForm = false;
                                this.getData();
                            } else {
                                store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            }
                            this.isProcessing = false;
                        })
                        .catch(() => {
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                            this.isProcessing = false;
                        })
                });
            },
        }
    }
</script>