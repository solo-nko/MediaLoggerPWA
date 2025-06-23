import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style/style.scss";
import { router } from "../.plugins/router.ts";
import vuetify from "../.plugins/vuetify.ts";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount("#app");
