<template>
  <div class="books">
    <div class="full-width yellow-border white-bg pt-16 mt-n5">
      <v-container class="container-content ">
        <h1 class="ml-5">Find a goverment Employee</h1>
        <v-banner class="mb-6 mt-13">
        </v-banner>
        <v-row class="flex-end mb-10 px-10 mt-5">
          <v-text-field label="Search by Name" v-model="search" class="pl-5 pr-5" dense="" background-color="#F1F1F1"
            outlined="outlined" flat="" color="" solo>
          </v-text-field>
          <v-select v-model="search" class="pl-5 pr-5" dense="" :items="item" items-value="'item.index'"
            background-color="#F1F1F1" outlined="outlined" flat="" label="Department" color="" solo>
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
    <v-row class=" mt-16"></v-row>
    <v-row>
      <v-col>
          <v-card
            elevation="2"
            class="mx-auto d-flex justify-center align-center"
            max-width="1180"
            height="542"
            outlined
          >
            
              <v-card class="py-10" flat="true" raise="false" height="400" width="100%"></v-card>
              <v-card class="py-10" flat="true" raise="false" height="400" width="100%">
                <li>
                  <a>Test</a>
                </li>
              </v-card>
          </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
const axios = require("axios");
export default {
  components: {

  },
  name: "Department",
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
    console.log()
  },
  methods: {
    replaceSpaces(find, replace, obj) {
      find = find
      replace = replace
      var reg = new RegExp(find, 'g');
      return obj.replace(reg, replace)
    },
    generateUrl(field, type) {
      if (type == "div")
        return "/organization-detail/" + field.departmentUrl + "/" + field.divisionUrl;
      else if (type == "dep")
        return "/organization-detail/" + field.departmentUrl;
    },
    ejecuteSearch() {
      this.search = searchUrl();
    },
    searchUrl(field, type) {
      if (type == "dep")
        return `/organization-detail/${field.departmentUrl}/${field.divisionUrl}`;
    },

    generateUrlImg(field, type) {
      if (type == "dep") {
        let department = field + '.svg';
        const noSpaces = department.replaceAll(/\s/g, '');
        return String(noSpaces);
      } else {
        return
      }
    },

    indexUrl(field, type) {
      if (type == "dep")
        return "/organization-detail/" + field
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
          console.log(this.item)
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
