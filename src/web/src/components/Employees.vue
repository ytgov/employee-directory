<template>
  <div class="books">
    <div class="full-width yellow-border white-bg pt-16 mt-n5">

      <v-container class="container-content ">
        <h1 class="ml-5">Find a goverment Employee</h1>

        <v-banner class="mb-6 mt-13">
          <span>
            You can use this service to find the contact information of a person who works for a Government of Yukon
            organization.
          </span> <br /><br />
          Enter the person's first or last name, position title, email address or telephone number in the search box to
          get started. You can also enter the name of a department, division or branch to view all employees in that
          specific organization.
        </v-banner>
        <v-row class="flex-end mb-10 px-10 mt-8">
          <v-text-field label="Search by Name" v-model="search" class="pl-5 pr-5" dense="" background-color="#F1F1F1"
            outlined="outlined" flat="" color="" solo>

          </v-text-field>
          <v-select v-model="search" class="pl-5 pr-5" dense="" items-value="'item.index'" background-color="#F1F1F1"
            outlined="outlined" flat="" label="Department" color="" solo>

          </v-select>
          <v-btn class="search-responsive mt-n3 pa-4 py-5" style="display: flex;" color="#00616D">Search</v-btn>
        </v-row>
      </v-container>
    </div>
    <v-breadcrumbs class="mt-6 breadcrumbs" :items="breadcrumbsList">

      <template v-slot:item="{ item }">

        <v-breadcrumbs-item :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>

      </template>
    </v-breadcrumbs>
    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <v-row class="py-10 mt-16"></v-row>
    <v-row class="mb-6 mt-16">
      <v-col cols="12" md="4" sm="6" xs="12" v-for='(items, index, id) in item'>
        <v-hover v-slot="{ hover }">
          <v-card :href="indexUrl(index, 'department')" class="mx-auto employee-division-card" max-width="344" outlined>
            <v-card class="d-flex">
              <v-list-item three-line class="icon-list">
                <v-list-item-avatar tile size="100" min-height="100" height="100%" class="icon-avatar"
                  :style="{ 'background-color': hover ? '#DC4001' : '#512A44' }">
                  <v-avatar tile>
                    <IconLoader :image="index.toLowerCase()" :color="'white'" />
                  </v-avatar>
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

  </div>
</template>

<script>
import IconLoader from './icons/IconLoader.vue'

const axios = require("axios");
export default {
  components: {
    IconLoader
  },
  name: "Grid",
  data: () => ({
    breadcrumbsList: [],
    show: false,
    loading: false,
    item: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      { text: "id", value: "id" },
      { text: "name", value: "name" },
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
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
    search: {
      handler() {
        this.getEmployeesData();
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
    replaceSpaces(find, replace, obj) {
      find = find
      replace = replace
      var reg = new RegExp(find, 'g');
      return obj.replace(reg, replace)
    },
    generateUrl(field, type) {
      if (type == "division")
        return "/find-employee/" + field.departmentUrl.toLowerCase() + "/" + field.divisionUrl.tolowercase();
      else if (type == 'department')
        return "/find-employee/" + field.departmentUrl.toLowerCase();
    },

    generateUrlImg(field, type) {
      let department = field + '.svg';
      const noSpaces = department.replaceAll(/\s/g, '');
      return String(noSpaces);
    },

    indexUrl(field, type) {
      if (type == "department") {
        let department = "/find-employee/" + field
        let noSpaces = department.replaceAll(/\s/g, '-');
        return String(noSpaces.toLowerCase())
      }

    },
    getEmployeesData() {
      this.loading = true;

      axios
        .post(
          "http://localhost:3000/api/employees",
          this.options
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

<style scoped>

</style>
