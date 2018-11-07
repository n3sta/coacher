<template>
    <div>
        <div @click.stop="active = true">
            <v-button>Menu</v-button>
        </div>
        <div class="select" ref="dropdown">
            <transition name="fadeIn">
                <slot v-if="active"></slot>
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: false,
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
                if (dropdown.contains(e.target) || this.active) {
                    this.active = false
                }
            }
        }
    }
</script>