<template>
  <v-app>
    <!-- <v-navigation-drawer
      v-bind:app="hasSidebar"
      permanent
      :expand-on-hover="hasSidebarClosable"
      clipped
      color="#f1f1f1"
      v-bind:class="{ 'd-none': !hasSidebar }"
    >
      <v-list dense nav style="" class="mt-4">
        <v-list-item
          link
          nav
          v-bind:title="section.name"
          v-bind:to="section.url"
          v-for="section in sections"
          v-bind:key="section.name"
        >
          <v-list-item-icon>
            <v-icon>{{ section.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ section.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar
      elevation="2"
      app
      color="#fff"
      flat
      height="70"
    >
    <div class="header-container">
      <v-row align-content="space-between">
      <!-- <v-icon color="#f3b228" class="mr-5">{{ applicationIcon }}</v-icon> -->
      <img src="/yukon.svg" style="margin: -8px 155px 0 0" height="44" />
      <v-toolbar-title>
        <!-- <span style="font-weight: 700">{{ applicationName }}</span> -->

        <v-progress-circular
          :class="loadingClass"
          indeterminate
          color="#f3b228"
          size="20"
          width="2"
          class="ml-4"
        ></v-progress-circular>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- <v-label dark>License Year:</v-label>
      <v-select
        v-model="licenseYear"
        smaller
        :items="licenseYears"
        dense
        style="margin-left: 15px; max-width: 150px; margin-right: 20px"
        hide-details
      ></v-select> -->

      <div v-if="isAuthenticated">
        <span>{{ username }}</span>
        <v-menu bottom left class="ml-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn retain-focus-on-click color="black"  plain  v-bind="attrs" v-on="on">
              <!-- <v-icon color="black" large>mdi-menu</v-icon> -->
              <img class="mr-4" style="width:30px;" src='../public/m.svg'/>
              <a style="color:black; text-transform: none;">Menu</a>
            </v-btn>
          </template>
          
          <v-list dense style="min-width: 200px">
            <v-list-item to="/profile">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-exit-run</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <router-link to="/sign-in">Sign in</router-link>
      </div>
    </v-row>
    </div>
      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon> -->
    </v-app-bar>

    <v-main v-bind:style="{ 'padding-left: 33px !important': !hasSidebar }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid id="container-main">
        <v-row id="container-row">
          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- <div class="container text-center">
      <img src="/Aurora-mini.svg" style="margin: 5% 0px 3% 0px" height="44" />
    </div> -->

      <v-footer
        class="mt-16"
        flat
        style="z-index: 10"
        padless
        height="70"
      >
        <v-card
          class="flex "
          flat
          tile
        >
          <v-card-title class="py-16 header-container"  id="footer-bg">
            <img src="/logo-white.svg" style="margin: -8px 155px 0 0" height="44"/>
          </v-card-title>
          <v-divider></v-divider>
          <v-card class="footer-details">

            <div class="header-container d-flex justify-space-between">

              <div class="d-flex flex-column pa-2 width-100">
                <a href="https://yukon.ca/">Government of Yukon</a>
                <a href="https://yukon.ca/en/copyright">Copyright</a>
                <a href="https://yukon.ca/en/disclaimer">Disclaimer</a>
                <a href="https://yukon.ca/en/privacy-statement">Privacy statement</a>
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
  computed: {
    ...mapState("isAuthenticated"),
    username() {
      return store.getters.fullName;
    },
    isAuthenticated() {
      return store.getters.isAuthenticated;
    }
  },
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
  created: async function() {
    await store.dispatch("checkAuthentication");
    //this.username = store.getters.fullName
    console.log(this.isAuthenticated);

    if (!this.isAuthenticated) this.hasSidebar = false;
    else this.hasSidebar = config.hasSidebar;
  },
  watch: {
    isAuthenticated: function(val) {
      if (!val) this.hasSidebar = false;
      else this.hasSidebar = config.hasSidebar;
    }
  },
  methods: {
    nav: function(location) {
      router.push(location);
      console.log(location);
    },
    toggleHeader: function() {
      this.headerShow = !this.headerShow;
    },
    toggleMenu: function() {
      this.menuShow = !this.menuShow;
    },
    signOut: function() {
      store.dispatch("signOut");
      router.push("/");
    }
  }
};
</script>

<style>
  .v-toolbar--flat {
  box-shadow: 1px 0px 7px 4px rgba(0,0,0,0.24) !important;
  -webkit-box-shadow: 1px 0px 7px 4px rgba(0,0,0,0.24) !important;
  -moz-box-shadow: 1px 0px 7px 4px rgba(0,0,0,0.24) !important;
  }

  .header-container{
    width: 100%;
    margin: 0 auto;
    padding: 12px 24px;
  }

  @media (min-width:1180px){
    .header-container {
      width:1180px;
    }
  }

  .flex-end{
  display: flex;
  justify-content: start;
  align-items: center;
  align-content: center;
}
 .v-text-field >>> fieldset {
  border: 1.5px solid #F3A901;
}
.index-text{
  text-decoration: underline;
  color: #000000 !important;
}

.divisions-text {
  color: #0097A9 !important;
  font-size: 16px !important;
  font-weight: 100 !important;
  text-decoration: underline;
}
.v-banner span {
  font-weight: 700;
}

.full-width{
  width: 110%;
  margin-left: -5%;

}

.yellow-border{
  border-bottom:3px #f3b228 solid;
}
.white-bg {
  background-color: white;
}
.gray-bg {
  background-color: #EDEDED;
}
@media (min-width: 1180px){
  .full-width{
  width: 500%;
  margin-left: -200%;
  
}

  .contentt {
    width: 1180px !important;
  }
}

.contentt {
  width:92%;
  padding: 12px 24px;
}



@media (max-width: 755px){
  .search-responsive {
  padding: 12px 24px !important;
  
  margin: 0 auto !important; 
  width: 90%;
}
  
}

.width-100 {
  width: 100%;
}

</style>
