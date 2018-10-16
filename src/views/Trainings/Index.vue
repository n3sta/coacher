<template>
    <div>
        <div class="box">
            <div class="box__content">
                <v-calendar></v-calendar>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '../../store';
    import Calendar from './Calendar';

    export default {
        data() {
            return {
                user: store.getters.user,
            }
        },
        components: {
            'v-calendar': Calendar,
        },
    }
</script>