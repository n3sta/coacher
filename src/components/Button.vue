<template>
    <button type="button" :class="['button', `button--${color}`]" :disabled="disabled">
        <slot v-if="!loading"></slot>
        <svg v-else class="button__svg spinner" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
    </button>
</template>

<script>
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            color: {
                type: String
            }
        }
    }
</script>