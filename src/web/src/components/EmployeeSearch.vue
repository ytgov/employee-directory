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


        <h2 class="mt-8">Your search for {{ this.searchTitle }} found {{ this.itemsLength }} results.</h2>
        <v-row>
            <v-col xs="12" md="2" class="d-flex align-center justify-start">
                <h4 class="">Group by their: </h4>
            </v-col>
            <v-col xs="12" md="10">
                <v-chip-group v-model="selection" center-active mandatory active-class="chips--active">
                    <v-chip label outlined color="#00616D">All Employees</v-chip>
                    <v-chip label outlined color="#00616D">By Department</v-chip>
                    <v-chip label outlined color="#00616D">By Location</v-chip>
                    <v-chip label outlined color="#00616D">By Position</v-chip>
                </v-chip-group>
            </v-col>
        </v-row>

        <div class="text-center loading" v-show="loading">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>

        <div v-if="itemsValue === 0">

            <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="items"
                :headers="headers" :loading="loading" hide-default-header :items-per-page="itemsPerPage"
                mobile-breakpoint="0">
                <template v-slot:header="{ props }">
                    <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
                    </th>
                </template>
                <template v-slot:body="{ items }">
                    <tbody class="table-body">
                        <tr class="table-border" v-for='item in items'>
                            <td>
                                <a class="d-flex flex-wrap align-center" style="word-wrap: normal"
                                    :href="urlEmployee(item.department, item.full_name_url)">

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
        <div v-if="itemsValue === 1" v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
            <h2 class="mt-8 ml-5 department-text">{{ cleanParam(parent_array) }}</h2>
            
            <div v-for="(item, index) in value">
                <div class="mt-8 ml-5 d-flex align-center">
                    <h3 class="division-text">{{ cleanParam(index) }}</h3>
                    <h3 class="ml-3 py-1 px-3 division-length" >{{ item.length }}</h3>
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
                                        :href="urlEmployee(item.department, item.full_name_url)">

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

        <div v-if="itemsValue === 2" v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
            <v-row>
                <div class="mt-8 ml-12 d-flex align-center">
                    <h3 class="division-text ">{{ cleanLocation(parent_array) }}</h3>
                </div>
            </v-row>
            <div class="mt-4 ml-5 d-flex align-center">
                <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="value"
                    :headers="headers" :loading="loading" hide-default-header mobile-breakpoint="0">
                    <template v-slot:header="{ props }">
                        <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
                        </th>
                    </template>
                    <template v-slot:body="{ items }">
                        <tbody class="table-body">
                            <tr class="table-border" v-for='item in value'>
                                <td>
                                    <a class="d-flex flex-wrap align-center" style="word-wrap: normal"
                                        :href="urlEmployee(item.department, item.full_name_url)">

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

        <div v-if="itemsValue === 3" v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
            <v-row>
                <div class="mt-8 ml-12 d-flex align-center">
                    <h3 class="division-text ">{{ cleanParam(parent_array) }}</h3>
                </div>
            </v-row>
            <div class="mt-8 ml-5 d-flex align-center">
                <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="value"
                    :headers="headers" :loading="loading" hide-default-header mobile-breakpoint="0">
                    <template v-slot:header="{ props }">
                        <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
                        </th>
                    </template>
                    <template v-slot:body="{ items }">
                        <tbody class="table-body">
                            <tr class="table-border" v-for='item in value'>
                                <td>
                                    <a class="d-flex flex-wrap align-center" style="word-wrap: normal"
                                        :href="urlEmployee(item.department, item.full_name_url)">
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
import IconLoader from "./icons/IconLoader.vue"


export default {
    components: {
        SearchBarHeader,
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

        selection: {
            handler() {
                this.loading = true
                this.getDataFromApi();
            },
        }

    },
    mounted() {
        this.getDataFromApi();
        this.updateBreadCrumbs();
    },
    data() {
        return {
            
            itemsPerPage: null,
            selection: '',
            itemsValue: null,
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
        urlEmployee(department, name) {
            var find = ' ';
            var reg = new RegExp(find, 'g');
            return '/find-employee/employee-detail/' + department.replace(reg, '-').toLowerCase() + '/' + name.toLowerCase()
        },
        cleanParam(param) {

            if (param === '-') {
                param = 'N/A'
            }

            return param;
        },
        cleanLocation(location) {

            if (location[0] === ',') {
                let link = location.slice(1);
                return link.replace(/['"]+/g, '')
            } else {
                return location.replace(/['"]+/g, '')
            }
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

                    element.name = 'Employee Search';

                }
            }))
            this.breadcrumbsList = arr
        },
        getDataFromApi() {
            var find = '-';
            var reg = new RegExp(find, 'g');
            let { full_name, department } = this.$route.params;

            this.searchTitle = full_name

            let departmentFormatted = department.replace(reg, ' ')

            departmentFormatted = departmentFormatted.charAt(0).toUpperCase() + departmentFormatted.slice(1);
            this.department = departmentFormatted

            this.loading = true;


            axios
                .request({
                    method: 'POST',
                    data: {
                        groupBy: this.selection,
                        itemsperPage: this.itemsPerPage,
                    },
                    url: `http://localhost:3000/api/employees/find-employee/search/keyword=${full_name}&department=${department}`
                }

                )
                .then((resp) => {
                    
                    this.items = resp.data.data;
                    this.itemsLength = resp.data.meta.count
                    this.itemsPerPage = resp.data.meta.count
                    
                    this.itemsValue = this.selection
                    this.loading = false;
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    this.loading = false;
                });
        },
    },

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
    background-color: #DC4405;
    font-size: 16px;
    border-radius: 5px;
    color: white !important;
}

.chips--active {
    opacity: 1 !important;
    background-color: red !important;
}
</style>