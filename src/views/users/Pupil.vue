<template>
    <div>
        <div class="box">
            <div class="box__title">
                <div class="box__title-name">{{ user.name.firstName }} {{ user.name.lastName }}</div>
            </div>
            <div class="box__content no-padding">
                <table class="table" v-if="items.length">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item._id">
                            <td :data-title="item.question.question">{{ item.question.question }}</td>
                            <td :data-title="item.answer">{{ item.answer }}</td>
                        </tr>
                    </tbody>
                </table>
                <span v-else>Zawodnik nie odpowiedział na żadne pytanie.</span>
            </div>
            <div class="blank" v-if="isLoading">
                <v-loader></v-loader>
            </div>
        </div>
    </div>
</template>

<script>
    import { get } from '../../helpers/api'

    export default {
        props: {
            _id: {
                type: String,
            }
        },
        data() {
            return {
                user: {
                    name: {
                        firstName: null,
                        lastName: null
                    }
                },
                headers: ['Pytanie', 'Odpowiedź'],
                items: [],
                isLoading: true
            }
        },
        created() {
            this.getUser();
            this.getAnswers();
        },
        methods: {
            async getUser() {
                const res = await get(`/users/${this._id}`);
                this.user = res.data;
            },
            async getAnswers() {
                const res = await get('/answers', {user: this._id});
                this.items = res.data;
                this.isLoading = false;
            },
        },
    }
</script>