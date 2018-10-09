<template>
    <div>
        <div class="select" ref="select">
            <label class="form__label">{{ label }}</label>
            <button type="button" class="select__button" :id="id" @click="active = true">{{ selected }}</button>
            <span class="material-icons select__caret" aria-hidden="true">keyboard_arrow_down</span>
            <transition name="fadeIn">
                <ul class="select__ul" v-if="active">
                    <li :class="['select__li', (selectedId === item._id) ? 'select__li--active' : '']" v-for="item in items" :key="item._id" :id="item._id" @click="change(item._id, item.name)">{{ item.name }}</li>
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
            }
        },
        data() {
            return {
                active: false,
                selected: '',
                selectedId: ''
            }
        },
        created() {
            document.addEventListener('click', this.documentClick);
        },
        destroyed() {
            document.removeEventListener('click', this.documentClick)
        },
        methods: {
            change(id, name) {
                this.active = false;
                this.selected = name;
                this.selectedId = id;
                this.$parent.training.trainingType = id;
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