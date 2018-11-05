<template>
    <div class="box box--fill">
        <div class="box__title">
            <span class="box__title-name">Najbliższy start</span>
        </div>
        <div class="box__content">
            <div class="competition" v-if="competition">
                <p class="competition__name">{{ competition.name }}</p>
                <div class="row">
                    <div class="stats col-sm-6 col-xs-6">
                        <span class="stats__data">{{ competition.distance }}</span>
                        <span class="stats__name">Dystans [km]</span>
                    </div>
                    <div class="stats col-sm-6 col-xs-6">
                        <span class="stats__data">{{ date }}</span>
                        <span class="stats__name">Data</span>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>Nie dodano żadnego startu</p>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { get } from '../../helpers/api';

    export default {
        data() {
            return {
                competition: {}
            }
        },
        computed: {
            date() {
                return moment(this.competition.createdAt).format('DD-MM-YYYY');
            }
        },
        created() {
            this.getCompetiton();
        },
        methods: {
            async getCompetiton() {
                const res = await get('/competitions', {limit: 1});
                this.competition = res.data[0] || null;
            }
        }
    }
</script>