<template>
    <div>
        <div class="loading" v-if="loading">
            <div class="loading__logo">elanista.com</div>
            <div class="loading__loader">
                <svg class="spinner" width="44px" height="44px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
            <div class="loading__text">Wczytywanie...</div>
        </div>
        <div v-else>
            <header class="header">
                <div class="header__inner">
                    <button v-if="user.coach" type="button" class="button-icon aside-toggler" @click="showAside = !showAside">
                        <span class="material-icons" aria-hidden="true">dehaze</span>
                    </button>
                    <h1 class="header__logo"><router-link :to="{name: 'panel'}" class="header__link">elanista.pl</router-link></h1>
                </div>
                <div class="header__content">
                    <div class="notifications">
                        <button type="button" @click="$router.push({name: 'notifications'})" class="button-icon button-icon--on-blue notifications__button">
                            <span class="material-icons text--white" aria-hidden="true">notifications</span>
                            <span class="notifications__number" v-if="notificationAmount">{{ notificationAmount }}</span>
                        </button>
                    </div>
                    <div class="clearsystem" v-if="!user.activated && user.coach" @click="removeSampleData()">
                        <button type="button" class="button-icon clearsystem--icon"><span class="material-icons text--white">delete_forever</span></button>
                        <v-button class="clearsystem--button">Wyczyść system</v-button>
                    </div>
                    <v-dropdown v-if="!user.coach">
                        <ul class="select__ul">
                            <li @click="$router.push({name: 'account'})" class="select__li"><a>Ustawienia konta</a></li>
                            <li @click="logout" class="select__li"><a>Wyloguj</a></li>
                        </ul>
                    </v-dropdown>
                </div>
            </header>
            <main class="main">
                <aside v-if="user.coach" :class="['aside', (showAside) ? 'aside--show' : '']">
                    <div class="header__inner">
                        <button type="button" class="button-icon aside-toggler" @click="showAside = !showAside">
                            <span class="material-icons" aria-hidden="true">dehaze</span>
                        </button>
                        <h1 class="header__logo"><router-link :to="{name: 'panel'}" class="header__link">TheCoacher.com</router-link></h1>
                    </div>
                    <nav class="nav">
                        <ul class="nav__list">
                            <li class="nav__item"><router-link :to="{ name: 'panel' }" exact class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">home</span><span>Panel główny</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'pupils' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">group</span><span>Zawodnicy</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'questions' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">contact_support</span><span>Ankieta</span></router-link></li>
                            <li class="nav__item"><router-link :to="{ name: 'types' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">list</span><span>Typy treningów</span></router-link></li>
                            <hr class="nav__divider">
                            <li class="nav__item"><router-link :to="{ name: 'account' }" class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">person</span><span>Edytuj profil</span></router-link></li>
                            <li class="nav__item" @click="logout"><a class="nav__link"><span class="material-icons nav__icon" aria-hidden="true">exit_to_app</span><span>Wyloguj</span></a></li>
                        </ul>
                    </nav>
                </aside>
                <div :class="['content', (!user.coach) ? 'content--small' : '']">
                    <div v-if="!user.coach && !user.accepted" class="statement statement--warning">
                        <p>Twoje konto nie zostało jeszcze zaakceptowane przez trenera. Gdy to nastanie, zostaniesz o tym powiadomiony.</p>
                    </div>
                    <router-view></router-view>
                </div>
                <div :class="['overlay', (showAside) ? 'overlay--show' : '']" @click="showAside = !showAside"></div>
            </main>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { get, del } from './helpers/api';

    export default {
        data() {
            return {
                showAside: false,
            }
        },
        created() {
            this.getUser();
            this.getNotifications();
            if (localStorage.getItem('firstLogin')) {
                this.setAlert({
                    title: 'Witaj!',
                    body: 'Wypełniliśmy dla Ciebie system przykładowymi danymi w celu sprawdzenia jego możliwości. Gdy będziesz chciał zacząć pracę kliknij przycisk w prawym górym rogu ekranu.',
                    type: 'statement'
                }).then((confirmation) => {
                    if (confirmation) {
                        localStorage.removeItem('firstLogin')
                    }
                })
            }
        },
        watch: {
            '$route'() {
                this.showAside = false;
            },
            showAside() {
                if (this.showAside) {
                    document.body.classList.add('body--overflow');
                } else {
                    document.body.classList.remove('body--overflow');
                }
            }
        },
        computed: {
            ...mapGetters(['loading', 'user', 'notifications']),
            notificationAmount() {
                const amount = this.notifications.filter(item => !item.status).length
                return (amount < 10) ? amount : '9+';
            }
        },
        methods: {
            ...mapActions(['getUser', 'setAlert', 'logout', 'setNotifications']),
            async getNotifications() {
                const res = await get('/notifications', {notifier: this.user._id});
                this.setNotifications(res.data);
            },
            removeSampleData() {
                this.setAlert({
                    title: 'Czy jesteś pewny?',
                    body: 'System zostanie wyczyszczony z wszystkich przykładowych danych i bedzie gotowy do rozpoczęcia pracy.',
                    type: 'question'
                }).then(async (confirmation) => {
                    if (confirmation) {
                        await del('/auth/clean');
                        location.reload();
                    }
                })
            }
        }
    }
</script>