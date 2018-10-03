<template>
    <div>
        <div v-if="unreadLength > 0" :class="{ notificationsOverflow: !main }">
            <template v-for="(notification) in $store.state.notifications" v-if="!notification.read || main === 1">
                <v-list-tile :key="notification.id" :class="{ notificationUnread: !notification.read }">
                    <v-list-tile-content v-if="notification.type === 1" :class="{ notificationsOverflow: !main }">
                        <v-list-tile-title class="subheading">Trener dodał Ci nowy <a @click="training(notification.training_id)">trening</a></v-list-tile-title>
                        <v-list-tile-sub-title color="grey" class="caption">Utworzne: {{ notification.created_at }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-content v-if="notification.type === 2">
                        <v-list-tile-title class="subheading">Trener edytował Twój <a @click="training(notification.training_id)">trening</a></v-list-tile-title>
                        <v-list-tile-sub-title color="grey" class="caption">Utworzne: {{ notification.created_at }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-content v-if="notification.type === 3">
                        <v-list-tile-title class="subheading">{{ notification.training.user.login }} zrealizował swój <a @click="$router.push({name: 'admin', params: {training_id: notification.training_id}})">trening</a></v-list-tile-title>
                        <v-list-tile-sub-title color="grey" class="caption">Utworzne: {{ notification.created_at }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-content v-if="notification.type === 5">
                        <v-list-tile-title class="subheading">Zawodnik {{ notification.pupil.login }} potwierdził Twoje zaproszenie</v-list-tile-title>
                        <v-list-tile-sub-title color="grey" class="caption">Utworzne: {{ notification.created_at }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-tooltip top v-if="!notification.read">
                            <v-btn icon class="mx-0" slot="activator" @click="$store.dispatch('toggleNotification', notification.id)">
                                <v-icon color="grey" >check_box</v-icon>
                            </v-btn>
                            <span>Oznacz jako przeczytane</span>
                        </v-tooltip>
                        <v-tooltip top v-else>
                            <v-btn icon class="mx-0" slot="activator" @click="$store.dispatch('toggleNotification', notification.id)">
                                <v-icon color="blue darken-2">check_box</v-icon>
                            </v-btn>
                            <span>Oznacz jako nieprzeczytane</span>
                        </v-tooltip>
                    </v-list-tile-action>
                </v-list-tile>
                <v-divider></v-divider>
            </template>
        </div>
        <div class="blank" v-else>
            <h2 class="blank__title">Brak nowych powiadomień</h2>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            main: {
                type: Number,
                default() {
                    return 0
                }
            },
        },
        computed: {
            unreadLength() {
                return this.$store.state.notificationsUnread;
            }
        },
        methods: {
            training(id) {
                if (this.main) {
                    this.$router.push({name: 'admin', params: {training_id: id}})
                } else {
                    this.$emit('show', id);
                }
            }
        }
    }
</script>