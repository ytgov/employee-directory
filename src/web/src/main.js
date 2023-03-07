import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";
import axios from "axios";
import 'leaflet/dist/leaflet.css';
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

axios.defaults.withCredentials = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
