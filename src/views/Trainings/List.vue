<template>
    <div class="calendar-list">
        <div v-if="monthEvents()" class="list">
            <div class="list__item" v-for="item in events" :key="item._id" @click="$router.push({name: 'editTraining', params: {_id: item._id}})">
                <div class="list__item-content">
                    <div :class="['calendar-date', (isToday(item.createdAt)) ? 'calendar--today' : '']">
                        <div class="calendar-date-day">{{ new Date(item.createdAt).getDate() }}</div>
                        <div class="calendar-date-day-name">{{ daysNames[new Date(item.createdAt).getDay()] }}.</div>
                    </div>
                    <pre>{{ item.content }}</pre>
                </div>
                <div class="list__buttons">
                    <span v-if="item.done" class="material-icons text--green" aria-hidden="true">check</span>
                </div>
            </div>
        </div>
        <div v-else class="blank blank--center">
            <p>Nie znaleziono treningów w tym miesiącu.</p>
        </div>
        <div class="button-float" @click="$router.push({name: 'addTraining', params: {user: calendarUser, createdAt: new Date(currDate)}})">
            <span class="material-icons" aria-hidden="true">add</span>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props: {
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
            calendarUser: {
                type: String
            }
        },
        methods: {
            monthEvents() {
                const firstDay = new Date(this.currDate.startOf('month'))
                const lastDay = new Date(this.currDate.endOf('month'))
                return this.events.filter(event => new Date(event.createdAt) > firstDay && new Date(event.createdAt) < lastDay).length;
            },
            show(id, date) {
                this.$emit('show', {id, date})
            },
            isToday(d) {
                const today = moment(new Date()).format('YYYY-MM-DD');
                d = moment(d).format('YYYY-MM-DD');
                return !!(today === d);
            },
        }
    }
</script>