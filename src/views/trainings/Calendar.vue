<template>
    <div>
        <div class="calendar">
            <div class="calendar__week">
                <div class="calendar__day" v-for="(day, dayIndex) in monthDays"
                     @click="$router.push({name: 'addTraining', params: {user: calendar.user, createdAt: day.createdAt}})"
                     :ref="`day${dayIndex}`"
                     :key="dayIndex"
                     :class="{
                        'calendar__day--prev-month': isPrevMonth(day.createdAt),
                        'calendar__day--next-month': isNextMonth(day.createdAt),
                        'calendar__day--today': isToday(day.createdAt)
                     }"
                >
                    <div class="calendar__date">
                        <span v-if="dayIndex < 7">{{ daysNames[getWeekDay(day.createdAt)] }}, </span>{{ getDay(day.createdAt) }} {{ monthShortcut(day.createdAt) }}
                    </div>
                    <div class="calendar__events calendar__sortable" :data-date="day.createdAt">
                        <div class="calendar__event" v-for="(event, eventIndex) in dayEvents(day.createdAt)" :key="eventIndex" :data-date="day.createdAt" :data-id="event._id" @click.stop="$router.push({name: 'editTraining', params: {_id: event._id}})">
                            <v-button :color="event.done === true ? 'green' : 'grey'">{{ event.type.name }}</v-button>
                        </div>
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
    import { mapGetters } from 'vuex';
    import Sortable from 'sortablejs';
    import moment from 'moment';
    import { put } from '../../helpers/api';

    export default {
        props: {
            miniCalendar: {
                type: Number,
                default: 0
            },
            events: {
                type: Array,
                default: () => []
            },
            currDate: {
                type: Object
            },
            daysNames: {
                type: Array
            },
            months: {
                type: Array
            },
        },
        data() {
            return {
                monthDays: [],
                dragging: false,
            }
        },
        computed: mapGetters(['user', 'calendar']),
        created() {
            (this.miniCalendar) ? this.drawMiniCalendar() : this.drawCalendar();
        },
        mounted() {
            const days = document.querySelectorAll('.calendar__day');
            for (let day of days) {
                const tooltip = day.querySelector('.calendar__tooltip');
                day.addEventListener('mouseover', (e) => {
                    tooltip.style.display = (!this.dragging) ? 'block' : 'none';
                    tooltip.innerText = (e.target.tagName === "BUTTON") ? "Edytuj lub przenieś" : "Kliknij, aby dodać" ;
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
                })
            }
        },
        methods: {
            async dragEnd({ to, item }) {
                const id = item.getAttribute('data-id');
                const date = new Date(to.getAttribute('data-date'));
                this.dragging = false;
                if (id && date) {
                    await put(`/trainings/${id}`, {createdAt: date});
                }
            },
            dragStart() {
                this.dragging = true;
            },            
            drawMiniCalendar() {
                const firstWeekDay = moment(this.currDate).startOf('isoweek');
                for (let i = 0; i < 7; i++) {
                    const days = (i > 1) ? 'days' : 'day';
                    firstWeekDay.add(1, days);
                    this.monthDays.push({
                        createdAt: moment(firstWeekDay).format('YYYY-MM-DD'),
                    })
                }
            },
            drawCalendar() {
                const firstWeekDay = moment(this.currDate).startOf('month');
                const firstMonthDay = moment(firstWeekDay).startOf('isoweek');
                this.monthDays = [];
                for (let i = 0; i < 35; i++) {
                    const days = (i > 1) ? 'days' : 'day';
                    firstMonthDay.add(1, days);
                    this.monthDays.push({
                        createdAt: moment(firstMonthDay).format('YYYY-MM-DD'),
                    })
                }
            },
            show(id, date = new Date()) {
                this.$emit('show', {id, date})
            },
            dayEvents(date) {
                return this.events.filter(event => moment(event.createdAt).format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD'));
            },
            getDay(d) {
                const date = new Date(d);
                return date.getDate();
            },
            getWeekDay(d) {
                const date = moment(d);
                return date.day();
            },
            isToday(d) {
                const today = moment(new Date()).format('YYYY-MM-DD');
                return !!(today === d);
            },
            isPrevMonth(d) {
                const currDate = moment(this.currDate).format('M');
                const prevMonth = moment(d).format('M');
                return currDate > prevMonth;
            },
            isNextMonth(d) {
                const currDate = moment(this.currDate).format('M');
                const nextMonth = moment(d).format('M');
                return currDate < nextMonth
            },
            monthShortcut(d) {
                const date = new Date(d);
                const month = date.getMonth();
                return this.months[month];
            },
        },
    }
</script>