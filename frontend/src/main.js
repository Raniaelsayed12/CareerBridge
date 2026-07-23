import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(Vue3Toastify, {
  autoClose: 2500,
  position: toast.POSITION.TOP_RIGHT,
});

app.mount("#app");