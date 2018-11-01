<template>
    <div>
        <transition name="fadeIn">
            <div :class="['snackbar', `snackbar--${snackbar.class}`]" v-show="snackbar.show">
                <div class="snackbar__title">{{ snackbar.text }}</div>
                <button type="button" class="snackbar__close button-icon" @click="$store.commit('closeSnackbar')"><span class="material-icons" aria-hidden="true">close</span></button>
            </div>
        </transition>
        <transition name="fadeIn">
            <v-modal :show="alert.show" @cancel="cancel()">
                <div class="box modal__box">
                    <div class="box__title">
                        <div class="box__title-name">{{ alert.title }}</div>
                    </div>
                    <div class="box__content box__content--minheight">
                        <p>{{ alert.body }}</p>
                    </div>
                    <div class="box__content">
                        <div class="form__buttons">
                            <div class="spacer"></div>
                            <div @click="cancel()" v-if="alert.type === 'question'">
                                <v-button type="button">Anuluj</v-button>
                            </div>
                            <div @click="confirm()">
                                <v-button type="button" :color="'blue'">
                                    <span v-if="alert.type !== 'statement'">Zatwierdź</span>
                                    <span v-else>Jasne</span>
                                </v-button>
                            </div>
                        </div>                        
                    </div>
                </div>
            </v-modal>
        </transition>
        <router-view></router-view>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import store from './store';

    export default {
        computed: mapGetters(['alert', 'snackbar']),
        methods: {
            ...mapActions(['setSnackbar', 'closeAlert']),
            cancel() {
                store.state.alert.resolve(false);
                this.closeAlert();
            },
            confirm() {
                store.state.alert.resolve(true);
                this.closeAlert();
            }
        }
    }
</script>