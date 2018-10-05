<template>
	<div>
		<v-layout row wrap>
		<v-flex xs12 md4>
			<v-card>
		        <v-card-title>
					<h3 class="headline mb-0">Plan tygodniowy</h3>
		        </v-card-title>
		        <v-card-text>
			        <div class="text-xs-center">
					    <v-progress-circular
					      :rotate="360"
					      :size="100"
					      :width="15"
					      :value="weekPercent"
					      color="green">
					      {{ weekPercent }}%
					    </v-progress-circular>
					</div>
		    	</v-card-text>
	    	</v-card>
	    </v-flex>
	    <v-flex xs12 md4>
			<v-card>
		        <v-card-title>
					<h3 class="headline mb-0">Plan miesięczny</h3>
		        </v-card-title>
		        <v-card-text>
			        <div class="text-xs-center">
					    <v-progress-circular
					      :rotate="360"
					      :size="100"
					      :width="15"
					      :value="monthPercent"
					      color="primary">
					      {{ monthPercent }}%
					    </v-progress-circular>
					</div>
		    	</v-card-text>
	    	</v-card>
	    </v-flex>
	    <v-flex xs12 md4>
			<v-card>
		        <v-card-title>
					<h3 class="headline mb-0">Plan roczny</h3>
		        </v-card-title>
		        <v-card-text>
			        <div class="text-xs-center">
					    <v-progress-circular
					      :rotate="360"
					      :size="100"
					      :width="15"
					      :value="yearPercent"
					      color="orange">
					      {{ yearPercent }}%
					    </v-progress-circular>
					</div>
		    	</v-card-text>
	    	</v-card>
	    </v-flex>
		</v-layout>
	</div>
</template>

<script>
	import {get,post} from '../../helpers/api';
	import store from '../../store';

	export default {
		data() {
			return {
				user: store.getters.user,
				statistic: {
    				week: 0,
    				weekDone: 0,
    				month: 0,
    				monthDone: 0,
    				year: 0,
    				yearDone: 0
				},
				weekPercent: 0,
				monthPercent: 0,
				yearPercent: 0
			}
		},
		created() {
			this.getStatistic();
		},
		methods: {
			getStatistic() {
                get(`/trainings/stats`, {user: this.user.userId, date: new Date()}).then((res) => {
                    this.statistic = res.data;
                    this.calculate();
                });
            },
            calculate() {
                this.weekPercent = ((this.statistic.weekDone/this.statistic.week || 0)*100).toFixed(2)*1;
                this.monthPercent = ((this.statistic.monthDone/this.statistic.month || 0)*100).toFixed(2)*1;
                this.yearPercent = ((this.statistic.yearDone/this.statistic.year || 0)*100).toFixed(2)*1;
            }
		}
	}
</script>