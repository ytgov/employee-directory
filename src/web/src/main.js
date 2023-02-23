import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";
import axios from "axios";
import * as VueGoogleMaps from 'vue2-google-maps'
import 'leaflet/dist/leaflet.css';
import * as config from "./config";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

/* Vue.directive("yk-btn", {
  bind: function (el) {
    el.style.backgroundColor = "#a000bb";
    el.style.color = "#fff";
    el.style.fontWeight = "400";
    el.style.textTransform = "none";
    el.style.borderRadius = "0"
  }
});

Vue.directive("yk-primary", {
  bind: function (el) {
    el.style.backgroundColor = "#a000bb";
    el.style.color = "#bbb";
    el.style.fontWeight = "700";
    el.style.textTransform = "lowercase";
  }
}); */


axios.defaults.withCredentials = false

new Vue({
  router,
  store,
  vuetify,
  VueGoogleMaps,
  render: h => h(App)
}).$mount("#app");
