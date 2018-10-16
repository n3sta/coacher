<template>
    <div>
        <div class="pupil">
            <div class="pupil__avatar">{{ user.name.firstName.charAt(0) }}{{ user.name.lastName.charAt(0) }}</div>
            <h3 class="pupil">{{ user.name.firstName }} {{ user.name.lastName }}</h3>
            <div class="pupil__options-wrapper">
                <v-button :color="'blue'">Napisz wiadomość</v-button>
                <v-button :color="'red'">Usuń</v-button>
            </div>
        </div>
        <div class="box">
            <div class="box__title">
                <span class="box__title-name">Ostatnie aktywności</span>
            </div>
            <div class="box__content">
                <v-calendar :miniCalendar="1"></v-calendar>
            </div>
        </div>
    </div>
</template>

<script>
    import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
    import { get, put, patch } from '../../helpers/api'
    import store from '../../store'
    import Statistic from '../Panel/Statistic';
    import nextStart from '../Panel/nextStart';
    import Calendar from '../Trainings/Calendar';

    export default {
        props: {
            userId: {
                type: String,
            }
        },
        data() {
            return {
                user: {
                    name: {
                        firstName: '',
                        lastName: ''
                    }
                },
                trainings: []
            }
        },
        components: {
            'v-statistic': Statistic,
            'v-nextStart': nextStart,
            'v-calendar': Calendar
        },
        created() {
            this.getUser();
        },
        methods: {
            async getUser() {
                const res = await get(`/users/${this.userId}`);
                this.user = res.data;
            },
            async getLastTraining() {
                const res = await get('/trainings', {
                    user: this.user._id,
                    createdAt: {
                        $gte: new Date(moment().startOf('day')),
                        $lte: new Date(moment().endOf('day'))
                    }
                });
                this.trainings = res.data;
            },
        },
        validations: {

        }
    }
</script>