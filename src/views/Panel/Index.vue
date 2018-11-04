<template>
	<div>
		<div class="row">
			<div class="col-md-6 col-sm-12">
				<v-statistic></v-statistic>
			</div>
			<div class="col-md-6 col-sm-12">
				<v-start></v-start>
			</div>
		</div>
		<div class="box">
			<div class="box__title">
				<span class="box__title-name">Ostatnie aktywności</span>
			</div>
			<div class="box__content">
				<v-trainings v-bind:miniCalendar="1"></v-trainings>
			</div>
		</div>
	</div>
</template>

<script>
    import { mapGetters } from 'vuex';
	import moment from 'moment';
	import Statistic from './Statistic';
	import Start from './Start';
	import Trainings from '../Trainings/Index';
	import { get } from '../../helpers/api';

    export default {
    	components: {
    		'v-statistic': Statistic,
    		'v-start': Start,
    		'v-trainings': Trainings
    	},
    	computed: mapGetters(['user'])
    }
</script>