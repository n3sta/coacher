<template>
    <v-app id="inspire">
        <v-navigation-drawer class="aside" fixed :clipped="$vuetify.breakpoint.lgAndUp" app width="250">
            <v-list dense>
                <template>
                    <div class="calendar__nav">
                        <v-btn class="calendar__toggle" flat icon @click="setPrevMonth()">
                            <v-icon>keyboard_arrow_left</v-icon>
                        </v-btn>
                        <h2 class="title">{{ months[currDate.format('M')] }} {{ currDate.format('YYYY') }}</h2>
                        <v-btn class="calendar__toggle" flat icon @click="setNextMonth()">
                            <v-icon>keyboard_arrow_right</v-icon>
                        </v-btn>
                    </div>
                    <v-btn color="addPupil" @click="showList = true" v-show="!showList">Widok listy</v-btn>
                        <v-btn color="addPupil" @click="showList = false" v-show="showList">Widok kalendarza</v-btn>
                    <v-divider></v-divider>
                    <v-list subheader v-if="user.coach == 1">
                        <v-subheader>Plany treningowe</v-subheader>
                        <v-radio-group v-model="calendarUser" @change="getEvents()">
                            <v-radio label="Mój plan treningowy" :value="user.userId" color="primary"></v-radio>
                            <v-radio
                                    v-for="pupil in $store.state.pupils"
                                    :key="pupil._id"
                                    :label="pupil.login"
                                    :value="pupil._id"
                                    color="primary"
                            ></v-radio>
                        </v-radio-group>
                    </v-list>
                    <v-divider v-if="user.coach == 1"></v-divider>
                    <v-divider class="mt1" v-if="user.coach == 1"></v-divider>
                    <v-btn v-if="user.coach == 1" class="addPupil" @click="showPupil = true" color="grey lighten-3">
                        <v-icon left dark>add</v-icon>
                        Nowy zawodnik
                    </v-btn>
                    <v-btn v-if="user.coach == 1" class="addPupil" @click="showExport = true" color="grey lighten-3">
                        <v-icon left dark>picture_as_pdf</v-icon>
                        Exportuj do PDF
                    </v-btn>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-container fluid fill-height>
            <v-layout justify-center>
                <v-calendar
                    :miniCalendar="0"
                ></v-calendar>
            </v-layout>
        </v-container>
        <pupil
            v-if="showPupil"
        ></pupil>
        <export-pdf
            v-if="showExport"
        ></export-pdf>
    </v-app>
</template>

<script>
    import moment from 'moment';
    import Auth from '../../helpers/auth';
    import calendarHelpers from '../../helpers/calendar.js';
    import Pupil from '../../components/Pupil';
    import ExportPdf from '../../components/ExportPdf';
    import Calendar from '../../components/Calendar';

    export default {
        data() {
            return {
                showList: false,
                showPupil: false,
                showExport: false,
                months: ['Sty', 'Lut', 'Mar', 'Kwe', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                currDate: moment(),
                user: Auth.state,
                calendarUser: Auth.state.userId,
            }
        },
        mixins: [
            calendarHelpers
        ],
        components: {
            'pupil': Pupil,
            'export-pdf': ExportPdf,
            'v-calendar': Calendar
        },
    }
</script>