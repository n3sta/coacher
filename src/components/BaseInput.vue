<template>
    <div>
        <input :type="type" class="form__input" :value="value" :id="id" @input="$emit('input', $event.target.value)" @keyup="input()">
        <label :for="id" class="form__label" :data-filled="checkLength(value)"><slot></slot></label>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },
            id: {
                type: String
            },
            value: {
                default: null
            }
        },
        methods: {
            input() {
                this.$emit('keyup');
            },
            checkLength(value) {
                if (value === 0) return true;
                return Boolean(value);
            }
        }
    }
</script>