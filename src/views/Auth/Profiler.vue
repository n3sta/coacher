<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Profilowanie zawodnika</div>
            </div>
            <div class="box__content">
                <div class="form__box">
                    <div class="progress">
                        <div class="progress__line">
                            <div class="progress__done" :style="`width: ${percent}%`"></div>
                        </div>
                        <div class="progress__percent">{{ percent }}%</div>
                    </div>
                </div>
                <form @submit.prevent="submit()">
                    <div class="form__box" v-for="(item, index) in questions" :key="item._id">
                        <template v-if="step === index">
                            <template v-if="item.type === 1">
                                <v-input v-model="form[step]" :id="`input${index}`" @keyup="$v.form.$each.$iter[index].$touch()" @input="form[step] = $event">{{ item.question }}</v-input>
                            </template>
                            <template v-if="item.type === 2">
                                <v-textarea v-model="form[step]" :id="`input${index}`" :value="form[step]" @keyup="$v.form.$each.$iter[index].$touch()" @input="form[step] = $event">{{ item.question }}</v-textarea>
                            </template>
                            <div v-if="$v.form.$each.$iter[index].$error">
                                <div class="form__error" v-if="!$v.form.$each.$iter[index].required">To pole jest wymagane.</div>
                            </div>
                        </template>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <div @click="prev()" v-if="step !== 0">
                            <v-button type="button" :color="'blue'">Wróć</v-button>
                        </div>
                        <div @click="submit()">
                            <v-button type="button" :color="'blue'">
                                <span v-if="step + 1 < steps">Dalej</span>
                                <span v-else>Zapisz</span>
                            </v-button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import { required } from 'vuelidate/lib/validators'
    import store from '../../store';
    import { get, post, put } from '../../helpers/api';

    export default {
        data() {
            return {
                questions: [],
                user: store.getters.user,
                step: 0,
                form: [],
            }
        },
        computed: {
            steps() {
                return this.questions.length;
            },
            percent() {
                return ((this.step)/(this.steps || 1) * 100).toFixed(0);
            }
        },
        created() {
            this.getQuestions();
        },
        methods: {
            async getQuestions() {
                const res = await get(`/questions`, {userId: this.user._id});
                this.questions = res.data;
                this.form = this.questions.map(() => {return ''})
            },
            async submit() {
                !this.$v.form.$each.$iter[this.step].$touch();
                if (this.$v.form.$each.$iter[this.step].$invalid) {
                    return false;
                }
                await post('answers', {
                    questionId: this.questions[this.step]._id,
                    answer: this.form[this.step],
                });
                this.step++;
                if (this.step === this.steps) {
                    this.$router.push({name: 'admin'})
                }
            },
            prev() {
                this.step--;
            }
        },
        validations: {
            form: {
                $each: {
                    required
                }
            }
        }
    }
</script>