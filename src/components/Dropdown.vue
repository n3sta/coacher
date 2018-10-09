<template>
    <div>
        <div class="dropdown" @click="active = !active" ref="dropdown">
            <span class="dropdown__avatar">DJ</span>
            <span class="dropdown__active">Damian Jastrzębski</span>
            <span class="material-icons dropdown__caret" aria-hidden="true">keyboard_arrow_down</span>
            <transition name="fadeIn">
                <div class="dropdown__list" v-if="active" >
                    <div v-for="item in items" :key="item._id">
                        <input type="radio" :name="id" :value="item._id" :id="id" class="dropdown__input">
                        <label :for="id" :class="['dropdown__item', (value === item._id) ? 'dropdown__item--active' : '']" @click="change(item._id)">{{ item.name }}</label>
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
        created() {
            document.addEventListener('click', this.documentClick);
            this.items.unshift({name: 'Moj plan treningowy', _id: this.user.userId})
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