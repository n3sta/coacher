<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Typy treningów</div>
            </div>
            <div class="box__content">
                <form @submit.prevent="submit()">
                    <div class="form__box">
                        <div class="form__box-helper">
                            <v-input :id="'trainingType'" :value="form.name" @input="form.name = $event" @keyup="$v.form.name.$touch()">Nazwa treningu</v-input>
                            <div v-if="$v.form.name.$error">
                                <div class="form__error" v-if="!$v.form.name.required">To pole jest wymagane.</div>
                            </div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <v-button type="submit" :color="'blue'" class="button--inline" :disabled="$v.form.name.$invalid || isProcessing" :loading="isProcessing">Dodaj</v-button>
                    </div>
                </form>
            </div>
            <div class="box__content box__content--no-padding" v-if="types">
                <div class="list">
                    <div class="list__item" v-for="item in types" :key="item._id">
                        <div class="list__item-content">
                            <span class="list__name">{{ item.name }}</span>
                        </div>
                        <div class="list__buttons">
                            <button class="button-icon" @click="deleteType(item._id)"><span class="material-icons text--red cursor" aria-hidden="true">delete</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="blank" v-else>
                <span>Nie znaleziono żadnych treningów</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { required, minLength } from 'vuelidate/lib/validators'
    import { get, post, del } from '../../helpers/api'

    export default {
        data() {
            return {
                form: {
                    name: ''
                },
                types: [],
                isProcessing: false
            }
        },
        created() {
            this.getTypes();
        },
        computed: mapGetters(['user']),
        methods: {
            ...mapActions(['setSnackbar']),
            async getTypes() {
                const res = await get(`/trainingTypes`, {user: this.user._id});
                this.types = res.data;
            },
            async deleteType(id) {
                await del(`/trainingTypes/${id}`);
                this.getTypes();
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                await post('/trainingTypes', {user: this.user._id, name: this.form.name});
                this.setSnackbar({class: 'success', text: 'Typ treningu został dodany.'});
                this.getTypes();
                this.isProcessing = false;
                this.form.name = '';
                this.$v.$reset();
            },
        },
        validations: {
            form: {
                name: {
                    required,
                    minLength: minLength(3)
                },
            }
        }
    }
</script>