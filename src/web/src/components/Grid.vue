<template>
  <div class="books">
    <div class="full-width yellow-border white-bg pt-16 mt-n5">
      <v-container class="container-content ">
        <h1 class="ml-5">Find a goverment Employee</h1>
        <v-banner class="">
        </v-banner>
        <v-row class="flex-end mb-10 px-10">
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
    <DepartmentHeader :title="title" :image="title.toLowerCase()" />
    <v-breadcrumbs class="mt-6 mb-8 breadcrumbs" :items="breadcrumbsList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-row class="d-flex container pr-1 flex-column">
      

      <div class="d-flex wrap ml-3 align-center">
        <h4 class="mr-3 mt-1">Grouped by their:</h4>
        <div class="d-md-flex chips">
          <v-chip class="ma-2 px-8" label outlined color="#00616D">Location</v-chip>
          <v-chip class="ma-2 px-8" label outlined color="#00616D">Position</v-chip>
        </div>
      </div>
    
    </v-row>
    
    <v-row>
      <DivisionsCard :department="this.department" class="mt-16"/>
    </v-row>
    
    <div class="pa-6 mt-10 d-flex flex-column align-start justify-center">
      
      <div class=" d-flex align-center justify-start">
        <h2 style="font-size: 34px !important;">{{div}}</h2>
        <h3 class="ml-4">( {{divisionLength}} Results )</h3>
      </div>
      <div v-if="branch !== '3ajd9h'" class=" d-flex align-center justify-start">
        <h2 style="font-size: 25px !important;" >{{branch}}</h2>
        <h3 style="font-size: 16px !important;" class="ml-4">( {{totalLength}} Results )</h3>
      </div>
    </div>
    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <div class="class=d-flex mb-6 mt-6">

      <v-data-table dense class="pa-5 d-table auto width-100"  hide-default-footer :items="items"
        :headers="headers" :options.sync="options" :loading="loading" :items-per-page="itemsPerPage" :search="search"
        hide-default-header mobile-breakpoint="0">
        <template v-slot:header="{ props }">
          <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
          </th>
        </template>
        <template v-slot:body="{ items }">
          <tbody class="table-body">
            <tr class="table-border" v-for='(item, index, id ) in items' :key="id">
              <td>
              <a :href="'/Find-Employee/Employee-Detail/' + item.full_name_url">{{ item.full_name }}</a></td>
              <td>{{ item.title }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone_office }}</td>
            </tr>
          </tbody>
        </template>

      </v-data-table>

    </div>
  </div>
</template>

<script>
const axios = require("axios");
import DepartmentHeader from "./UI/DepartmentHeader.vue";
import DivisionsCard from "./UI/DivisionsCard.vue";

export default {
  name: "Grid",
  components: {
    DepartmentHeader,
    DivisionsCard,
  },
  data: () => ({
    dataTableParam: 0,
    branch: '',
    breadcrumbsList: [],
    department: '',
    title: '',
    div: '',
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    divisionLength: 0,
    headers: [
      { text: "Name", value: "full_name" },
      { text: "Position", value: "title" },
      { text: "E-Mail Address", value: "email" },
      { text: "Phone Number", value: "phone_office" },
    ],
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
  }),
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
  },
  methods: {
    updateBreadCrumbs() {

      var find = ' ';
      var reg = new RegExp(find, 'g');
      let arr = this.$route.meta.breadcrumb;

      const dynamicBreadcrumb = arr.filter(({ dynamic }) => !!dynamic);

      dynamicBreadcrumb.forEach((element => {
        if (element.name == 'Department') {
          element.name = this.department;
          element.link = '/find-employee/' + this.department.replace(reg,'-').toLowerCase()
        } else if (element.name == 'Division') {
          
          element.name = this.div;
          if(this.branch !== '3ajd9h'){
            element.link = ('/find-employee/' + this.department + '/'+ this.div ).replace(reg,'-').toLowerCase() + '/3ajd9h'
          } else {
            element.link = null
          }
          
        } else if (element.name == 'Branch') {
          if(this.branch === '3ajd9h') {
            element.name = null
          } else {
            element.name = this.branch;
          }
          
        }
        
      }))
      this.breadcrumbsList = arr
    },

    getDataFromApi() {
      var find = '-';
      var reg = new RegExp(find, 'g');
      const { department, division,branch } = this.$route.params;

      this.loading = true;
      let formattedQueryParam = ''
      if (division == null) {
        formattedQueryParam = `${encodeURIComponent(`${department}`)}`
      } else if(division !== null && branch == null || branch == undefined) {
        formattedQueryParam = `${ encodeURIComponent(`${department}-%252F-${division}`)}`
      } else if (division !== null && branch !== null) {
        formattedQueryParam = `${ encodeURIComponent(`${department}-%252F-${division}-%252F-${branch}`)}`
      }
      this.title = department.replace(reg, ' ')
      this.department = department.replace(reg, ' ')
      this.div = division.replace(reg, ' ')
      this.branch = branch.replace(reg, ' ')
      const search = `${encodeURIComponent(`${this.search}`)}`;

      
      axios
        .post(
          `http://localhost:3000/api/employees/Find-Employee/${department}/${division}/${branch}?search=` + search,
          this.options
        )
        .then((resp) => {
          this.items = resp.data.data;
          this.totalLength = resp.data.meta.branchCount;
          this.divisionLength = resp.data.meta.divisionCount
          this.updateBreadCrumbs();
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
.table-header {
  height: 300px !important;
  background-color: green;
}

.v-text-field>>>fieldset {
  border: 1.5px solid #F3A901;
}

.bg-img {
  background-image: url(/Aurora-main.svg);
  background-repeat: no-repeat;
  background-position-x: 300px;
  background-position-y: center;
}

@media (min-width: 1180px) {
  .bg-img {
    background-position-x: 2878px;
    background-position-y: center;

  }
}

.overf {
  z-index: 1;
  overflow: hidden;
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

.table-body .employees a {
  padding-left: 1rem !important;
}

.table-body .table-border {
  border-bottom: none !important;
}

.table-body tr:nth-child(even) {
  background-color: #EDEDED;
}
</style>