import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style/style.scss';
import { router } from '../.plugins/router.ts';
import vuetify from '../.plugins/vuetify.ts';

const pinia = createPinia();

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount('#app');
