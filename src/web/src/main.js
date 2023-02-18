import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import * as VueGoogleMaps from 'vue2-google-maps'

import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCqpcmysOABHsnAgAaWfFMhRUfNyi3hLSc',
    libraries: 'places',
  },  

})

axios.defaults.withCredentials = false

new Vue({
  router,
  store,
  vuetify,
  VueGoogleMaps,
  render: h => h(App)
}).$mount("#app");
