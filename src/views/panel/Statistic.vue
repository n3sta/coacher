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
					<div class="progress__percent">{{ planPercentAnimated }}%</div>
				</div>
				<div class="row">
					<div class="stats col-sm-6 col-xs-6">
						<span class="stats__data">{{ planDoneAnimated }}</span>
						<span class="stats__name">Zrealizowane treningi</span>
					</div>
					<div class="stats col-sm-6 col-xs-6">
						<span class="stats__data">{{ planAnimated }}</span>
						<span class="stats__name">Zlecone treningi</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
	import { get } from '../../helpers/api';
    import { TweenLite } from "gsap/TweenLite";

    export default {
        data() {
            return {
                planPercent: 0,
                planTweened: 0,
                planDoneTweened: 0
            }
        },
        computed: {
            ...mapGetters(['calendar', 'stats']),
            monthDoneTweened() {
                return this.stats.monthDone
            },
            planPercentAnimated: function() {
                return this.planPercent.toFixed(0);
            },
            planAnimated: function() {
                return this.planTweened.toFixed(0);
            },
            planDoneAnimated: function() {
                return this.planDoneTweened.toFixed(0);
            }
        },
        watch: {
            'planPercent': function(value) {
                TweenLite.to(this.$data, 0.5, { planPercent: value });
            },
            'stats.plan': function(value) {
                TweenLite.to(this.$data, 0.5, { planTweened: value });
            },
            'stats.planDone': function(value) {
                TweenLite.to(this.$data, 0.5, { planDoneTweened: value });
            },
            'calendar.user'() {
                this.getStatistic();
            }
        },
        created() {
            this.getStatistic();
        },
        methods: {
            ...mapActions(['setStats']),
            async getStatistic() {
                const res = await get(`/trainings/stats`, {user: this.calendar.user, date: new Date()});
                this.setStats(res.data);
                this.planPercent = this.calculate();
            },
            calculate() {
                return this.planPercent = ((this.stats.planDone/this.stats.plan || 0)*100).toFixed(2)*1;
            }
        }
    }
</script>