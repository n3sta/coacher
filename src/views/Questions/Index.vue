<template>
    <div>
        <div class="box box--medium box--margin">
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
            <div class="box__content box__content--no-padding" v-if="questions.length">
                <div class="list" id="list">
                    <div class="list__item" v-for="item in questions" :key="item._id">
                        <div class="list__item-content" :id="item._id">
                            <button type="button" class="button-icon list__item-drag"><span class="material-icons" aria-hidden="true">dehaze</span></button>
                            <a @click="$router.push({name: 'editQuestion', params: {_id: item._id}})" class="list__name">{{ item.question }} ({{ getTypeName(item.type) }})</a>
                        </div>
                        <div class="list__buttons">
                            <button class="button-icon" @click="deleteQuestion(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="blank" v-else>
                <span>Nie znaleziono żadnych pytań</span>
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
                    draggable: '.list__item',
                    handle: '.list__item-drag',
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