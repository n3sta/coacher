<template>
    <div>
        <div class="dropdown" @click="active = !active" ref="dropdown">
            <span class="dropdown__avatar">{{ initials }}</span>
            <span class="dropdown__active">{{ name }}</span>
            <span class="material-icons dropdown__caret" aria-hidden="true">keyboard_arrow_down</span>
            <transition name="fadeIn">
                <div class="dropdown__list" v-if="active" >
                    <div>
                        <input type="radio" name="owner" :value="user._id" id="owner" class="dropdown__input">
                        <label for="owner" :class="['dropdown__item', (value === user._id) ? 'dropdown__item--active' : '']" @click="change(user._id)">{{ user.name.firstName }} {{ user.name.lastName }}</label>
                    </div>
                    <div v-for="item in items" :key="item._id">
                        <input type="radio" :name="id" :value="item._id" :id="id" class="dropdown__input">
                        <label :for="id" :class="['dropdown__item', (value === item._id) ? 'dropdown__item--active' : '']" @click="change(item._id)">{{ item.name.firstName }} {{ item.name.lastName }}</label>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import store from '../store';

    export default {
        props: {
            id: {
                type: String
            },
            items: {
                type: Array
            }
        },
        data() {
            return {
                active: false,
                value: null,
                user: store.getters.user
            }
        },
        computed: {
            initials() {
                let user = this.items.filter(pupil => pupil._id === this.value)[0] || this.user;
                return `${user.name.firstName.charAt(0)}${user.name.lastName.charAt(0)}`;
            },
            name() {
                let user = this.items.filter(pupil => pupil._id === this.value)[0] || this.user;
                return `${user.name.firstName} ${user.name.lastName}`;
            }
        },
        created() {
            document.addEventListener('click', this.documentClick);
        },
        destroyed() {
            document.removeEventListener('click', this.documentClick);
        },
        methods: {
            documentClick(e) {
                const dropdown = this.$refs.dropdown;
                if (dropdown !== e.target && !dropdown.contains(e.target)) {
                    this.active = false
                }
            },
            change(id) {
                this.active = false;
                this.value = id;
                this.$emit('change', id);
            }
        }
    }
</script>