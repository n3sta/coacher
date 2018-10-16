<template>
    <div class="checkbox">
        <input type="checkbox" class="checkbox__input" v-model="value" :id="id" :checked="checked" :disabled="disabled" @change="change($event)">
        <label :for="id" :class="['checkbox__label', (disabled) ? 'checkbox__label--disabled' : '']">
            <span class="checkbox__span"></span>
            <ins class="checkbox__ins"><i class="checkbox__i"><slot></slot></i></ins>
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            id: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            value() {
                return this.checked;
            }
        },
        methods: {
            change(e) {
                this.$emit('change', e.target.checked);
            }
        }
    }
</script>