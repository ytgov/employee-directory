<template>
  <div class="books">
    <div class="full-width yellow-border white-bg pt-16 mt-n5" >
    <v-container 
    class="contentt"
    >
      <h1 class="ml-n3" >Find a goverment Employee</h1>

      <v-banner class="mb-6 mt-13 mx-n9">
        <span>
        You can use this service to find the contact information of a person who works for a Government of Yukon organization.
        </span> <br/><br/>
        Enter the person's first or last name, position title, email address or telephone number in the search box to get started. You can also enter the name of a department, division or branch to view all employees in that specific organization.
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
    <div class="d-flex mb-6 mt-6">
      <a class="mr-2" href="/">Home</a>
      <p class="mr-2">/</p>
      <p>Find a goverment Employee</p>
    </div>
    <div class="text-center loading" v-show="loading">
        <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        ></v-progress-circular>
    </div>
    <v-row class="mb-6 mt-16">
        <v-col
        md="4"
        v-for='(items, index, id) in item'
        >
          <v-hover v-slot="{ hover }">
            <v-card
                class="mx-auto employee-division-card"
                max-width="344"
                outlined
            >
            <v-card class="d-flex">
                <v-list-item three-line class="icon-list">
                  
                    <v-list-item-avatar
                        tile
                        size="100"
                        min-height="100"
                        height="100%"
                        class="icon-avatar"
                        :style="{'background-color': hover ? '#DC4001' : '#512A44'}"
                    >
                        <v-avatar
                        tile
                        >
                          <img style="filter:invert()"
                            :src="require('../assets/svg/' + generateUrlImg(index, 'dep'))"
                          >
                        </v-avatar>
                    </v-list-item-avatar>
                  

                    <v-list-item-content>
                        <v-list-item-title class="text-h6 mb-1">
                            <a class="index-text" v-bind:src="generateUrl(index, 'dep')">{{index}}</a>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
              </v-card>
                <v-card-actions
                class="pb-0 pt-0"
                >
                  
                  <v-expand-transition>
                    <ul v-if="hover">
                        <li v-for='detail in items'>
                            <a class="divisions-text" :href="searchUrl(detail, 'dep')" v-bind:src="generateUrl(detail, 'div')">{{detail.division}}</a>
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
    generateUrl(field, type){
        if(type == "div")
            return "/organization-detail/"+field.departmentUrl+"/"+field.divisionUrl;
        else if(type == "dep")
            return "/organization-detail/"+field;
    },
    ejecuteSearch(){
      this.search = searchUrl();
    },
    searchUrl(field, type){
        if(type == "dep")
          return `/find-employee/${field.departmentUrl}/${field.divisionUrl}`;  
    },

    generateUrlImg(field, type){
        if(type == "dep") {
          let department = field+'.svg';
          const noSpaces = department.replaceAll(/\s/g,'');
          return String(noSpaces);
        } else {
          return
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
