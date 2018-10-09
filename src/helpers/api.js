import axios from 'axios';
import qs from 'qs';
import store from '../store';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8081',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use((config) => {
    config.headers['x-access-token'] = store.getters.user.token;
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        store.dispatch('logout');
    }
    if (error.response.status === 500) {
        store.dispatch('setSnackbar', {
            color: 'red', 
            text: 'Błąd serwera. Prosimy spróbować później.'
        });
    }
    return Promise.reject(error.response);
});

export function get(url, payload) {
    const query = (payload) ? `?${qs.stringify(payload)}` : '';
    return instance({
        method: 'GET',
        url: `${url}${query}`
    })
}

export function post(url, payload) {
    return instance({
        method: 'POST',
        url: url,
        data: payload
    })
}

export function put(url, payload) {
    return instance({
        method: 'PUT',
        url: url,
        data: payload
    })
}

export function patch(url, payload) {
    return instance({
        method: 'PATCH',
        url: url,
        data: payload
    })
}

export function del(url) {
    return instance({
        method: 'DELETE',
        url: url
    })
}

export function pdf(url, payload) {
    return axios({
        method: 'POST',
        data: payload,
        responseType: 'blob',
    })
}