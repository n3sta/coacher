<template>
    <div>
        <div class="select" ref="select">
            <label class="form__label" :data-filled="Boolean(value)">{{ label }}</label>
            <button type="button" class="select__button" :id="id" @click="active = true">{{ selected }}</button>
            <span class="material-icons select__caret" aria-hidden="true">unfold_more</span>
            <transition name="fadeIn">
                <ul class="select__ul" v-if="active">
                    <li :class="['select__li', (value === item._id) ? 'select__li--active' : '']" v-for="(item, index) in items" :key="index" @click="change(item)">{{ item }}</li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String
            },
            id: {
                type: String
            },
            items: {
                type: Array
            },
            value: {
                default: null
            },
        },
        data() {
            return {
                active: false,
            }
        },
        computed: {
            selected() {
                const selected = this.items.filter(item => item === this.value)[0];
                return (selected) ? selected : '';
            }
        },
        created() {
            document.addEventListener('click', this.documentClick);
        },
        destroyed() {
            document.removeEventListener('click', this.documentClick);
        },
        methods: {
            change(item) {
                this.active = false;
                this.value = item;
                this.$emit('input', item);
                this.$emit('change');
            },
            documentClick(e) {
                const select = this.$refs.select;
                if (select !== e.target && !select.contains(e.target)) {
                    this.active = false
                }
            }
        }
    }
</script>