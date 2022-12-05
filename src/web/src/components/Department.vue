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
          <v-select v-model="search" class="pl-5 pr-5" dense="" background-color="#F1F1F1" outlined="outlined" flat=""
            label="Department" color="" solo>
          </v-select>
          <v-btn class="search-responsive mt-n3 pa-4 py-5" style="display: flex;" color="#00616D">Search</v-btn>
        </v-row>
      </v-container>
    </div>

    <DepartmentHeader :title="title" :img="this.imgTitle" />


    <v-breadcrumbs class="mt-6" :items="breadcrumbsList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <v-row class="mt-16"></v-row>
    <v-row>
      <v-col>

        <v-card elevation="2" class="mx-auto flex-column flex-md-row d-flex justify-center align-center department-card"
          max-width="1180" min-height="542" outlined>

          <v-card-actions class="px-16 pt-16 d-flex flex-column justify-center align-center" height="450"
            max-width="590">
            <div class="py-4 d-flex align-center justify-center" style="width: 200px">
              <img
                style=" width:80%; filter: invert(20%) sepia(16%) saturate(1465%) hue-rotate(268deg) brightness(95%) contrast(97%)"
                :src="require('../assets/svg/' + this.imgTitle)" class="mt" />
            </div>
            <div class="d-flex align-center justify-center" style="width:80%">
              <h2 class="py-4" style="color:#522A44!important; font-size: 32px; text-align: center;">{{ title }}</h2>
            </div>
          </v-card-actions>
          
          <v-card outlined color="transparent" class="flex-column">

          <v-card outlined color="transparent" v-for="(item, index, id) in items">
            <v-hover v-slot="{ hover }">
              <v-card outlined color="transparent">
                <v-list-title>
                <a :href="generateUrl(index)" :key="id" class="division">{{ index }}</a>
              </v-list-title>
              <v-expand-transition>
                <ul v-if="hover">
                  <li v-for="detail in item">
                    <a class="branch my-2 px-0 py-3">{{ detail.branch }}</a>
                  </li>
                </ul>
              </v-expand-transition>                
              </v-card>
          </v-hover>
          </v-card>
        </v-card>
        </v-card>

      </v-col>
    </v-row>

  </div>
</template>

<script>

import DepartmentHeader from "./UI/DepartmentHeader.vue";

const axios = require("axios");
export default {
  components: {
    DepartmentHeader,
  },
  name: "Department",
  data: () => ({
    department: '',
    breadcrumbsList: [],
    imgTitle: '',
    show: 90,
    loading: false,
    items: [],
    search: "",
    title: '',
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
  created() {

  },
  watch: {
    '$route'() {
      this.breadcrumbsList = this.$route.meta.breadcrumb
    },
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    search: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
    this.generateImg();
    this.updateBreadCrumbs();
  },
  methods: {
    generateUrl(param) {

      let find = ' ';
      let reg = new RegExp(find, 'g');

      let paramFormatted = param.replace(reg, '-')




      return this.title + '/' + paramFormatted

    },
    updateBreadCrumbs() {

      let arr = this.$route.meta.breadcrumb;

      const dynamicBreadcrumb = arr.find(({ dynamic }) => !!dynamic);

      if (dynamicBreadcrumb) {
        dynamicBreadcrumb.name = this.department;
      }
      this.breadcrumbsList = arr
    },
    toggleBranches(param) {
      if (this.show === param) {
        this.show = null
      } else
        this.show = param;
    },
    divisionMethod() {
      let department = req.params.department
      this.title = department
    },
    generateImg() {
      let department = this.title;
      const noSpaces = department.replace(/\s/g, '');
      this.imgTitle = noSpaces + '.svg';
    },
    getDataFromApi() {
      var find = '-';
      var reg = new RegExp(find, 'g');
      const { department, division } = this.$route.params;
      this.loading = true;
      let formattedQueryParam = ''
      formattedQueryParam = `${encodeURIComponent(`${department}`)}`
      this.department = department.replace(reg, ' ')
      this.title = department.replace(reg, ' ')
      axios
        .post(
          `http://localhost:3000/api/employees/Find-Employee/${department}`,
          this.options
        )
        .then((resp) => {
          this.items = resp.data.data;
          this.totalLength = resp.data.meta.count;
          this.loading = false;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });
    },
  }
};
</script>

<style scoped>
.department-card li {
  list-style: none;
}

.department-card a {
  text-decoration: underline;
  color: #0097A9;
}

.division {
  font-size: 19px;
  font-weight: 700;
}

.noPad {

  width: 70%;
  margin: 0 0 0 2rem;
  padding: 0 !important;
}

.colorOnClick {
  color: #643f5d !important;
}

.branch {
  padding: 2rem !important;
  font-size: 17px;
}

.directions-board {
  margin-bottom: 0 !important;
}
</style>
