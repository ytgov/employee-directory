<template>
  <v-app>
    <v-app-bar style="

box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
-webkit-box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
-moz-box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
    
    " color="#fff" flat height="77" max-height="77" class="shadow">
    <v-container class="px-0">
      <div class="header-container">
        <v-row align-content="space-between" align="center">
          <a href="https://yukon.ca/"><img src="/yukon.svg" style="margin-top:10px;" height="63" /></a>
          <v-toolbar-title>
            <v-progress-circular :class="loadingClass" indeterminate color="#f3b228" size="20" width="2"
              class="ml-4"></v-progress-circular>
          </v-toolbar-title>
          
          <div>
          </div>
        </v-row>
      </div>
      </v-container>
    </v-app-bar>

    <v-main :class="{ 'no-bg-img': noBgImg === false }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid id="container-main">
        <v-row id="container-row">
          <v-col>
            <router-view @changeBg="changeBackground"></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FeedbackForm/>
    <v-footer class="mt-16" flat style="z-index: 10" padless height="70">
      <v-card class="flex " flat tile>
        <v-card-title class="py-16 header-container full-width" id="footer-bg">
          <v-container class="small-container">
            <img src="/logo-white.svg" style="margin: -8px 155px 0 0" height="44" />
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        
        <v-card class="footer-details">
          <v-container class="px-3 px-md-0">

          <div class="d-flex justify-space-between">

            <div class="d-flex flex-column pa-2">
              <a target="_blank" href="https://yukon.ca/">Government of Yukon</a>
              <a target="_blank" href="https://yukon.ca/en/copyright">Copyright</a>
              <a target="_blank" href="https://yukon.ca/en/disclaimer">Disclaimer</a>
              <a target="_blank" href="https://yukon.ca/en/privacy-statement">Privacy statement</a>
            </div>
            <v-card-text class="white--text text-right">
              <span>?? {{ new Date().getFullYear() }} <a href="/">Government of Yukon</a></span>
            </v-card-text>
          </div>
        </v-container>
        </v-card>
        
      </v-card>
    </v-footer>

  </v-app>
</template>

<script>
import router from "./router";
//import { mapState } from "vuex";
import store from "./store";
import * as config from "./config";
import { mapState } from "vuex";
import IconLoader from "./components/icons/IconLoader.vue";
import FeedbackForm from "./components/UI/FeedbackForm.vue";

export default {
    name: "App",
    data: () => ({
        noBgImg: false,
        dialog: false,
        drawer: null,
        drawerRight: null,
        headerShow: false,
        menuShow: false,
        loadingClass: "d-none",
        applicationName: config.applicationName,
        applicationIcon: config.applicationIcon,
        sections: config.sections,
    }),
    created: async function () {
    },
    watch: {},
    methods: {
        changeBackground() {
            this.noBgImg = false;
        },
        nav: function (location) {
            router.push(location);
        },
        toggleHeader: function () {
            this.headerShow = !this.headerShow;
        },
        toggleMenu: function () {
            this.menuShow = !this.menuShow;
        },
    },
    components: { IconLoader, FeedbackForm }
};
</script>

<style>
.menu-button {
  color: black !important;
  font-weight: 500;
}

.no-bg-img {
  background: white !important;
}

.header-container {
  width: 100%;
  margin: 0 auto;
  padding: 12px 24px;
}

@media (min-width:1070px) {
  .header-container {
    width: 1170px;
  }
}

.flex-end {
  display: flex;
  justify-content: start;
  align-items: center;
  align-content: center;
}

.v-text-field>>>fieldset {
  border: 1.5px solid #F3A901;
}

.v-app-bar,
.shadow {
  box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
  -webkit-box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
  -moz-box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
}

.v-app-bar {
  z-index: 10000;
}

.search-header {
  z-index: 2;
}

.index-text {
  text-decoration: underline;
  color: #000000 !important;
}

.divisions-text {
  color: #0097A9 !important;
  font-size: 16px !important;

  text-decoration: underline;
}

.v-banner span {
  font-weight: 700;
}

.full-width {
  width: 100vw;
  position: relative;
  left: calc(-50vw + 50%);
}


.yellow-border {
  border-bottom: 3px #ffcd57 solid;
}

.white-bg {
  background-color: white;
}

.gray-bg {
  background-color: #EDEDED;
}

@media (min-width: 1170px) {
  .container-content {
    width: 1170px !important;
  }
}

.container-content {
  width: 100%;
  padding: 12px 24px;
}



@media (max-width: 755px) {
  .search-responsive {
    padding: 12px 24px !important;

    margin: 0 auto !important;
    width: 90%;
  }

}

.width-100 {
  width: 100%;
}

.data-header {
  background-color: #DC4405;
  text-align: left;
  color: white;
}

.table-body td {
  padding: 1rem 1rem !important;
}

.table-body a {
  text-decoration: underline;
}

.table-body-managers {
  font-weight: 700;
}

.table-body .employees a {
  padding-left: 1rem !important;
}

.table-body .table-border {
  border-bottom: none !important;
}

.table-body tr:nth-child(odd) {
  background-color: #EDEDED;
}

@media (min-width: 1904px) {
  .small-container {
    max-width: 1185px !important;
  }
}
</style>
