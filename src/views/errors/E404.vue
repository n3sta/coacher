<template>
    <div class="error-page">
        <h1 class="error-page__title">Nie znaleziono takiej strony</h1>
        <router-link :to="{name: 'panel'}" class="error-page__link">Powrót do strony głównej</router-link>
    </div>
</template>

<style>
    .error-page {
        padding: 32px;
        text-align: center;
    }
    .error-page__title {
        font-size: 32px;
        margin-bottom: 32px;
    }
    .error-page__link {
        color: #1565C0;
    }
</style>