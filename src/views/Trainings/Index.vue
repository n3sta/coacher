<template>
    <div>
        <div :class="['box', (miniCalendar) ? 'no-shadow' : '']">
            <div :class="['box__content', (miniCalendar) ? 'no-padding' : '']">
                <div class="calendar__filters" v-if="!miniCalendar">
                    <v-dropdown :items="pupils" :id="'calendarUser'" @change="calendarUser = $event"></v-dropdown>
                    <div style="display: flex; align-items: center;">
                        <div class="calendar__divider"></div>
                        <span class="calendar__month">{{ monthsLong[currDate.format('M')-1] }} {{ currDate.format('Y') }}</span>
                        <button type="button" class="button-icon" @click="setPrevMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_left</span></button>
                        <button type="button" class="button-icon" @click="setNextMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_right</span></button>
                    </div>
                    <div class="calendar__divider changeView"></div>
                    <v-button v-if="user.coach === true" :color="'blue'">
                        Exportuj do PDF
                    </v-button>
                    <div @click="changeView" class="changeView">
                        <v-button :color="'blue'">
                            <template v-if="!showList">Widok listy</template>
                            <template v-else>Widok kalendarza</template>
                        </v-button>
                    </div>
                </div>
                <v-calendar v-if="!showList" ref="calendar" :events="events" :currDate="currDate" :daysNames="daysNames" :months="months" @getEvents="getEvents" @show="show" :miniCalendar="miniCalendar"></v-calendar>
                <v-list v-else :events="events" :currDate="currDate" :daysNames="daysNames" :months="months" @show="show"></v-list>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import store from '../../store';
    import { get, post, put } from '../../helpers/api';
    import Calendar from './Calendar';
    import List from './List';

    export default {
        props: {
            miniCalendar: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                daysNames: ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sb'],
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                monthsLong: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                user: store.getters.user,
                events: [],
                currDate: moment(),
                calendarUser: store.getters.user._id,
                pupils: store.getters.pupils,
                showList: JSON.parse(localStorage.getItem('showList'))
            }
        },
        components: {
            'v-calendar': Calendar,
            'v-list': List
        },
        watch: {
            'calendarUser': function() {
                this.getEvents();
            },
        },
        created() {
            this.getEvents();
            this.checkWidth();
            window.addEventListener('resize', this.checkWidth);
            if (this.miniCalendar) this.showList = false; 
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
                    user: this.calendarUser,
                    createdAt: {
                        $gte: new Date(firstCalendarDay),
                        $lte: new Date(lastCalendarDay)
                    }
                };
                this.events = [];
                const res = await get('/trainings', params);
                this.events = res.data;;
            },
            show(data) {
                store.commit('setTrainingData', {
                    createdAt: new Date(data.date),
                    userId: this.calendarUser,
                    _id: data.id
                });
                this.$router.push({name: 'addTraining'})
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
                if (window.innerWidth < 1180) {
                    this.showList = true;
                }
            },
        }
    }
</script>