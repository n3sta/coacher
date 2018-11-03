<template>
    <div>
        <div class="box box--medium">
            <div class="box__title">
                <div class="box__title-name">Typy treningów</div>
            </div>
            <div class="box__content">
                <p>Uwaga! Wszystkie treningi z wybranym nieaktywnym typem nie zostaną wyświetlone w systemie i nie będzie możliwości dodania treningu z takim typem.</p>
            </div>
            <div class="box__content box__content--no-padding" v-if="types">
                <div class="list">
                    <div class="list__item">
                        <div class="list__item-content">
                            <span class="list__name bold">Nazwa treningu</span>
                        </div>
                        <div>
                            <p class="bold">Aktywny</p>
                        </div>
                    </div>
                    <div class="list__item" v-for="item in types" :key="item._id">
                        <div class="list__item-content">
                            <span class="list__name">{{ item.name }}</span>
                        </div>
                        <div class="list__buttons">
                            <v-checkbox :id="`active${item._id}`" :checked="item.active" @change="changeActive($event, item._id)"></v-checkbox>
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
    import { mapGetters } from 'vuex';
    import { get, put } from '../../helpers/api'

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
            async getTypes() {
                const res = await get(`/trainingTypes`, {user: this.user._id});
                this.types = res.data;
            },
            async changeActive(value, _id) {
                await put(`/trainingTypes/${_id}`, {active: value});
                this.getTypes();
            }
        }
    }
</script>