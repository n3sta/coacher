<template>
    <div>
        <div class="box">
            <div class="box__title">
                <div class="box__title-name">Typy treningów</div>
                <div @click="$router.push({name: 'createType'})">
                    <v-button type="button" :color="'blue'">Dodaj typ</v-button>
                </div>
            </div>
            <div v-if="!isLoading">
                <div class="box__content box__content--no-padding">
                    <table class="table" v-if="types.length">
                        <thead>
                            <tr>
                                <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in types" :key="item._id">
                                <td>
                                    <router-link :to="{name: 'editType', params: {_id: item._id}}">{{ item.name }} </router-link><span v-if="item.default">(domyślny)</span>                            
                                </td>
                                <td>
                                    <button v-if="!item.default" class="button-icon no-margin" @click="deleteType(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="blank">
                        <span>Nie znaleziono żadnych treningów.</span>
                    </div>
                </div>
            </div>
            <div class="blank" v-else>
                <v-loader></v-loader>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { get, put, del } from '../../helpers/api'

    export default {
        data() {
            return {
                form: {
                    name: ''
                },
                headers: ['Nazwa treningu', 'Usuń'],
                types: [],
                isLoading: true
            }
        },
        created() {
            this.getTypes();
        },
        computed: mapGetters(['user']),
        methods: {
            ...mapActions(['setAlert']),
            async getTypes() {
                const res = await get(`/types`, {user: this.user._id});
                this.types = res.data;
                this.isLoading = false;
            },
            deleteType(_id) {
                this.setAlert({
                    title: 'Czy jesteś pewny?',
                    body: 'Wszystkie treningi z przypisanym tym typem otrzymają domyślny typ',
                    type: 'question'
                }).then(async (confirmation) => {
                    if (confirmation) {
                        await del(`/types/${_id}`);
                        this.getTypes();
                    }
                })
            }
        }
    }
</script>