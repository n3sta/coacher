<template>
	<div>
		<div class="row">
			<div class="col-sm-6 col-xs-12">
				<v-statistic></v-statistic>
			</div>
			<div class="col-sm-6 col-xs-12">
				<v-nextStart></v-nextStart>
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
	import moment from 'moment';
	import Statistic from './Statistic';
	import nextStart from './nextStart';
	import Calendar from '../../components/Calendar';
	import { get } from '../../helpers/api';
    import store from '../../store';

    export default {
    	data() {
    		return {
    			user: store.getters.user,
    			notifications: [],
    			messages: [],
    			trainings: {}
    		}
    	},
    	components: {
    		'v-statistic': Statistic,
    		'v-nextStart': nextStart,
    		'v-calendar': Calendar
    	},
    	mounted() {
    		this.getNotifications();
    		this.getLastTraining();
    	},
    	methods: {
    		getNotifications() {
    			get(`/notifications`, {
	                user: this.user.userId
	            }).then((res) => {
	                this.messages = res.data;
	            });
    		},
    		getLastTraining() {
    			get('/trainings', {
    				user: this.user.userId,
    				createdAt: {
    					$gte: new Date(moment().startOf('day')),
    					$lte: new Date(moment().endOf('day'))
    				}
    			}).then((res) => {
    				this.trainings = res.data;
    			})
    		},
    		
    	}
    }
</script>