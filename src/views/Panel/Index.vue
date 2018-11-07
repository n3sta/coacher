<template>
	<div>
		<v-switch-users v-if="user.coach"></v-switch-users>
		<div class="row">
			<div class="col-xs-12 col-sm-12">
				<v-statistic></v-statistic>
			</div>
		</div>
		<div class="box">
			<div class="box__content">
				<v-trainings :miniCalendar="1"></v-trainings>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import Statistic from './Statistic';
	import Trainings from '../Trainings/Index';
	import SwitchPupils from './../../components/SwitchPupils';

	export default {
		components: {
			'v-statistic': Statistic,
			'v-trainings': Trainings,
			'v-switch-users': SwitchPupils
		},
		computed: mapGetters(['user'])
	}
</script>