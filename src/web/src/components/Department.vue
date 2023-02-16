<template>
  
  <div class="books">

    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <SearchBarHeader />

    <DepartmentHeader :title="title" :image="department" />


    <v-breadcrumbs class="mt-6 breadcrumbs" :items="breadcrumbsList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-row class="mt-16"></v-row>
    <v-row>
      <v-col col="6">

        <v-card elevation="2" class="mx-auto flex-column flex-md-row d-flex justify-center align-center department-card"
          max-width="1180" min-height="542" outlined>

          <v-card-actions class="px-16 pt-16 d-flex flex-column justify-center align-center" height="450"
            max-width="590">
            <div class="py-4 d-flex align-center justify-center" style="width: 200px">
              <IconLoader :image="department" :color="'purple'" />
            </div>
            <div class="d-flex align-center justify-center" style="width:80%">
              <h2 class="py-4" style="color:#522A44!important; font-size: 32px; text-align: center;">{{ title }}</h2>
            </div>
          </v-card-actions>

          <v-card outlined color="transparent" class="flex-column py-10">
            <v-card outlined color="transparent" v-for="(item, parent_item, id) in items" :key="item.full_name" class="px-8">
              <v-card outlined color="transparent">
                <li>
                  <a @click="activateBranches(parent_item)" :key="id" class="division">{{
                      parent_item
                  }}</a>
                </li>
                <v-expand-transition>
                  <ul v-if="check === parent_item.toLowerCase()">
                    <li v-for="(item, index, id) in item" :key="id" class="py-2">
                      <a :href="generateUrl('branch', index, parent_item)" class="my-2 px-0 py-3 branch">{{ index
                      }}</a>
                    </li>
                  </ul>
                </v-expand-transition>
              </v-card>
            </v-card>
          </v-card>
        </v-card>
        <v-card tile class="mx-auto mt-n3" height="12px" width="281px" color="#244C5A"></v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>

import DepartmentHeader from "./UI/DepartmentHeader.vue";
import IconLoader from "./icons/IconLoader.vue";
import SearchBarHeader from "./UI/SearchBarHeader.vue";
import * as urls from "../urls";

const axios = require("axios");
export default {
  components: {
    IconLoader,
    DepartmentHeader,
    SearchBarHeader
  },
  name: "Department",
  data: () => ({
    error: false,
    check: '',
    department: '',
    breadcrumbsList: [],
    imgTitle: '',
    show: 90,
    loading: false,
    items: [],
    search: "",
    title: '',
    options: {},
    url: '',
    loading: true,

  }),
  emits:['changeBg'],
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
    this.updateBreadCrumbs();
    this.$emit('changeBg');
  },
  methods: {

    checkError(){
      if(this.error === true){
        window.location.href = this.url + '/page-not-found'
      }
    },
    activateBranches(item) {
      let find = ' ';
      let reg = new RegExp(find, 'g');
      let department = this.department.toLowerCase().replace(reg, '-')
      let division = item.toLowerCase()
      if (this.check === item.toLowerCase()) {
        window.location.href = '/find-employee/' + department + '/' + item.toLowerCase().replace(reg, '-') + '/all-branches'
      }
      this.check = division
    },
    capitalizeString(param) {
      const string = param
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    generateUrl(type, param, index) {

      const urlLocation = String(window.location.href)
      let url = urlLocation.split(window.location.pathname)

      url = url.filter(element => {
        return element !== ''
      })
      url = url[0]

      this.url = url[0]
      let find = ' ';

      let reg = new RegExp(find, 'g');
      let department = this.department.replace(reg, '-')
      let indexFormatted = index.replace(reg, '-')
      let paramFormatted = param.replace(reg, '-')

      if (indexFormatted === 'N/A') {
        indexFormatted = 'not-division'
      }

      if (type === 'division') {


        if (indexFormatted === 'not-division') {
          return url + '/find-employee/' + department + '/not-division/all-branches'
        }
        return url + '/find-employee/' + department + '/' + indexFormatted.toLowerCase() + '/all-branches'

      } else if (type === 'branch') {
        if (param === 'N/A') {
          return url + '/find-employee/' + department + '/' + indexFormatted.toLowerCase() + '/not-branch'
        }
        return url + '/find-employee/' + department + '/' + indexFormatted.toLowerCase() + '/' + paramFormatted.toLowerCase()
      }


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
    getDataFromApi() {
      var find = '-';
      var reg = new RegExp(find, 'g');
      const { department, division } = this.$route.params;
      this.loading = true;
      let formattedQueryParam = ''
      formattedQueryParam = `${encodeURIComponent(`${department}`)}`
      this.department = department.replace(reg, ' ')
      this.title = this.capitalizeString(department.replace(reg, ' '))
      axios
        .post(
          `${urls.FIND_EMPLOYEE_URL}${department}`,
          this.options
        )
        .then((resp) => {
          this.error = resp.data.meta.error;
          this.checkError();
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

<style>
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
