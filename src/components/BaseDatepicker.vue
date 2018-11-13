<template>
    <div>
        <date-picker v-model="value" :class="type" :first-day-of-week="1" :format="format" placeholder="" :lang="lang" :type="type" @change="$emit('change', value)"></date-picker>
    </div>
</template>

<script>
    import DatePicker from 'vue2-datepicker'

    export default {
        props: {
            value: {
                default: () => new Date()
            },
            type: {
                type: String,
                default: null
            }
        },
        watch: {
            value() {

            }
        },
        computed: {
            format() {
                return (this.type === 'month') ? 'MMM YYYY' : 'YYYY-MM-DD'
            }
        },
        data() {
            return {
                lang: {
                    days: ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sb'],
                    months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                    pickers: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                }
            }
        },
        components: {
            'date-picker': DatePicker
        },
    }
</script>