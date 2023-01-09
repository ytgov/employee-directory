<template>
  <v-app>
    <v-app-bar elevation="2" app color="#fff" flat height="70">
      <div class="header-container">
        <v-row align-content="space-between">
          <img  src="/yukon.svg" style="margin: -8px 155px 0 0" height="44" />
          <v-toolbar-title>
            <v-progress-circular :class="loadingClass" indeterminate color="#f3b228" size="20" width="2"
              class="ml-4"></v-progress-circular>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div>
          </div>
        </v-row>
      </div>
    </v-app-bar>

    <v-main :class="{ active: isActive }" v-bind:style="{ 'padding-left: 33px !important': !hasSidebar }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid id="container-main">
        <v-row id="container-row">
          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="mt-16" flat style="z-index: 10" padless height="70">
      <v-card class="flex " flat tile>
        <v-card-title class="py-16 header-container" id="footer-bg">
          <img src="/logo-white.svg" style="margin: -8px 155px 0 0" height="44" />
        </v-card-title>
        <v-divider></v-divider>
        <v-card class="footer-details">

          <div class="header-container d-flex justify-space-between">

            <div class="d-flex flex-column pa-2 width-100">
              <a href="#">Government of Yukon</a>
              <a href="#">Copyright</a>
              <a href="#">Disclaimer</a>
              <a href="#">Privacy statement</a>
            </div>
            <v-card-text class="white--text text-right with-100">
              <span>© {{ new Date().getFullYear() }} <a href="/">Government of Yukon</a></span>
            </v-card-text>
          </div>
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

export default {
  name: "App",
  components: {},
  props: ['isActive'],
  data: () => ({

    dialog: false,
    drawer: null,
    drawerRight: null,
    headerShow: false,
    menuShow: false,
    loadingClass: "d-none",
    applicationName: config.applicationName,
    applicationIcon: config.applicationIcon,
    sections: config.sections,
    hasSidebar: false, //config.hasSidebar,
    hasSidebarClosable: config.hasSidebarClosable
  }),
  created: async function () {

  },
  watch: {

  },
  methods: {
    nav: function (location) {
      router.push(location);
      console.log(location);
    },
    toggleHeader: function () {
      this.headerShow = !this.headerShow;
    },
    toggleMenu: function () {
      this.menuShow = !this.menuShow;
    },
  }
};
</script>

<style>


.active {
  background: white !important;
}

.v-toolbar--flat {
  box-shadow: 1px 0px 7px 4px rgba(0, 0, 0, 0.24) !important;
  -webkit-box-shadow: 1px 0px 7px 4px rgba(0, 0, 0, 0.24) !important;
  -moz-box-shadow: 1px 0px 7px 4px rgba(0, 0, 0, 0.24) !important;
}

.header-container {
  width: 100%;
  margin: 0 auto;
  padding: 12px 24px;
}

@media (min-width:1180px) {
  .header-container {
    width: 1180px;
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
  border-bottom: 3px #f3b228 solid;
}

.white-bg {
  background-color: white;
}

.gray-bg {
  background-color: #EDEDED;
}

@media (min-width: 1180px) {
  .container-content {
    width: 1180px !important;
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

.bg-img {
  background-image: url(../public/Aurora-main.svg);
  background-repeat: no-repeat;
  background-position-x: 300px;
  background-position-y: center;
  transition: all .4s ease;
  background-size: contain;
}

@media (min-width: 1180px) {
  .bg-img {
    background-position-x: 130% !important;
    background-position-y: center;

  }
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
</style>
