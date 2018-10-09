<template>
    <div>
        <div class="box">
            <div class="box__content">
                <v-calendar></v-calendar>
            </div>
        </div>
        <v-button v-if="user.coach === 1" color="green">
            Nowy zawodnik
        </v-button>
        <v-button v-if="user.coach === 1" color="green">
            Exportuj do PDF
        </v-button>
    </div>
</template>

<script>
    import moment from 'moment';
    import store from '../../store';
    import calendarHelpers from '../../helpers/calendar.js';
    import Calendar from '../../components/Calendar';
    import Button from '../../components/Button';

    export default {
        data() {
            return {
                monthsLong: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                currDate: moment(),
                user: store.getters.user,
                calendarUser: store.getters.user.userId,
            }
        },
        mixins: [
            calendarHelpers
        ],
        components: {
            'v-calendar': Calendar,
            'v-button': Button,
        },
    }
</script>