<template>
    <div class="box box--medium">
        <div class="box__title">
            <div class="box__title-name">Lista startów</div>
            <div @click="$router.push({name: 'addStart'})">
                <v-button color="blue">Dodaj start</v-button>
            </div>
        </div>
        <div class="box__content">
            <table class="table" v-if="items.length">
                <thead>
                    <tr>
                        <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item._id">
                        <td :data-title="headers[0]"><router-link :to="{name: 'editStart', params: {_id: item._id}}">{{ item.name }}</router-link></td>
                        <td :data-title="headers[1]">{{ item.distance }}km</td>
                        <td :data-title="headers[2]">{{ formatDate(item.date) }}</td>
                    </tr>
                </tbody>
            </table>
            <span v-else>Nie znaleziono startów</span>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { get } from '../../helpers/api';

    export default {
        data() {
            return {
                headers: ['Imię', 'Dystans', 'Data'],
                items: [],
            }
        },
        created() {
            this.getCompetitons();
        },
        computed: mapGetters(['user']),
        methods: {
            async getCompetitons() {
                const res = await get('/competitions');
                this.items = res.data;
            },
            formatDate(date) {
                return moment(date).format('DD-MM-YYYY')
            }
        },
    }
</script>