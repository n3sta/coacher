<template>
    <div>
        <form class="form" @submit.prevent="submit()">
            <div class="box">
                <div class="box__title">
                    <span class="box__title-name">{{ action }}</span>
                </div>
                <div class="box__content">
                    <div class="form__box">
                        <v-input :type="'text'" :for="'name'" :value="form.name" id="name" @input="form.name = $event" @keyup="$v.form.name.$touch()">Nazwa</v-input>
                        <div v-if="$v.form.name.$error">
                            <div class="form__error" v-if="!$v.form.name.required">To pole jest wymagane.</div>
                            <div class="form__error" v-if="!$v.form.name.minLength">To pole musi mieć co najmniej {{ $v.form.name.$params.minLength.min }} znaki</div>
                        </div>
                    </div>
                    <div class="form__buttons">
                        <div class="spacer"></div>
                        <div @click="back()">
                            <v-button type="button" :color="'white'">Anuluj</v-button>
                        </div>
                        <v-button type="submit" :color="'blue'" :disabled="isProcessing" :loading="isProcessing">Dodaj</v-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { required, minLength } from 'vuelidate/lib/validators'
    import { get,post,del,put } from '../../helpers/api'

    export default {
        props: {
            _id: {
                type: String
            }
        },
        data() {
            return {
                form: {
                    user: null,
                    name: null
                },
                isProcessing: false
            }
        },
        created() {
            this.form.user = this.user._id;
            if (this._id) {
                this.getType();
            }
        },
        computed: {
            ...mapGetters(['user']),
            action() {
                return (this._id) ? 'Edycja typu treningu' : 'Dodawanie typu treningu';
            }
        },
        watch: {
            user() {
                this.form.user = this.user._id;
            }
        },
        methods: {
            async getType() {
                const res = await get(`/types/${this._id}`);
                this.form = res.data;
            },
            async submit() {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return false;
                }
                this.isProcessing = true;
                if (this._id) {
                    await put(`/types/${this._id}`, this.form)
                } else {
                    await post(`/types`, this.form)
                }
                this.back();
            },
            back() {
                this.$router.go(-1);
            },
            done(options) {
                this.addOption = false;
                this.form.options = options;
            },
        },
        validations: {
            form: {
                name: {
                    required,
                    minLength: minLength(3)
                }
            }
        }
    }
</script>