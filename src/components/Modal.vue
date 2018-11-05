<template>
    <transition name="modal">
        <div class="modal" v-show="show">
            <div class="modal__content">
                <button type="button" class="modal__close button-icon" @click="cancel()"><span class="material-icons text--red" aria-hidden="true">close</span></button>
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean
            }
        },
        watch: {
            show() {
                if (this.show) {
                    document.body.classList.add('body--overflow');
                } else {
                    document.body.classList.remove('body--overflow');
                }
            }
        },
        mounted() {
            document.addEventListener("keydown", (e) => {
                if (this.show && e.keyCode === 27) {
                    this.cancel();
                }
            });
        },
        methods: {
            cancel() {
                this.$emit('cancel');
            }
        }
    }
</script>