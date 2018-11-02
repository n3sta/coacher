<template>
    <div>
        <form class="form" @submit.prevent="submit()">
            <div class="box box--medium">
                <div class="box__title">
                    <span class="box__title-name">{{ action }}</span>
                </div>
                <div class="box__content">
                    <div class="form__box">
                        <v-input :type="'text'" :for="'name'" :value="form.question" :id="'question'" @input="form.question = $event" @keyup="$v.form.question.$touch()">Pytanie</v-input>
                        <div v-if="$v.form.question.$error">
                            <div class="form__error" v-if="!$v.form.question.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.question.minLength">To pole musi mieć co najmniej {{ $v.form.question.$params.minLength.min }} znaki</div>
                        </div>
                    </div>
                    <div class="form__box">
                        <v-select :items="types" :label="'Typ pola'" :id="'type'" :value="form.type" @change="form.type = $event"></v-select>
                        <div v-if="$v.form.type.$error">
                            <div class="form__error" v-if="!$v.form.type.required">To pole jest wymagane.</div>
                        </div>
                    </div>
                    <div class="form__box" v-if="form.options.length && form.type === 3">
                        <ul class="simple-list">
                            <li class="simple-list__item" v-for="(item, index) in form.options" :key="index">{{ item }}</li>
                        </ul>
                    </div>
                    <div class="form__box form__box--align-start" v-if="form.type === 3">
                        <div @click="show = true">
                            <v-button type="button" :color="'transparent'">Opcje listy</v-button>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <div @click="back()">
                            <v-button type="button" :color="'white'">Anuluj</v-button>
                        </div>
                        <v-button type="submit" :color="'blue'" :disabled="$v.$invalid || isProcessing" :loading="isProcessing">Dodaj</v-button>
                    </div>
                </div>
            </div>
        </form>
        <addOption v-if="show" :show="show" :options="form.options" @cancel="show = false" @done="form.options = $event"></addOption>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { required, minLength } from 'vuelidate/lib/validators'
    import { get,post,del,put } from '../../helpers/api'
    import addOption from './addOption';

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
                    options: [],
                    required: false
                },
                types: store.getters.types,
                show: false,
                isProcessing: false
            }
        },
        components: {
            'addOption': addOption,
        },
        created() {
            if (this.id) {
                this.getQuestion();
            }
        },
        computed: {
            ...mapGetters(['user', 'types']),
            action() {
                return (this.id) ? 'Edycja pytania' : 'Dodawanie pytania';
            }
        },
        watch: {
            user() {
                this.form.userId = user._id;
            }
        },
        methods: {
            async getQuestion() {
                const res = await get(`/questions/${this.id}`);
                this.form = res.data;
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
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
            },
            done(options) {
                this.addOption = false;
                this.form.options = options;
            },
        },
        validations: {
            form: {
                question: {
                    required,
                    minLength: minLength(3)
                },
                type: {
                    required
                },
            }
        }
    }
</script>