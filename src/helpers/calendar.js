import moment from 'moment';

export default {
    methods: {
        dayEvents(date) {
            return this.events.filter(event => moment(event.createdAt).format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD'));
        },
        monthEvents() {
            const firstDay = moment().startOf('month');
            const lastDay = moment().endOf('month');
            return this.events.filter(event => event.createdAt >= firstDay && event.createdAt <= lastDay);
        },
        addDay(d, x) {
            const days = (x > 0) ? 'days' : 'day';
            return moment(d).add(x, days);
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
        isEvent(d) {
            const events = this.events.filter(event => moment(event.createdAt).format('YYYY-MM-DD') === d);
            return !!(events.length == 0);
        },
        isPrevMonth(d) {
            const currDate = moment(this.currDate).format('M');
            const prevMonth = moment(d).format('M');
            return currDate > prevMonth;
        },
        isCurrMonth() {
            const currDate = moment(this.currDate).format('M');
            const currMonth = moment(d).format('M');
            return currMonth == currDate;
        },
        isNextMonth(d) {
            const currDate = moment(this.currDate).format('M');
            const nextMonth = moment(d).format('M');
            return currDate < nextMonth
        },
        setNextMonth() {
            this.currDate = moment(this.currDate).add(1, 'month');
            this.getEvents();
            this.drawCalendar();
        },
        setCurrMonth() {
            this.currDate = moment(this.currDate);
            this.getEvents();
            this.drawCalendar();
        },
        setPrevMonth() {
            this.currDate = moment(this.currDate).add(-1, 'month');
            this.getEvents();
            this.drawCalendar();
        },
        monthShortcut(d) {
            const date = new Date(d);
            const month = date.getMonth();
            return this.months[month];
        }
    }
}