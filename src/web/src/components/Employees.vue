<template>
  <div class="books">
    <SearchBarHeader class="z-indx" :info="this.findEmployeeHeaderInfo" />
    
    <Aurora/>

    <v-container class="px-0">
      <v-breadcrumbs class="mt-sm-6 mb-sm-0 breadcrumbs mt-16 mb-n8 px-0" :items="breadcrumbsList">

        <template v-slot:item="{ item }">

          <v-breadcrumbs-item :href="item.link">
            {{ item.name }}
          </v-breadcrumbs-item>

        </template>
      </v-breadcrumbs>
      <v-row class="mb-6 mt-16">
        <v-col cols="12" md="4" sm="6" xs="12" v-for='(items, index, id) in item' :key="id">
          <v-hover v-slot="{ hover }">
            <v-card :href="indexUrl(index, items)" class="mx-auto employee-division-card" max-width="344" outlined>
              <v-card class="d-flex">
                <v-list-item three-line class="icon-list">
                  <v-list-item-avatar tile size="100" min-height="100" height="100%" class="icon-avatar"
                    :style="{ 'background-color': hover ? '#DC4001' : '#512A44' }">
                    <div style="height:100%;">
                      <IconLoader style="transform:scale(1.4)" :image="'icon'" />
                    </div>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 mb-1">
                      <a class="index-text">{{ index }}</a>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import IconLoader from './icons/IconLoader.vue'
import SearchBarHeader from './UI/SearchBarHeader.vue'
import * as urls from "../urls";
import Aurora from './UI/Aurora.vue';

const axios = require("axios");
export default {
  components: {
    IconLoader,
    SearchBarHeader,
    Aurora
},
  name: "Employees",
  data: () => ({
    noBgImg: true,
    breadcrumbsList: [],
    show: false,
    loading: false,
    item: [],
    options: {},
    findEmployeeHeaderInfo: true,
  }),
  watch: {
    options: {
      handler() {
        this.getEmployeesData();
      },
      '$route'() {
        this.breadcrumbsList = this.$route.meta.breadcrumb
      },
      deep: true,
    },
  },
  mounted() {
    this.getEmployeesData();
    this.updateBreadCrumbs();

  },
  methods: {
    updateBreadCrumbs() {
      this.breadcrumbsList = this.$route.meta.breadcrumb
    },

    indexUrl(field) {

      let department = "/find-employee/" + field.replace(/\//g, '')
      let noSpaces = department.replaceAll(/\s/g, '-');

      return String(noSpaces)

    },
    getEmployeesData() {
      this.loading = true;

      axios
        .post(
          urls.EMPLOYEES_URL,
          // this.options
        )
        .then((resp) => {
          this.item = resp.data.data;
          this.loading = false;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });

    },
  },
};
</script>