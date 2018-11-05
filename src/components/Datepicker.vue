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

<style>
    .mx-calendar .mx-calendar-content .cell.actived {
        background-color: #1565C0;
    }
    .mx-calendar .mx-calendar-content .cell:hover {
        background-color: #F2F2F2;
    }
    .mx-calendar .mx-panel-date td.today {
        font-weight: 600;
    }
    .mx-input {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        border: 1px solid #e5e6e7;
        width: 100%;
        padding: 30px 9px 6px;
        height: auto;
        -webkit-appearance: none;
        transition: .3s cubic-bezier(.25,.8,.5,1);
        border-radius: 0;
        color: #626262;
        box-shadow: none;
    }
    .mx-datepicker {
        color: #626262;
    }
    .mx-input-icon {
        margin-top: 1px;
        font-size: 18px;
        color: #F54D41;
    }
</style>