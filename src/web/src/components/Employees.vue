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
    <div class="d-flex mb-6 mt-6">
      <a class="mr-2" href="/">Home</a>
      <p class="mr-2">/</p>
      <p>Find a goverment Employee</p>
    </div>
    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <v-row class="py-10 mt-16"></v-row>
    <v-row class="mb-6 mt-16">
      <v-col md="4" v-for='(items, index, id) in item'>
        <v-hover v-slot="{ hover }">
          <v-card class="mx-auto employee-division-card" max-width="344" outlined>
            <v-card class="d-flex">
              <v-list-item three-line class="icon-list">

                <v-list-item-avatar tile size="100" min-height="100" height="100%" class="icon-avatar"
                  :style="{ 'background-color': hover ? '#DC4001' : '#512A44' }">
                  <v-avatar tile>
                    <img style="filter:invert()" :src="require('../assets/svg/' + generateUrlImg(index))">
                  </v-avatar>
                </v-list-item-avatar>


                <v-list-item-content>
                  <v-list-item-title class="text-h6 mb-1">
                    <a class="index-text" :href="indexUrl(index, 'department')">{{ index }}</a>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
            <v-card-actions class="pb-0 pt-0">
              <v-expand-transition>
                <ul v-if="hover">
                  <li v-for='detail in items'>
                    <a class="divisions-text" :href="generateUrl(detail, 'division')">{{ detail.division }}</a>
                  </li>
                </ul>
              </v-expand-transition>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

  </div>
</template>

<script>
const axios = require("axios");
export default {
  components: {

  },
  name: "Grid",
  data: () => ({
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
  },
  methods: {
    replaceSpaces(find, replace, obj) {
      find = find
      replace = replace
      var reg = new RegExp(find, 'g');
      return obj.replace(reg, replace)
    },
    generateUrl(field, type) {
      if (type == "division")
        return "/organization-detail/" + field.departmentUrl + "/" + field.divisionUrl;
      else if (type == 'department')
        return "/organization-detail/" + field.departmentUrl;
    },

    generateUrlImg(field) {
      let department = field + '.svg';
      const noSpaces = department.replaceAll(/\s/g, '');
      return String(noSpaces);
    },

    indexUrl(field, type) {
      if (type == "department") {
        let department = "/organization-detail/" + field
        let noSpaces = department.replaceAll(/\s/g, '-');
        return String(noSpaces)
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
