<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <div class="panel-box">
                    <v-card-title>
                        <h2 class="headline">
                            Zawodnicy
                            <v-btn color="primary" @click="showPupil = true">Zaproś nowego zawodnika</v-btn>
                        </h2>
                    </v-card-title>
                    <v-data-table
                            :headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left"><a @click="$router.push({ name: 'pupil', params: {id: props.item.id, login: props.item.login} })">{{ props.item.login }}</a></td>
                            <td class="text-xs-left">{{ props.item.trainings.length }}</td>
                            <td class="text-xs-left">{{ props.item.created_at }}</td>
                            <td class="justify-center layout px-0">
                                <v-tooltip top>
                                    <v-btn icon class="mx-0" @click="deleteItem(props.item)" slot="activator">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                    <span>Odepnij zawodnika</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>
                    <pupil
                            v-if="showPupil"
                            @close="showPupil = false"
                            :user="user.user_id"
                    ></pupil>
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
    import { post, put, del } from '../../helpers/api'
    import store from './../../store'
    import Pupil from './../../components/Pupil'

    export default {
        data() {
            return {
                headers: [
                    { text: 'Login', value: 'login' },
                    { text: 'Ilość treningów', value: 'quantity' },
                    { text: 'Data dołączenia', value: 'created_at' },
                    { text: 'Akcje', sortable: false, align: 'center' },
                ],
                form: {},
                showPupil: false,
                isProcessing: false,
                isDeleting: false,
                user: Auth.state
            }
        },
        components: {
            'pupil': Pupil,
        },
        computed: {
            items() {
                return Object.keys(this.$store.state.pupils).map(key => this.$store.state.pupils[key])
            },
        },
        methods: {
            deleteItem(item) {
                this.isDeleting = true;
                this.form = item;
            },
            remove() {
                this.isProcessing = true;
                post(`/api/removePupil/${this.form.id}`)
                    .then((res) => {
                        if(res.data) {
                            store.dispatch('setSnackbar', {color: 'green', text: 'Zawodnik został odpięty.'});
                            store.dispatch('getPupils');
                            this.isDeleting = false;
                        } else {
                            store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        }
                        this.isProcessing = false;
                    })
                    .catch((err) => {
                        store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.isProcessing = false;
                    })
            },
        }
    }
</script>