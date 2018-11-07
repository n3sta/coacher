<template>
    <div>
        <div class="dropdown" @click="active = !active" ref="dropdown">
            <span class="dropdown__avatar">{{ initials }}</span>
            <span class="dropdown__active">{{ name }}</span>
            <span class="material-icons dropdown__caret" aria-hidden="true">keyboard_arrow_down</span>
            <transition name="fadeIn">
                <div class="dropdown__list" v-if="active">
                    <div>
                        <input type="radio" name="owner" :value="user._id" id="owner" class="dropdown__input">
                        <label for="owner" :class="['dropdown__item', (value === user._id) ? 'dropdown__item--active' : '']" @click="change(user._id)">{{ user.name.firstName }} {{ user.name.lastName }}</label>
                    </div>
                    <div v-for="item in pupils" :key="item._id">
                        <input type="radio" :value="item._id" :id="`pupil${item._id}`" class="dropdown__input">
                        <label :for="`pupil${item._id}`" :class="['dropdown__item', (value === item._id) ? 'dropdown__item--active' : '']" @click="change(item._id)">{{ item.name.firstName }} {{ item.name.lastName }}</label>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { get } from './../helpers/api';

    export default {
        data() {
            return {
                value: this.$store.state.user._id,
                active: false,
                pupils: []
            }
        },
        computed: {
            ...mapGetters(['user', 'calendar']),
            initials() {
                let user = this.pupils.filter(pupil => pupil._id === this.value)[0] || this.user;
                return `${user.name.firstName.charAt(0)}${user.name.lastName.charAt(0)}`;
            },
            name() {
                let user = this.pupils.filter(pupil => pupil._id === this.value)[0] || this.user;
                return `${user.name.firstName} ${user.name.lastName}`;
            }
        },
        created() {
            this.getPupils();
            document.addEventListener('click', this.documentClick);
        },
        destroyed() {
            document.removeEventListener('click', this.documentClick);
        },
        methods: {
            ...mapMutations(['setCalendar']),
            async getPupils() {
                const res = await get(`/users`, {coachId: this.user._id});
                this.pupils = res.data;
            },
            documentClick(e) {
                const dropdown = this.$refs.dropdown;
                if (dropdown !== e.target && !dropdown.contains(e.target)) {
                    this.active = false
                }
            },
            change(id) {
                this.active = false;
                this.value = id;
                this.setCalendar({user: id, date: this.calendar.date})
            }
        }
    }
</script>