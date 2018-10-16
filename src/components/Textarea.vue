<template>
    <div>
        <textarea class="form__textarea" :value="value" :id="id" rows="3" @input="$emit('input', $event.target.value)" @keyup="$emit('keyup')"></textarea>
        <label :for="id" class="form__label" :data-filled="Boolean(value)"><slot></slot></label>
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
                type: String,
                default: null
            },
        },
    }
</script>