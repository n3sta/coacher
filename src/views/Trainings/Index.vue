<template>
    <div>
        <div class="box no-shadow">
            <div class="box__content box__content--no-padding">
                <div class="calendar__filters">
                    <div class="calendar__switch-date">
                        <span class="calendar__month">{{ monthsLong[currDate.format('M')-1] }} {{ currDate.format('Y') }}</span>
                        <button type="button" class="button-icon" @click="setPrevMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_left</span></button>
                        <button type="button" class="button-icon" @click="setNextMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_right</span></button>
                    </div>
                    <div class="calendar__divider changeView"></div>
                    <v-button v-if="user.pdf" :color="'blue'">
                        Exportuj do PDF
                    </v-button>
                    <div @click="changeView" class="changeView">
                        <v-button :color="'blue'">
                            <template v-if="!showList">Widok listy</template>
                            <template v-else>Widok kalendarza</template>
                        </v-button>
                    </div>
                    <v-datepicker v-model="currDate" :value="currDate" type="month" format="YYYY-MM" @change="currDate = $event" lang="pl"></v-datepicker>
                </div>
                <v-calendar v-if="!showList" ref="calendar" :events="events" :currDate="currDate" :daysNames="daysNames" :months="months" @getEvents="getEvents"></v-calendar>
                <v-list v-else :events="events" :currDate="currDate" :daysNames="daysNames" :months="months"></v-list>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { get } from '../../helpers/api';
    import Calendar from './Calendar';
    import List from './List';

    export default {
        data() {
            return {
                daysNames: ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sb'],
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                monthsLong: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                events: [],
                currDate: moment(),
                showList: JSON.parse(localStorage.getItem('showList')),
            }
        },
        computed: mapGetters(['user', 'calendar']),
        components: {
            'v-calendar': Calendar,
            'v-list': List
        },
        watch: {
            'calendar.user'() {
                this.getEvents();
            }
        },
        created() {            
            window.addEventListener('resize', this.checkWidth);
            this.getEvents();
            this.checkWidth();
        },
        destroyed() {
            window.removeEventListener('resize', this.checkWidth);
        },
        methods: {
            async getEvents() {
                const firstMonthDay = moment(this.currDate).startOf('month');
                const lastMonthDay = moment(this.currDate).endOf('month');
                const firstCalendarDay = moment(firstMonthDay).startOf('isoWeek');
                const lastCalendarDay = moment(lastMonthDay).endOf('isoWeek');
                const params = {
                    user: this.calendar.user,
                    createdAt: {
                        $gte: new Date(firstCalendarDay),
                        $lte: new Date(lastCalendarDay)
                    }
                };
                this.events = [];
                const res = await get('/trainings', params);
                this.events = res.data;
            },
            changeView() {
                localStorage.setItem('showList', !this.showList);
                this.showList = !this.showList;
            },
            setNextMonth() {
                this.currDate = this.currDate.add(1, 'month');
                this.getEvents();
                if (!this.showList) this.$refs.calendar.drawCalendar();
            },
            setCurrMonth() {
                this.currDate = moment();
                this.getEvents();
                if (!this.showList) this.$refs.calendar.drawCalendar();
            },
            setPrevMonth() {
                this.currDate = this.currDate.add(-1, 'month');
                this.getEvents();
                if (!this.showList) this.$refs.calendar.drawCalendar();
            },
            checkWidth() {
                if (window.innerWidth < 1100) {
                    this.showList = true;
                }
            },
        }
    }
</script>