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
                            <template v-if="item.type === 3">
                                <v-select-simple v-model="form[step]" :items="questions[index].options" :id="`input${index}`" :value="form[step]" :label="item.question"  @change="$v.form.$each.$iter[index].$touch()" @input="form[step] = $event"></v-select-simple>
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
    import { mapGetters, mapActions } from 'vuex';
    import { required } from 'vuelidate/lib/validators'
    import { get, post, put } from '../../helpers/api';

    export default {
        data() {
            return {
                answers: [],
                questions: [],
                step: 0,
                form: [],
            }
        },
        computed: {
            ...mapGetters(['user']),
            steps() {
                return this.questions.length;
            },
            percent() {
                return ((this.step)/(this.steps || 1) * 100).toFixed(0);
            }
        },
        created() {
            this.getQuestions();
            this.getAnswers();
            this.openAlert({
                title: 'Chcę Cię lepiej poznać.',
                body: 'Wypełnij proszę ten formularz. Pomoże mi to w ułożeniu dla Ciebie planu treningowego.',
                type: 'statement'
            });
        },
        methods: {
            ...mapActions(['openAlert']),
            async getQuestions() {
                const res = await get(`/questions`, {user: this.user._id});
                this.questions = res.data;
                this.form = this.questions.map(() => {return ''})
            },
            async getAnswers() {
                const res = await get(`/answers`, {user: this.user._id});
                this.answers = res.data;
            },
            async submit() {
                !this.$v.form.$each.$iter[this.step].$touch();
                if (this.$v.form.$each.$iter[this.step].$invalid) {
                    return false;
                }
                if (this.answers[this.step]) {
                    const id = this.answers[this.step]._id;
                    await put(`answers/${id}`, {
                        answer: this.form[this.step]
                    });
                } else {
                    await post('answers', {
                        user: this.user._id,
                        question: this.questions[this.step]._id,
                        answer: this.form[this.step]
                    });
                }
                this.step++;
                if (this.step === this.steps) {
                    if (this.user.coachId) {
                        localStorage.setItem('firstLogin', true);
                        this.$router.push({name: 'admin'})
                    }
                    this.$router.push({name: 'questions'})
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