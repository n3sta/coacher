<template>
    <div>
        <div class="box box--border">
            <div class="box__title">
                <div class="box__title-name">Powiadomienia</div>
            </div>
            <div v-if="!isLoading">
                <div class="box__content box__content--no-padding" v-if="notifications.length">
                    <div class="list">
                        <div :class="['list__item', (!item.status) ? 'list__item--inactive' : '']" v-for="item in notifications" :key="item._id">
                            <div class="list__item-content">
                                <template v-if="item.notificationObject.entityType === 1">
                                    <div>{{ item.createdAt }}</div>
                                    {{ item.notifier.name.firstName }} {{ item.notifier.name.lastName }} dodał nowy <router-link :to="{name: 'editTraining', params: {_id: item.notificationObject.entityId}}"> trening</router-link>
                                </template>
                                <template v-if="item.notificationObject.entityType === 2">
                                    <div>{{ item.createdAt }}</div>
                                    {{ item.notifier.name.firstName }} {{ item.notifier.name.lastName }} zrealizował <router-link :to="{name: 'editTraining', params: {_id: item.notificationObject.entityId}}"> trening</router-link>
                                </template>
                            </div>
                            <div class="list__buttons">
                                <button class="button-icon" @click="changeActive(item._id, item.status)" :title="(item.status) ? 'Oznacz jako nieprzeczytany' : 'Oznacz jako przeczytany'"><span class="material-icons cursor" aria-hidden="true">check</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="blank" v-else>
                    <span>Nie znaleziono żadnych powiadomień</span>
                </div>
            </div>
            <div class="blank" v-else>
                <v-loader></v-loader>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { get, patch } from './../helpers/api';

    export default {
        data() {
            return {
                isLoading: true,
            }
        },
        computed: {
            ...mapGetters(['user', 'notifications']),
        },
        created() {
            this.isLoading = !this.notifications;
        },
        methods: {
            ...mapMutations(['setNotifications']),
            async changeActive(_id, status) {
                await patch(`/users/${_id}`, {status: !status});
                this.notifications.filter(item => item._id === _id)[0].status = !status;
                this.setNotifications(this.notifications);
            },
        },
    }
</script>