<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Lista użytkowników</div>
            </div>
            <div class="box__content box__content--no-padding" v-if="users.length">
                <div class="list">
                    <div class="list__item" v-for="item in users" :key="item._id">
                        <div class="list__item-content">
                            <router-link :to="{name: 'pupil', params: {userId: item._id}}" class="list__name">{{ item.email }}</router-link>
                        </div>
                        <div class="list__buttons">
                            <button class="button-icon" @click="deleteUser(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="blank" v-else>
                <span>Nie znaleziono żadnych użytkowników</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { get, del } from '../../helpers/api'

    export default {
        data() {
            return {
                users: [],
            }
        },
        computed: mapGetters(['user']),
        created() {
            this.getUsers();
        },
        methods: {
            async getUsers() {
                const res = await get('/users');
                this.users = res.data;
            },
            async deleteUser(id) {
                await del(`/users/${id}`);
                this.getUsers();
            },
        },
    }
</script>