<template>
    <div class="books">
        <SearchBarHeader />
        <h2 class="mt-8 ml-3">Your search for {{ this.searchTitle }} found {{ items.length }} results.</h2>
        <GridChips :search="chipsData" />
        <div class="text-center loading" v-show="loading">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>


        <div v-for="item in items" class="class=d-flex mb-6 mt-2">
            <h2>{{ item }}</h2>
            <div v-for="divisions in item">
                <h3>{{ divisions.division }}</h3>
                <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="items"
                    :headers="headers" :loading="loading" hide-default-header mobile-breakpoint="0">
                    <template v-slot:header="{ props }">
                        <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
                        </th>
                    </template>
                    <template v-slot:body="{ items }">
                        <tbody class="table-body">
                            <tr class="table-border" v-for='item in items'>
                                <td>
                                    <a class="d-flex flex-wrap align-center" style="word-wrap: normal"
                                        :href="'/Find-Employee/Employee-Detail/' + item.full_name_url">
                                        <div style="width:10px" v-if="(item.level === 2)"></div>
                                        <IconLoader class="mr-2" width="8" :color="'blue'" :image="item.level">
                                        </IconLoader>
                                        {{ item.full_name }}
                                    </a>
                                </td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.phone_office }}</td>

                            </tr>
                        </tbody>
                    </template>

                </v-data-table>
            </div>


        </div>

    </div>

</template>

<script>
const axios = require("axios");
import SearchBarHeader from './UI/SearchBarHeader.vue'
import GridChips from "./UI/GridChips.vue"
import IconLoader from "./icons/IconLoader.vue"


export default {
    components: {
        SearchBarHeader,
        GridChips,
        IconLoader
    },
    watch: {
        options: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },

    },
    mounted() {
        this.getDataFromApi();
    },
    data() {
        return {
            chipsData: true,
            pastSearch: 'Daniel Quintero',
            items: [],
            headers: [
                { text: "Name", value: "full_name" },
                { text: "Position", value: "title" },
                { text: "E-Mail Address", value: "email" },
                { text: "Phone Number", value: "phone_office" },
            ],
            loading: false,
            searchTitle: '',
        }
    },

    methods: {

        getDataFromApi() {
            var find = '-';
            var reg = new RegExp(find, 'g');
            let { full_name, department } = this.$route.params;

            this.searchTitle = full_name
            console.log(department)

            console.log(this.$route.params)

            this.loading = true;


            axios
                .post(
                    `http://localhost:3000/api/employees/find-employee/search/keyword=${full_name}&department=${department}`,
                    this.options
                )
                .then((resp) => {
                    this.items = resp.data.data;
                    this.loading = false;
                    console.log(this.items)
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    this.loading = false;
                });
        },
    },

    computed: {
    item: function() {
      var filtered_array = [];
      for(var i =0; i < this.items.length; i++) {
        if(filtered_array.indexOf(this.items[i].name) === -1) {
          filtered_array.push(this.items[i].name)
        }
      }
    return filtered_array;
    }
  }

}

</script>

<style>

</style>