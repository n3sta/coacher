<template>
    <div>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3>
                    <div class="panel-box">
                        <v-card-title>
                            <h2 class="headline">
                                Typy treningów
                                <v-btn color="primary" @click="create()">Dodaj</v-btn>
                            </h2>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="justify-center layout px-0">
                                    <v-tooltip top>
                                        <v-btn icon class="mx-0" @click="edit(props.item)" slot="activator">
                                            <v-icon color="primary">edit</v-icon>
                                        </v-btn>
                                        <span>Edytuj</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <v-btn icon class="mx-0" @click="delete(props.item)" slot="activator">
                                            <v-icon color="red">delete</v-icon>
                                        </v-btn>
                                        <span>Usuń</span>
                                    </v-tooltip>
                                </td>
                            </template>
                        </v-data-table>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
        <v-trainingType
            v-if="showTrainingType"
            @close="showTrainingType = false"
            item="item"
        />
    </div>
</template>

<script>
    import trainingType from './components/trainingType'
    import Auth from '../../helpers/auth'
    import { post, put, del } from '../../helpers/api'
    import store from '../../store'

    export default {
        data() {
            return {
                headers: [
                    { text: 'Rodzaj treningu', value: 'name' },
                    { text: 'Akcje', sortable: false, align: 'center' },
                ],
                isDeleting: false,
                showTrainingType: false,
                item: {
                    id: 0,
                    name: ''
                }
            }
        },
        components: {
            'v-trainingType': trainingType
        },
        computed: {
            items() {
              return Object.keys(store.state.trainingTypes).map(key => store.state.trainingTypes[key])
            }
        },
        methods: {
            edit(item) {
                this.showTrainingType = true;
                Object.assign(this.item, item);
            },
            delete(item) {
                this.isDeleting = true;
                Object.assign(this.item, item);
            },
            remove() {
                store.dispatch('openAlert', {
                    title: 'Czy jesteś pewny?',
                    body: 'Tej czynności nie można cofnąć!'
                }).then(confirmation => {
                    if (confirmation) {
                        del(`/trainingTypes/${this.id}`).then((res) => {
                            store.dispatch('setSnackbar', {color: 'green', text: 'Typ treningu został usunięty.'});
                            store.dispatch('getTrainingTypes');
                            this.isDeleting = false;
                        })
                    }
                });
            
            },
        }
    }
</script>