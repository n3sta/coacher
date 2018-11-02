<template>
    <v-modal :show="show" @cancel="cancel">
        <div class="box modal__box">
            <div class="box__title">
                <div class="box__title-name">Opcje listy rozwijalnej</div>
            </div>
            <div class="box__content">
                <p>Dodaj wszystkie opcje wyboru dla listy rozwijalnej po czym kliknij przycisk "Zatwierdź". Kolejne opcje można dodawać za pomocą entera.</p>
            </div>
            <div class="box__content">
                <form @submit.prevent="addOption()">
                    <div class="form__box">
                        <v-input :id="'option'" :value="option" @input="option = $event" @keyup="$v.option.$touch()" ref="option">Opcja wyboru</v-input>
                        <div v-if="$v.option.$error">
                            <div class="form__error" v-if="!$v.option.required">To pole jest wymagane.</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" class="button--inline">Dodaj opcję</v-button>
                    </div>
                </form>
            </div>
            <div class="box__content">
                <div class="box__content box__content--no-padding" v-if="options.length">
                    <div class="list" ref="list">
                        <div class="list__item" v-for="(item, index) in options" :key="index">
                            <div class="list__item-content">
                                <div class="list__name">{{ item }}</div>
                            </div>
                            <div class="list__buttons">
                                <span class="material-icons text--red" aria-hidden="true" @click="deleteOption(index)">delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="touch && options.length < 2">
                    <div class="form__error">Lista rozwijalna musi mieć co najmniej 2 opcje. W przypadku jednej użyj pola tekstowego.</div>
                </div>
            </div>
            <div class="box__content">
                <div class="form__buttons">
                    <div class="spacer"></div>
                    <div @click="submit()">
                        <v-button type="button" :color="'blue'">Zatwierdź</v-button>
                    </div>
                </div>
            </div>
        </div>
    </v-modal>
</template>

<script>
    import { required, minLength } from 'vuelidate/lib/validators'
    import modal from '../../components/Modal';

    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            options: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                option: '',
                touch: false
            }
        },
        components: {
            'v-modal': modal,
        },
        methods: {
            addOption() {
                this.$v.option.$touch();
                if (this.$v.option.$invalid) {
                    return true;
                }
                this.options.push(this.option);
                this.$v.option.$reset();
                this.touch = false;
                this.option = '';
                this.$refs.option.focus();
            },
            submit() {
                this.touch = true;
                if (this.options.length < 2) {
                    return true;
                }
                this.$emit('done', this.options);
                this.cancel();
            },
            deleteOption(index) {
                this.options.splice(index, 1);
            },
            cancel() {
                this.options = [];
                this.$emit('cancel');
            }
        },
        validations: {
            option: {
                required,
            }
        }
    }
</script>