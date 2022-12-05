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
      
      <DepartmentHeader :title="this.department" :img="this.imgTitle"/>
      
      <v-breadcrumbs class="mt-6"
      :items="breadcrumbsList"
      >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :href="item.link"
        >
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
      </v-breadcrumbs>
  
      <div class="text-center loading" v-show="loading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-row class=" mt-16"></v-row>
      <v-row>
        <v-col v-for="item in employee">
          <h2 class="mb-1" style="color: #DC4405 !important;font-size: 34px !important;">{{item.full_name}}</h2>
          <h3 class="mb-8" style="color: #512A44 !important; font-size: 24px; !important; ">{{item.title}}</h3>

          <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
            <h2 class="mt-4 mb-2">Organization</h2>
            <v-row>
                <v-col class="mb-1">
                    <h3 class="mb-0">Department: <a>{{item.department}}</a></h3>
                    <h3 class="mb-0">Division: <a>{{item.division}}</a></h3>
                </v-col>
                <v-col>
                    <h3 class="mb-0">Branch: <a>{{item.branch}}</a></h3>
                    <h3 class="mb-0">Unit: <span>{{item.unit}}</span></h3>
                </v-col>
            </v-row>
          </v-card>
          <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
            <h2 class="mt-4 mb-2">Contact:</h2>
            <v-row>
                <v-col class="mb-1">
                    <h3 class="mb-0">Phone Office: <a>{{item.phone_office}}</a></h3>
                    <h3 class="mb-0">Mobile: <a>{{item.mobile}}</a></h3>
                </v-col>
                <v-col>
                    <h3 class="mb-0">E-mail Address: <a>{{item.email}}</a></h3>
                    <h3 class="mb-0">Fax Office: <span>{{item.fax_office}}</span></h3>
                </v-col>
            </v-row>
          </v-card>
          <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
            <h2 class="mt-4 mb-2">Position Information</h2>
            <v-row>
                <v-col class="mb-1">
                    <h3 class="mb-0">Manager: <span>{{item.manager}}</span></h3>
                </v-col>
            </v-row>
          </v-card>
          <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
            <h2 class="mt-4 mb-2">Location</h2>
            <v-row>
                <v-col class="mb-1">
                    <h3 class="mb-0">Office: <span>{{item.office}}</span></h3>
                    <h3 class="mb-0">Suite: <span>{{item.suite}}</span></h3>
                    <h3 class="mb-0">Address: <a>{{item.address}}</a></h3>
                    <h3 class="mb-0">Community: <span>{{item.community}}</span></h3>
                    <h3 class="mb-0">Postal Code: <span>{{item.postal_code}}</span></h3>
                    <h3 class="mb-0">Mail Code: <span>{{item.mailcode}}</span></h3>
                    <h3 class="mb-0">P.O. Box: <span>{{item.po_box}}</span></h3>
                </v-col>
                <v-col>
                    
                </v-col>
            </v-row>
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
    name: "Department Detail",
    data: () => ({
      department: '',
      breadcrumbsList: [],
      employee: [],
      imgTitle: '',
      bg: null,
      show: 90,
      loading: false,
      items: [],
      search: "",
      title: 'Highways and Public Works',
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
      '$route' (){
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
        
      generateUrl(param){
        let find = ' ';
        let reg = new RegExp(find, 'g');
        let paramFormatted = param.replace(reg,'-')
        return this.title+'/'+paramFormatted
    
      },
      updateBreadCrumbs(){
         
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
      generateImg() {
        let dept = this.department
        const noSpaces = dept.replace(/\s/g, '');
        this.imgTitle = noSpaces + '.svg';
        console.log(this.imgTitle)
      },
      getDataFromApi() {
        const { full_name } = this.$route.params;
        this.loading = true;
        axios
          .post(
            `http://localhost:3000/api/employees/Find-Employee/Employee-Detail/${full_name}`
          )
          .then((resp) => {
            this.employee = resp.data.data;
            this.loading = false;
            this.department = this.employee[0].department
            console.log(this.department)
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

  .employee-detail a{
    font-size: 22px;
    font-weight: 400;
    text-decoration: underline;
  }
  .employee-detail h2,.employee-detail h3 {
    font-weight: bold;
  }

  .employee-detail h2 {
    font-size: 30px;
  }
  .employee-detail h3 {
    font-size: 22px;
  }


  </style>