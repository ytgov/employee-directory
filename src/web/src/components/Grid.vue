<template>
  <div class="books">
    <div class="full-width yellow-border white-bg pt-16 mt-n5" >
    <v-container 
    class="container-content"
    >
      <h1 class="ml-n3" >Find a goverment Employee</h1>

      <v-banner class="mb-6  mx-n9">
        <span>
        
        </span> <br/><br/>
        
        </v-banner>
      <v-row class="flex-end mb-10">
        <v-text-field
          label="Search by Name"
          v-model="search"
          class="pl-5 pr-5"
          dense=""
          background-color="#F1F1F1"
          outlined="outlined"
          flat=""
          color=""
          solo
          
        >

      </v-text-field>
        <v-select
          v-model="search"
          class="pl-5 pr-5"
          dense=""
          
          background-color="#F1F1F1"
          outlined="outlined"
          flat=""
          label="Department"
          color=""
          solo
        >
      </v-select>
        <v-btn
        class="search-responsive mt-n3 pa-4 py-5"
          style="display: flex;"
          color="#00616D"
        >Search</v-btn>
      </v-row>
  </v-container>
</div>
<div class="full-width py-8 gray-bg bg-img" >
  <v-container class="d-flex container-content">
    <div style="width: 40px" class="mr-4">
      <img
        style=" width:100%; filter: invert(20%) sepia(16%) saturate(1465%) hue-rotate(268deg) brightness(95%) contrast(97%)"
        :src="require('../assets/svg/' + this.imgTitle)"
        class="mt"
        />
    </div>
    <h2 class="mb-n1" style="color:#522A44 !important; font-size: 32px !important;">{{title}}</h2>
  </v-container>
  <div class="title-bg"></div> 
</div>
    <div class="d-flex mb-6 mt-6">
      <a class="mr-2" href="/">Home</a>
      <a class="mr-2" href="/find-employee">/ Find a goverment Employee</a>
      <p class="mr-2">/</p>
      <p>{{title}}</p>
      
    </div>
    <v-row class="d-flex">
      <h3>Your search found {{totalLength}} results.</h3>
    <div class="d-flex">
      <h4 class="mr-3 mt-1">Grouped by their:</h4>
      <div class="d-md-flex chips">
        <v-chip
        class="mr-2"
        label
        outlined
        color="#00616D"
        >All Employees</v-chip>
        <v-chip
        class="mr-2"
        label
        outlined
        color="#00616D"
        >Department</v-chip>
        <v-chip
        class="mr-2"
        label
        outlined
        color="#00616D"
        >Location</v-chip>
        <v-chip
        class="mr-2"
        label
        outlined
        color="#00616D"
        >Position</v-chip>
      </div>
    </div>
    </v-row>
    
  
    <div class="text-center loading" v-show="loading">
        <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        ></v-progress-circular>
    </div>
    <div class="class=d-flex mb-6 mt-6">

    <v-data-table
     
      dense
      class="pa-5 d-table auto width-100"
      :items="items"
      :headers="headers"
      :options.sync="options"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :search="search"
      hide-default-header
      mobile-breakpoint="600"
    >
    <template  v-slot:header="{ props }">
        <th class="data-header py-3 pl-3"
          v-for="head in props.headers">{{ head.text }}
        </th>
      </template>

  </v-data-table>
  
</div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Grid",
  data: () => ({
    
    title: '',
    imgTitle: '',
    div: '',
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      { text: "Name", value: "full_name" },
      { text: "Position", value: "title" },
      { text: "Department", value: "department" },
      // { text: "Branch", value: "branch" },
      { text: "Division", value: "division" },
      { text: "Manager", value: "manager" },
    ],
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
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

    generateImg(){
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
      if(division == null){
        formattedQueryParam = `${encodeURIComponent(`${department}`)}`
      } else {
        formattedQueryParam = `${encodeURIComponent(`${department}-%252F-${division}`)}`
      }
      this.title = department.replace(reg, ' ')
      this.div = division
      
      console.log(formattedQueryParam)
      const search = `${encodeURIComponent(`${this.search}`)}`;
      axios
        .post(
          `http://localhost:3000/api/employees/organization-detail/${department}/${division}?search=` + search,
          this.options
        )
        .then((resp) => {
          this.items = resp.data.data;
          console.log(resp.data.data)
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

.table-header {
 height: 300px !important;
 background-color: green;
}

.v-text-field >>> fieldset {
  border: 1.5px solid #F3A901;
}

 .bg-img{
  background-image: url(/Aurora-main.svg);
  background-repeat: no-repeat;
  background-position-x: 300px;
  background-position-y: center;
} 

@media (min-width: 1180px){
  .bg-img{
  background-position-x: 2878px;
  background-position-y: center;
  
}
}

.overf {
  z-index: 1;
  overflow: hidden;
}
.data-header {
  background-color: #EDEDED;
  border-top: 5px solid #779800;
  text-align: left;
}

</style>