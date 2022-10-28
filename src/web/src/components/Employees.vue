<template>
  <div class="books">
    <h1>Find a goverment Employee</h1>

    <v-banner class="mb-5">
    You can use this service to find the contact information of a person who works for a Government of Yukon organization.

    Enter the person's first or last name, position title, email address or telephone number in the search box to get started. You can also enter the name of a department, division or branch to view all employees in that specific organization.
    </v-banner>
    <v-text-field v-model="search" label="Enter your search terms"></v-text-field>

    <h4>Browse employees by organization</h4>

    <div class="text-center loading" v-show="loading">
        <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        ></v-progress-circular>
    </div>

    </br>
    <v-row class="mb-6">
        <v-col
        md="4"
        v-for='(items, index) in item'
        >
            <v-card
                class="mx-auto employee-division-card"
                max-width="344"
                outlined
            >
                <v-list-item three-line class="icon-list">
                    <v-list-item-avatar
                        tile
                        size="100"
                        color="#512A44"
                        class="icon-avatar"
                    >
                        <v-icon
                        large
                        color="white"
                        >
                        mdi-domain
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="text-h6 mb-1">
                            <a v-bind:src="generateUrl(index, 'dep')">{{index}}</a>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                    <ul>
                        <li v-for='detail in items'>
                            <a v-bind:src="generateUrl(detail, 'div')">{{detail.division}}</a>
                        </li>
                    </ul>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>

  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Grid",
  data: () => ({
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
