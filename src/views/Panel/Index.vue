<template>
	<v-app>
		<v-container fluid grid-list-md>
			<v-statistic></v-statistic>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card>
						<v-card-title>
							<h3 class="headline mb-0">Aktualne aktywności</h3>
				        </v-card-title>
				        <v-card-text>
				        	<v-calendar 
								:miniCalendar="1">
							</v-calendar>
				        </v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-app>
</template>

<script>
	import moment from 'moment';
	import Statistic from './Statistic';
	import Calendar from '../../components/Calendar';
	import {get,post} from '../../helpers/api';
	import Auth from '../../helpers/auth';

    export default {
    	data() {
    		return {
    			user: Auth,
    			notifications: [],
    			messages: [],
    			trainings: {}
    		}
    	},
    	components: {
    		'v-statistic': Statistic,
    		'v-calendar': Calendar
    	},
    	mounted() {
    		this.getNotifications();
    		this.getLastTraining();
    	},
    	methods: {
    		getNotifications() {
    			get(`/notifications`, {
	                user: localStorage.getItem('userId')
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