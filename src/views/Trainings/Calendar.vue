<template>
    <div>
        <div class="calendar">
            <div class="calendar__filters" v-if="!miniCalendar">
                <v-dropdown :items="pupils" :id="'calendarUser'" @change="calendarUser = $event"></v-dropdown>
                <div class="calendar__divider"></div>
                <span class="calendar__month">{{ monthsLong[currDate.format('M')-1] }} {{ currDate.format('Y') }}</span>
                <button type="button" class="button-icon" @click="setPrevMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_left</span></button>
                <button type="button" class="button-icon" @click="setNextMonth()"><span class="material-icons" aria-hidden="true">keyboard_arrow_right</span></button>
                <div class="calendar__divider"></div>
                <v-button v-if="user.coach === true" :color="'blue'">
                    Exportuj do PDF
                </v-button>
            </div>
            <div class="calendar__week">
                <div class="calendar__day" v-for="(day, dayIndex) in monthDays"
                     @click="show(0, day.createdAt)"
                     :ref="`day${dayIndex}`"
                     :key="dayIndex"
                     :class="{
                        'calendar__day--prev-month': isPrevMonth(day.createdAt),
                        'calendar__day--next-month': isNextMonth(day.createdAt),
                        'calendar__day--today': isToday(day.createdAt),
                        'calendar__day--no-event': isEvent(day.createdAt)
                     }"
                >
                    <div class="calendar__date">
                        <span v-if="dayIndex < 7">{{ daysNames[getWeekDay(day.createdAt)] }}, </span>{{ getDay(day.createdAt) }} {{ monthShortcut(day.createdAt) }}
                    </div>
                    <div class="calendar__events calendar__sortable" :data-date="day.createdAt">
                        <transition-group name="slideDown">
                            <div class="calendar__event" v-for="(event, eventIndex) in dayEvents(day.createdAt)" :key="eventIndex" :data-id="event._id" @click.stop="show(event._id, day.createdAt)">
                                <v-button :color="event.done === true ? 'green' : 'grey'">{{ event.trainingType.name }}</v-button>
                            </div>
                        </transition-group>
                    </div>
                    <div class="calendar__tooltip">
                        <span>Kliknij, aby dodać</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';
    import moment from 'moment';
    import { get, post } from '../../helpers/api';
    import store from '../../store';
    import calendarHelpers from '../../helpers/calendar.js';

    export default {
        props: {
            miniCalendar: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                daysNames: ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sb'],
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                monthsLong: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                monthDays: [],
                user: store.getters.user,
                events: [],
                currDate: moment(),
                dragging: false,
                calendarUser: store.getters.user._id,
                pupils: store.getters.pupils
            }
        },
        mixins: [
            calendarHelpers
        ],
        watch: {
            'currDate': function() {
                if (this.miniCalendar) {
                    this.drawMiniCalendar();
                } else {
                    this.drawCalendar();
                }
            },
            'calendarUser': function() {
                this.getEvents();
            },
        },
        created() {
            if (!this.pupils.filter(pupil => pupil._id === this.user._id).length) {
                this.pupils.unshift({name: {firstName: this.user.name.firstName, lastName: this.user.name.lastName}, _id: this.user._id});
            }
            if (this.miniCalendar) {
                this.drawMiniCalendar();
            } else {
                this.drawCalendar();
            }
        },
        mounted() {
            const days = document.querySelectorAll('.calendar__day');
            for (let day of days) {
                const tooltip = day.querySelector('.calendar__tooltip');
                day.addEventListener('mouseover', (e) => {
                    tooltip.style.display = (!this.dragging) ? 'block' : 'none';
                    tooltip.innerText = (e.target.tagName === "BUTTON") ? "Edytuj trening" : "Kliknij, aby dodać" ;
                });
                day.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                    tooltip.innerText = "Kliknij, aby dodać";
                });
            }
            const lists = document.querySelectorAll('.calendar__sortable');
            for (let list of lists) {
                new Sortable(list, {
                    group: {
                        name: "events",
                        pull: true,
                        put: true,
                    },
                    animation: 150,
                    forceFallback: true,
                    handler: '.calendar__event',
                    onStart: this.dragStart,
                    onAdd: this.dragEnd,
                    onSort: this.dragSort
                })
            }
        },
        methods: {
            dragStart() {
                this.dragging = true;
            },
            dragSort({oldIndex, newIndex, item, to}) {
                const id = item.getAttribute('data-id');
                const date = to.getAttribute('data-date');
                post(`api/trainings/${id}`, {newer: newIndex > oldIndex, createdAt: date})
                    .catch(() => {
                        store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.getEvents();
                    })
            },
            dragEnd({ to, item}) {
                const id = item.getAttribute('data-id');
                const date = to.getAttribute('data-date');
                this.dragging = false;
                post(`api/changeDate/${id}`, {createdAt: date})
                    .then(() => {
                        this.getEvents();
                    })
                    .catch(() => {
                        store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.getEvents();
                    })
            },
            getEvents() {
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
                get('/trainings', params).then((res) => {
                    this.events = res.data;
                    this.eventsLoaded = false;
                });
            },
            drawMiniCalendar() {
                const firstWeekDay = moment(this.currDate).startOf('week');
                for (let i = 0; i < 7; i++) {
                    const days = (i > 1) ? 'days' : 'day';
                    firstWeekDay.add(1, days);
                    this.monthDays.push({
                        createdAt: moment(firstWeekDay).format('YYYY-MM-DD'),
                    })
                }
                this.getEvents(moment(this.currDate).format('YYYY-MM-DD'));
            },
            drawCalendar() {
                const firstWeekDay = moment(this.currDate).startOf('month');
                const firstMonthDay = moment(firstWeekDay).startOf('week');
                this.monthDays = [];
                for (let i = 0; i < 35; i++) {
                    const days = (i > 1) ? 'days' : 'day';
                    firstMonthDay.add(1, days);
                    this.monthDays.push({
                        createdAt: moment(firstMonthDay).format('YYYY-MM-DD'),
                    })
                }
                this.getEvents(moment(this.currDate).format('YYYY-MM-DD'));
            },
            show(_id, d = new Date()) {
                store.dispatch('setTrainingDate', {
                    createdAt: new Date(d),
                    userId: this.calendarUser,
                    _id: _id
                });
                this.$router.push({name: 'addTraining'})
            },
        },
    }
</script>