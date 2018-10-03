<template>
    <v-container class="loginPage" fluid fill-height>
        <v-layout justify-center>
            <v-flex xs12 sm8 md5>
                <h1 class="display-1">TheCoacher</h1>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Ankieta zawodnika</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <div class="ml-2 mr-2 mb-5">
                            <v-progress-linear
                                    color="green"
                                    v-model="progress"
                            ></v-progress-linear>
                        </div>
                        <v-form>
                            <template v-for="(question, index) in questions">
                                <div v-if="formStep === index + 1" class="ml-2 mr-2">
                                    <template v-if="question.type_input === 1">
                                        <v-text-field
                                                :label="question.question"
                                                v-model="form[question.id]"
                                                type="text"
                                                v-validate="'required'"
                                                :error-messages="errors.collect(question.question)"
                                                :data-vv-name="question.question">
                                        </v-text-field>
                                    </template>
                                    <template v-else-if="question.type_input === 2">
                                        <v-textarea
                                                :label="question.question"
                                                v-model="form[question.id]"
                                                rows="2"
                                                v-validate="'required'"
                                                :error-messages="errors.collect(question.question)"
                                                :data-vv-name="question.question">
                                        </v-textarea>
                                    </template>
                                    <template v-else-if="question.type_input === 3">
                                        <v-text-field
                                                :label="question.question"
                                                v-model="form[question.id]"
                                                v-validate="'required|decimal'"
                                                :error-messages="errors.collect(question.question)"
                                                :data-vv-name="question.question">
                                        </v-text-field>
                                    </template>
                                    <template v-else-if="question.type_input === 4">
                                        <v-menu
                                                :ref="menu[question.id]"
                                                :close-on-content-click="false"
                                                v-model="menu"
                                                :nudge-right="40"
                                                min-width="290px"
                                                :return-value.sync="form[question.id]">
                                            <v-text-field
                                                    :label="question.question"
                                                    v-model="form[question.id]"
                                                    type="text"
                                                    v-validate="'required'"
                                                    :error-messages="errors.collect(question.question)"
                                                    :data-vv-name="question.question"
                                                    readonly>
                                            </v-text-field>
                                            <v-date-picker v-model="form[question.id]"
                                                           no-title
                                                           scrollable
                                                           locale="pl">
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="menu[question.id] = false">Anuluj</v-btn>
                                                <v-btn color="primary" @click="$refs.menu[question.id].save(form[question.id])">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </template>
                                    <template v-else-if="question.type_input === 5">
                                        <v-checkbox
                                                :label="question.question"
                                                true-value="1"
                                                v-model="form[question.id]">
                                        </v-checkbox>
                                    </template>
                                    <template v-else-if="question.type_input === 6">
                                        <v-select
                                                :label="question.question"
                                                :items="question.select_options.split(';')"
                                                v-model="form[question.id]"
                                                item-value="id"
                                                v-validate="'required'"
                                                :error-messages="errors.collect(question.question)"
                                                :data-vv-name="question.question"
                                        ></v-select>
                                    </template>
                                </div>
                            </template>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="formStep > 1 && !isProcessing" flat @click="formStep = formStep - 1">Wróć</v-btn>
                                <v-btn v-if="formStep < questions.length" color="primary" @click="next()">Dalej</v-btn>
                                <v-btn v-else color="primary" :loading="isProcessing" :disabled="isProcessing" @click="save()">Wyślij</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-btn class="register" color="primary" flat @click="$router.push({name: 'admin'})">Wypełnie później</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Auth from '../../helpers/auth'
    import { get, post } from '../../helpers/api'

    export default {
        data() {
            return {
                isProcessing: false,
                formStep: 1,
                form: {},
                menu: {},
                questions: {},
                user: Auth.state,
                progress: 0
            }
        },
        watch: {
            formStep() {
                this.progress = (this.formStep-1)/this.questions.length * 100;
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                get(`/api/questions/${this.user.user_id}`)
                    .then((res) => {
                        if(res.data) {
                            this.questions = res.data;
                        }
                    })
            },
            next() {
                // this.$validator.validateAll().then((result) => {
                //     if (!result) {
                //         return false
                //     }
                //     this.formStep++;
                // });
                this.formStep++;
            },
            save() {
                this.formStep = this.formStep + 1;
                this.isProcessing = true;
                post(`api/answers/${this.user.user_id}`, this.form)
                    .then(() => {
                        this.$store.dispatch('setSnackbar', {color: 'green', text: 'Ankieta wypełniona. Poczekaj na odezw trenera.'});
                        this.$router.push({name: 'admin'});
                    })
                    .catch(() => {
                        this.$store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.isProcessing = false;
                    })
            }
        }
    }
</script>