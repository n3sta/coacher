<template>
	<div>
		<div class="box">
			<div class="box__title">
				<span class="box__title-name">Realizacja planu treningowego</span>
			</div>
			<div class="box__content">
				<div class="progress">
					<div class="progress__line">
						<div class="progress__done" :style="`width: ${planPercent}%`"></div>
					</div>
					<div class="progress__percent">{{ planDoneAnimated }}%</div>
				</div>
				<div class="row">
					<div class="stats col-sm-6 col-xs-6">
						<span class="stats__data">{{ weekDoneAnimated }}/{{ stats.week }}</span>
						<span class="stats__name">Obecny tydzień [km]</span>
					</div>
					<div class="stats col-sm-6 col-xs-6">
						<span class="stats__data">{{ monthDoneAnimated }}/{{ stats.month }}</span>
						<span class="stats__name">Obecny miesiąc [km]</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
	import { get } from '../../helpers/api';
    import { TweenLite } from "gsap/TweenLite";

    export default {
        data() {
            return {
                planPercent: 0,
                planDoneTweened: 0
            }
        },
        computed: {
            ...mapGetters(['user', 'stats']),
            weekDoneTweened() {
                return this.stats.weekDone
            },
            monthDoneTweened() {
                return this.stats.monthDone
            },
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
            'planPercent': function(value) {
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
            ...mapMutations(['setStats']),
            async getStatistic() {
                const res = await get(`/trainings/stats`, {user: this.user._id, date: new Date()});
                this.setStats(res.data);
                this.planPercent = this.calculate();
            },
            calculate() {
                return this.planPercent = ((this.stats.planDone/this.stats.plan || 0)*100).toFixed(2)*1;
            }
        }
    }
</script>