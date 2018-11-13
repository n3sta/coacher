<template>
    <div>
        <div class="box">
            <div class="box__title">
                <div class="box__title-name">Pytania do ankiety</div>
                <div @click="$router.push({name: 'addQuestion'})">
                    <v-button type="button" :color="'blue'">Dodaj pytanie</v-button>
                </div>
                <div class="box__title-button-margin" @click="$router.push({name: 'profiler'})" v-if="questions.length">
                    <v-button type="button" :color="'blue'">Przetestuj ankietę</v-button>
                </div>
            </div>
            <div class="box__content">
                <p>Ułóż pytania do ankiety. Rejestrujący się zawodnik odpowie na Twoje pytania dzięki czemu uzyskasz na jego temat istotne informacje. Przeciągając za <span class="material-icons" aria-hidden="true" style="position: relative; top: 7px; line-height: 0;">dehaze</span> możesz zmieniać kolejność pytań.</p>
            </div>
            <div class="box__content box__content--no-padding">
                <table class="table" v-if="questions.length">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody id="list">
                        <tr v-for="item in questions" :key="item._id" class="tr__item">
                            <td>                            
                                <button type="button" class="button-icon tr__item-drag"><span class="material-icons" aria-hidden="true">dehaze</span></button>
                            </td>
                            <td>
                                <router-link :to="{name: 'editQuestion', params: {_id: item._id}}" class="list__name">{{ item.question }}</router-link>
                            </td>
                            <td>{{ getTypeName(item.type) }}</td>
                            <td>
                                <button class="button-icon" @click="deleteQuestion(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="blank">
                    <span>Nie znaleziono dodanych pytań.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { get, put, del } from '../../helpers/api'
    import Sortable from 'sortablejs'

    export default {
        data() {
            return {
                headers: ['Pozycja', 'Pytanie', 'Typ', 'Usuń'],
                questions: [0],
                old: null
            }
        },
        computed: mapGetters(['user', 'types']),
        created() {
            this.getData();
        },
        mounted() {
            this.$nextTick(() => {
                new Sortable(document.getElementById('list'), {
                    draggable: '.tr__item',
                    handle: '.tr__item-drag',
                    onEnd: this.reorder,
                    onStart: this.startOrder
                });
            });
        },
        methods: {
            async reorder({ newIndex }) {
                const newQ = this.questions[newIndex]._id;
                await put(`/questions/change/reorder`, {old: this.old, new: newQ});
            },
            async getData() {
                const res = await get(`/questions`, {user: this.user._id});
                this.questions = res.data;
            },
            async deleteQuestion(_id) {
                await del(`/questions/${_id}`);
                this.getData();
            },
            startOrder({ oldIndex }) {
                this.old = this.questions[oldIndex]._id;
            },
            getTypeName(typeId) {
                const type = this.types.filter(type => type._id === typeId)[0];
                return (type) ? type.name : '';
            },
        }
    }
</script>