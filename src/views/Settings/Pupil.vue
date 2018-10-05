<template>
    <div class="notifications-box">
        <v-card-title>
            <h2 class="headline">{{ login }}</h2>
        </v-card-title>
        <v-card>
            <v-list two-line subheader v-for="(question, index) in questions">
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ question.question }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ answers[index] }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-card>
    </div>
</template>

<script>
    import store from '../../store'
    import { get } from '../../helpers/api'

    export default {
        props: {
            id: {
                type: Number,
                default() {
                    return 0;
                },
            },
            login: {
                type: String,
                default() {
                    return '';
                },
            },
        },
        data() {
            return {
                questions: {},
                answers: {},
                user: store.getters.user,
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                get(`/api/answersUser/${this.user.user_id}/${this.id}`)
                    .then((res) => {
                        if(res.data) {
                            this.questions = res.data.questions;
                            this.answers = res.data.answers;
                        }
                    })
            }
        }
    }
</script>