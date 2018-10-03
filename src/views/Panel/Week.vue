<template>
	<div class="plan">
        <div class="calendar">
            <div class="calendar-days">
                <div class="calendar-days__day" v-for="(day, i) in daysNames">
                    <h2 class="subheader">{{ day }}</h2>
                </div>
            </div>
            <div class="calendar__week">
                <div class="calendar__day" v-for="(day, dayIndex) in monthDays">
                    <div class="calendar__date">
                        <span class="calendar__date--day">{{ getDay(day.createdAt) }}</span>
                        <span class="calendar__date--month">{{ monthShortcut(day.createdAt) }}</span>
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
    </div>
</template>

<script>
	import {get,post} from '../../helpers/api';

	export default {
		data() {
			return {
				
			}
		},
		created() {
			this.getStatistic();
		},
		methods: {
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
                    this.getStatistic();
                });
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
            },
            show(id = null, date = new Date()) {
                this.editId = id;
                this.editDate = moment(date).format('YYYY-MM-DD');
            },
		}
	}
</script>