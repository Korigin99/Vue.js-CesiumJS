import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import store from "./store";

import axios from "axios";


loadFonts()


const app = createApp(App);
app.use(vuetify);
app.use(store);

app.config.globalProperties.$axios = axios;

app.mount('#app');




