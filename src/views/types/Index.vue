<template>
    <div>
        <div class="box">
            <div class="box__title">
                <div class="box__title-name">Typy treningów</div>
                <div @click="$router.push({name: 'createType'})">
                    <v-button type="button" :color="'blue'">Dodaj typ</v-button>
                </div>
            </div>
            <div class="box__content">
                <p>Uwaga! Wszystkie treningi z wybranym nieaktywnym typem nie zostaną wyświetlone w systemie i nie będzie możliwości dodania treningu z takim typem.</p>
            </div>
            <div v-if="!isLoading">
                <div class="box__content box__content--no-padding" v-if="types">
                    <div class="list">
                        <div class="list__item">
                            <div class="list__item-content">
                                <span class="list__name bold">Nazwa treningu</span>
                            </div>
                            <div>
                                <p class="bold">Usuń</p>
                            </div>
                        </div>
                        <div class="list__item" v-for="item in types" :key="item._id">
                            <div class="list__item-content">
                                <span class="list__name"><router-link :to="{name: 'editType', params: {_id: item._id}}">{{ item.name }}</router-link> <span v-if="item.default"> (domyślny)</span></span>
                            </div>
                            <div class="list__buttons">
                                <button v-if="!item.default" class="button-icon no-margin" @click="deleteType(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="blank" v-else>
                    <span>Nie znaleziono żadnych treningów</span>
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
                types: [],
                isLoading: true
            }
        },
        created() {
            this.getTypes();
        },
        computed: mapGetters(['user']),
        methods: {
            ...mapActions(['openAlert']),
            async getTypes() {
                const res = await get(`/types`, {user: this.user._id});
                this.types = res.data;
                this.isLoading = false;
            },
            deleteType(_id) {
                this.openAlert({
                    title: 'Czy jesteś pewny?',
                    body: 'Wszystkie treningi z przypisanym tym typem będą miały domyślny typ "Trening"',
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