import Vue from "vue";
import Vuex from "vuex";
import i18n from "../i18n";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locale: "en"
  },
  getters: {
    locale: state => state.locale,
  },
  mutations: {
    SET_LOCALE: (state, value) => {
      state.locale = value;
    },
  },
  actions: {
    setLocale: ({ commit, getters }, locale) => {
      commit("SET_LOCALE", locale);
    },
  }
});
