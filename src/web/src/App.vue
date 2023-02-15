<template>
  <v-app>
    <v-app-bar style="

box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
-webkit-box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
-moz-box-shadow: 1px 3px 3px 0px rgba(163,163,163,0.33) !important;
    
    " color="#fff" flat app height="86" class="shadow">
      <div class="header-container">
        <v-row align-content="space-between" align="center">
          <a href="/"><img src="/yukon.svg" style="margin-top:10px;" height="63" /></a>
          <v-toolbar-title>
            <v-progress-circular :class="loadingClass" indeterminate color="#f3b228" size="20" width="2"
              class="ml-4"></v-progress-circular>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-card class="d-flex align-center" color="transparent" outlined>
            <a class="mb-0 pr-7 menu-button" style="cursor:pointer;">Français</a>
            <IconLoader class="pl-7 pr-5" height="30px" :image="'menu'" :color="black" style="cursor:pointer; border-radius: 0; border-left: 1px solid #f1f1f1;"/>
            <a style="cursor:pointer;" class="mb-0 menu-button">Menu</a>
          </v-card>
          
          <div>
          </div>
        </v-row>
      </div>
    </v-app-bar>

    <v-main :class="{ 'no-bg-img': noBgImg === true }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid id="container-main">
        <v-row id="container-row">
          <v-col>
            <router-view @changeBg="changeBackground"></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="mt-16" flat style="z-index: 10" padless height="70">
      <v-card class="flex " flat tile>
        <v-card-title class="py-16 header-container full-width" id="footer-bg">
          <v-container class="small-container">
            <img src="/logo-white.svg" style="margin: -8px 155px 0 0" height="44" />
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <v-card class="footer-details">

          <div class="header-container d-flex justify-space-between">

            <div class="d-flex flex-column pa-2 width-100">
              <a target="_blank" href="https://yukon.ca/">Government of Yukon</a>
              <a target="_blank" href="https://yukon.ca/en/copyright">Copyright</a>
              <a target="_blank" href="https://yukon.ca/en/disclaimer">Disclaimer</a>
              <a target="_blank" href="https://yukon.ca/en/privacy-statement">Privacy statement</a>
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
import IconLoader from "./components/icons/IconLoader.vue";

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
            this.noBgImg = true;
        },
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
    },
    components: { IconLoader }
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

.v-app-bar,
.shadow {
  box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
  -webkit-box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
  -moz-box-shadow: 1px 3px 16px 0px rgba(163, 163, 163, 1) !important;
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

body .aurora-town {
  position: relative;
  z-index: -1;
  margin-top: -6px
}

body .aurora--main {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 50px;
  -webkit-transition: all .4s ease;
  -o-transition: all .4s ease;
  transition: all .4s ease
}

@media (min-width:767px) {
  body .aurora--main {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 200px;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease
  }
}

body .aurora--main:before {
  position: absolute;
  top: 0;
  right: -100px;
  display: block;
  overflow: hidden;
  width: 300px;
  height: 50px;
  content: "";
  -webkit-transition: all .4s ease;
  -o-transition: all .4s ease;
  transition: all .4s ease;
  background-image: url(../public/Aurora-small-mobile.svg);
  background-repeat: no-repeat
}

@media (min-width:767px) {
  body .aurora--main:before {
    position: absolute;
    top: -30px;
    right: -60%;
    width: 100%;
    height: 185px;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease;
    background-image: url(../public/Aurora-main.svg);
    background-size: contain
  }
}

body .aurora--mini {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  padding: 50px 0
}

body .aurora--mini:before {
  position: relative;
  display: block;
  width: 260px;
  height: 45px;
  margin: 0 auto;
  content: "";
  background-image: url(../public/Aurora-main.svg);
  background-repeat: no-repeat
}
</style>
