<template>
	<div>
		<div class="box">
			<div class="box__title">
				<span class="box__title-name">Realizacja planu treningowego</span>
			</div>
			<div class="box__content">
				<div class="progress">
					<div class="progress__line">
						<div class="progress__done" :style="`width: ${stats.planPercent}%`"></div>
					</div>
					<div class="progress__percent">{{ planDoneAnimated }}%</div>
				</div>
				<div class="row">
					<div class="stats col-xs-12 col-sm-6">
						<span class="stats__data">{{ weekDoneAnimated }}/{{ stats.week }}</span>
						<span class="stats__name">Obecny tydzień [km]</span>
					</div>
					<div class="stats col-xs-12 col-sm-6">
						<span class="stats__data">{{ monthDoneAnimated }}/{{ stats.month }}</span>
						<span class="stats__name">Obecny miesiąc [km]</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { get } from '../../helpers/api';
	import store from '../../store';
    import { TweenLite } from "gsap/TweenLite";

    export default {
		data() {
			return {
				user: store.getters.user,
				stats: store.getters.stats,
                weekDoneTweened: store.getters.stats.weekDone,
                monthDoneTweened: store.getters.stats.monthDone,
                planDoneTweened: store.getters.stats.planPercent
			}
		},
        computed: {
            weekDoneAnimated: function() {
                return this.weekDoneTweened.toFixed(0);
            },
            monthDoneAnimated: function() {
                return this.monthDoneTweened.toFixed(0);
            },
            planDoneAnimated: function() {
                return this.planDoneTweened.toFixed(0);
            }
        },
        watch: {
            'stats.planPercent': function(value) {
                TweenLite.to(this.$data, 0.5, { planDoneTweened: value });
            },
            'stats.weekDone': function(value) {
                TweenLite.to(this.$data, 0.5, { weekDoneTweened: value });
            },
            'stats.monthDone': function(value) {
                TweenLite.to(this.$data, 0.5, { monthDoneTweened: value });
            }
        },
		created() {
			this.getStatistic();
		},
		methods: {
			getStatistic() {
                get(`/trainings/stats`, {user: this.user._id, date: new Date()}).then((res) => {
                    this.stats = res.data;
                    res.data.planPercent = this.calculate();
                    store.dispatch('setStats', res.data);
                });
            },
            calculate() {
                return this.stats.planPercent = ((this.stats.planDone/this.stats.plan || 0)*100).toFixed(2)*1;
            }
		}
	}
</script>