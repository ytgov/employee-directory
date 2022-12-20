<template>
    <div class="books">
        <SearchBarHeader />
        <DepartmentHeader :title="this.department" :image="this.department.toLowerCase()" />

        <v-breadcrumbs class="mt-6 mb-8 breadcrumbs" :items="breadcrumbsList">
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item :href="item.link">
                    {{ item.name }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>


        <h2 class="mt-8 ml-3">Your search for {{ this.searchTitle }} found {{ this.itemsLength }} results.</h2>
        <GridChips :search="chipsData" />
        <div class="text-center loading" v-show="loading">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>


        <div v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
            <h2 class="mt-8 ml-5 department-text">{{ cleanParam(parent_array) }}</h2>

            <p>{{ value.length }}</p>
            <div v-for="(item, index) in value">
                <div class="mt-8 ml-5 d-flex align-center">
                    <h3 class="division-text">{{ cleanParam(index) }}</h3>
                    <h3 class="ml-3 py-1 px-3 division-length">{{ item.length }}</h3>
                </div>

                <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="item"
                    :headers="headers" :loading="loading" hide-default-header mobile-breakpoint="0">
                    <template v-slot:header="{ props }">
                        <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
                        </th>
                    </template>
                    <template v-slot:body="{ items }">
                        <tbody class="table-body">
                            <tr class="table-border" v-for='item in item'>
                                <td>
                                    <a class="d-flex flex-wrap align-center" style="word-wrap: normal"
                                        :href="'/Find-Employee/Employee-Detail/' + item.full_name_url">

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
import DepartmentHeader from './UI/DepartmentHeader.vue';
import GridChips from "./UI/GridChips.vue"
import IconLoader from "./icons/IconLoader.vue"


export default {
    components: {
        SearchBarHeader,
        GridChips,
        IconLoader,
        DepartmentHeader
    },
    watch: {
        options: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },
        '$route'() {
            this.breadcrumbsList = this.$route.meta.breadcrumb
        },

    },
    mounted() {
        this.getDataFromApi();
        this.updateBreadCrumbs();
    },
    data() {
        return {
            breadcrumbsList: [],
            chipsData: true,
            department: '',
            pastSearch: '',
            items: [],
            itemsLength: null,
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
        cleanParam(param) {

            let paramFormatted = param.replace(/['"]+/g, '')

            if (paramFormatted === '-') {
                paramFormatted = 'N/A'
            }

            return paramFormatted;
        },
        updateBreadCrumbs() {

            var find = ' ';
            var reg = new RegExp(find, 'g');
            let arr = this.$route.meta.breadcrumb;

            const dynamicBreadcrumb = arr.filter(({ dynamic }) => !!dynamic);

            dynamicBreadcrumb.forEach((element => {
                if (element.name == 'Department') {
                    element.name = this.department;
                    element.link = '/find-employee/' + this.department.replace(reg, '-').toLowerCase()
                } else if (element.name == 'Search') {

                    element.name = 'Search Employee: ' + this.searchTitle;

                }
            }))
            this.breadcrumbsList = arr
        },
        getDataFromApi() {
            var find = '-';
            var reg = new RegExp(find, 'g');
            let { full_name, department } = this.$route.params;

            this.searchTitle = full_name
            this.department = department.replace(reg, ' ')

            this.loading = true;


            axios
                .post(
                    `http://localhost:3000/api/employees/find-employee/search/keyword=${full_name}&department=${department}`,
                    this.options
                )
                .then((resp) => {
                    this.items = resp.data.data;
                    this.itemsLength = resp.data.meta.count
                    this.loading = false;
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    this.loading = false;
                });
        },
    },

    computed: {
        item: function () {
            var filtered_array = [];
            for (var i = 0; i < this.items.length; i++) {
                if (filtered_array.indexOf(this.items[i].name) === -1) {
                    filtered_array.push(this.items[i].name)
                }
            }
            return filtered_array;
        }
    }

}

</script>

<style scoped>
.department-text {
    font-size: 34px !important;
}

.division-text {
    font-size: 30px !important;
}

.division-length {
    background-color: #00616D;
    font-size: 16px;
    border-radius: 5px;
    color: white !important;
}
</style>