<template>
    <div>
        <form class="form" @submit.prevent="submit()">
            <div class="box box--medium">
                <div class="box__title">
                    <span class="box__title-name">{{ action }}</span>
                </div>
                <div class="box__content">
                    <div class="form__box">
                        <label class="form__label" for="name">Pytanie</label>
                        <input type="text" class="form__input" v-model="form.question" id="name">
                    </div>
                    <div class="form__box">
                        <v-select :items="types" :label="'Typ pola'" :id="'type'" :value="form.type" @change="form.type = $event"></v-select>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <div @click="back()">
                            <v-button type="button" :color="'white'">Anuluj</v-button>
                        </div>
                        <v-button type="submit" :color="'blue'">Dodaj</v-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import moment from 'moment';
    import { get,post,del,put } from '../../helpers/api'
    import store from '../../store'
    import select from '../../components/Select';
    import button from '../../components/Button';

    export default {
        props: {
            id: {
                type: String
            }
        },
        data() {
            return {
                form: {
                    userId: store.getters.user._id,
                    question: null,
                    type: null,
                },
                types: store.getters.types
            }
        },
        components: {
            'v-select': select,
            'v-button': button,
        },
        created() {
            this.getQuestion();
            if (this.id) {
                this.getQuestion();
            }
        },
        computed: {
            action() {
                return (this.id) ? 'Edycja pytania' : 'Dodawanie pytania';
            }
        },
        methods: {
            async getQuestion() {
                const res = await get(`/questions/${this.id}`);
                this.form = res.data;
            },
            async submit() {
                if (this.id) {
                    await put(`/questions/${this.id}`, this.form)
                } else {
                    await post(`/questions`, this.form)
                }
                this.back();
            },
            async remove() {
                await del(`/trainings/${this.id}`);
                this.back();
            },
            back() {
                this.$router.go(-1);
            }
        }
    }
</script>