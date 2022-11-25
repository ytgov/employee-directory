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
    <div class="full-width py-8 gray-bg bg-img">
      <v-container class="d-flex container-content">
        <div style="width: 60px" class="mr-4">
          <img
            style=" width:100%; filter: invert(20%) sepia(16%) saturate(1465%) hue-rotate(268deg) brightness(95%) contrast(97%)"
            :src="require('../assets/svg/' + this.imgTitle)" class="mt" />
        </div>
        <h2 class="mb-n1" style="color:#522A44 !important; font-size: 32px !important;">{{ title }}</h2>
      </v-container>
      <div class="title-bg"></div>
    </div>
    <div class="d-flex mb-6 mt-12">
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
        <v-card elevation="2" class="mx-auto flex-column flex-md-row d-flex justify-center align-center department-card"
          max-width="1180" min-height="542" outlined>
          <v-card-actions class="px-16 pt-16 d-flex flex-column justify-center align-center" height="450" width="50%">
            <div class="py-4" style="width: 100px">
              <img 
                style=" width:100%; filter: invert(20%) sepia(16%) saturate(1465%) hue-rotate(268deg) brightness(95%) contrast(97%)"
                :src="require('../assets/svg/' + this.imgTitle)" class="mt" />
            </div>
            <h2 class="py-4" style="color:#522A44!important; font-size: 32px; text-align: center;" >{{ title }}</h2>
          </v-card-actions>
          <v-card-actions class="pa-16 flex-column align-start" min-height="400" width="50%">
            <li v-for='(item, index, id) in items' class="py-1">
              <a @click="toggleBranches(id)" class="division">{{ index }}</a>
              <v-expand-transition>
                <v-card-actions v-if="show == id" class="flex-column align-start">
                  <a class="branch my-2 ml-8" v-for="detail in item">{{ detail.branch }}</a>
                </v-card-actions>
              </v-expand-transition>
            </li>
          </v-card-actions>
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
    imgTitle: '',
    show: '',
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
  watch: {
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
  },
  methods: {

    generateImg() {
      let department = this.title;
      const noSpaces = department.replace(/\s/g, '');
      this.imgTitle = noSpaces + '.svg';
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
      this.title = department.replace(reg, ' ')
      axios
        .post(
          `http://localhost:3000/api/employees/organization-detail/${department}`,
          this.options
        )
        .then((resp) => {
          this.items = resp.data.data;
          console.log(this.items)
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

.branch {
  font-size: 16px;
}
</style>
