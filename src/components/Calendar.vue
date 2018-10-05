<template>
    <div class="plan">
        <div class="calendar" :class="{ 'calendar--list': showList }">
            <div class="calendar-days" v-if="!showList">
                <div class="calendar-days__day" v-for="(day, i) in daysNames">
                    <h2 class="subheader">{{ day }}</h2>
                </div>
            </div>
            <div class="calendar__week">
                <div class="calendar__day" v-for="(day, dayIndex) in monthDays"
                     :ref="`day${dayIndex}`"
                     :class="{
                        'calendar__day--prev-month': isPrevMonth(day.createdAt),
                        'calendar__day--next-month': isNextMonth(day.createdAt),
                        'calendar__day--today': isToday(day.createdAt),
                        'calendar__day--no-event': isEvent(day.createdAt)
                     }"
                     @click="show(0, day.createdAt)"
                >
                    <div class="calendar__date">
                        <span class="calendar__date--day">{{ getDay(day.createdAt) }}</span>
                        <span class="calendar__date--month">{{ monthShortcut(day.createdAt) }}</span>
                    </div>
                    <div class="calendar__tooltip">
                        <span>Kliknij, aby dodać</span>
                    </div>
                    <div class="calendar__events calendar__sortable" :data-date="day.createdAt">
                        <div class="calendar__event" v-for="(event, eventIndex) in dayEvents(day.createdAt)" :key="eventIndex" :data-id="event._id">
                            <v-btn flat :class="[event.done === true ? 'green' : 'grey']" @click.stop="show(event._id, day.createdAt)">
                                    {{ event.trainingType.name }}
                            </v-btn>       
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="blank" v-if="monthEvents().length === 0 && !eventsLoaded && showList">
            <h2 class="blank__title">Nie znaleziono treningów w tym miesiącu</h2>
            <v-btn class="primary" @click="show(null, moment(currDate).format('YYYY-MM-DD'))">Dodaj trening</v-btn>
        </div>
        <div class="blank" v-if="eventsLoaded && showList">
            <v-progress-circular color="primary" indeterminate :size="45" :width="7"></v-progress-circular>
        </div>
        <pop-up
            v-if="showPopUp"
            @save="getEvents"
            @update="getEvents"
            @close="close"
            :_id="editId"
            :date="editDate"
            :user="calendarUser"
            :canDone="!!(calendarUser === user.userId)"
        ></pop-up>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';
    import moment from 'moment';
    import PopUp from './PopUp';
    import { get,post,del } from '../helpers/api';
    import store from '../store';
    import calendarHelpers from '../helpers/calendar.js';

    export default {
        props: {
            miniCalendar: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                daysNames: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                monthsLong: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                monthDays: [],
                user: store.getters.user,
                events: [],
                currDate: moment(),
                eventsLoaded: false,
                showList: false,
                editId: false,
                editDate: false,
                drawer: null,
                currDateMenu: false,
                mobile: false,
                dragging: false,
                showPopUp: false,
                editId: 0,
                calendarUser: store.getters.user.userId
            }
        },
        components: {
            'pop-up': PopUp
        },
        mixins: [
            calendarHelpers
        ],
        watch: {
            'currDate': function(val) {
                if (this.miniCalendar) {
                    this.drawMiniCalendar();
                } else {
                    this.drawCalendar();
                }
            },
        },
        created() {
            if (this.miniCalendar) {
                this.drawMiniCalendar();
            } else {
                this.drawCalendar();
            }
            this.checkWidth();
            window.addEventListener('resize', this.checkWidth);
        },
        mounted() {
            const days = document.querySelectorAll('.calendar__day');
            for (let day of days) {
                const tooltip = day.querySelector('.calendar__tooltip');
                day.addEventListener('mouseenter', () => {
                    tooltip.style.display = (tooltip.style.display === 'block' || this.dragging) ? 'none' : 'block';
                });
                day.addEventListener('mouseleave', () => {
                    tooltip.style.display = (tooltip.style.display === 'block' || this.dragging) ? 'none' : 'block';
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
                post(`api/changeSort/${id}`, {newer: newIndex > oldIndex, createdAt: date})
                    .catch(() => {
                        this.$store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.getEvents();
                    })
            },
            dragEnd({from, to, item}) {
                const id = item.getAttribute('data-id');
                const date = to.getAttribute('data-date');
                this.dragging = false;
                post(`api/changeDate/${id}`, {createdAt: date})
                    .then(() => {
                        this.getEvents();
                    })
                    .catch(() => {
                        this.$store.dispatch('setSnackbar', {color: 'red', text: 'Błąd serwera.'});
                        this.getEvents();
                    })
            },
            showModal(id) {
                const event = this.events.filter(ev => ev._id === id)[0];
                if (this.showList) {
                    this.show(event._id, event.createdAt);
                    return false;
                }
                this.$set(event, 'active', 1);
            },
            close() {
                this.showPopUp = false;
                this.editId = false;
                this.editDate = false;
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
                this.eventsLoaded = true;
                this.events = [];
                get('/trainings', params).then((res) => {
                    this.events = res.data;
                    this.eventsLoaded = false;
                });
            },
            drawMiniCalendar() {
                const firstWeekDay = moment(this.currDate).startOf('week');
                const lastWeekDay = moment(this.currDate).endOf('week');
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
            show(id = null, date = new Date()) {    
                this.editId = id;
                this.editDate = moment(date).format('YYYY-MM-DD');
                this.showPopUp = true;
            },
            checkWidth() {
                if (window.innerWidth < 991) {
                    this.showList = true;
                    this.mobile = true;
                } else {
                    this.mobile = false;
                }
            },
        },
    }
</script>


<style>
    .list-enter-active, .list-leave-active {
        transition: all 0.5s;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(-30px);
    }
</style>