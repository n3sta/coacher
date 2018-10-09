<template>
    <div class="checkbox">
        <input type="checkbox" class="checkbox__input" :id="id" :checked="checked" @change="$emit('change', $event.target.checked)">
        <label :for="id" class="checkbox__label">
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
            }
        }
    }
</script>