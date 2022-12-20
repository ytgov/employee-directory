<template>
    <div class="books">

        <SearchBarHeader/>

        <DepartmentHeader :title="this.department" :image="this.department.toLowerCase()" />

        <v-breadcrumbs class="mt-6 breadcrumbs" :items="breadcrumbsList">
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item :href="item.link">
                    {{ item.name }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>

        <div class="text-center loading" v-show="loading">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-row class=" mt-16"></v-row>
        <v-row>
            <v-col  v-for="item in employee">
                <h2 class="mb-1" style="color: #DC4405 !important;font-size: 34px !important;">{{ item.full_name }}</h2>
                <h3 v-if="checkStatus(item.title)" class="mb-8"
                    style="color: #512A44 !important; font-size: 24px !important; ">{{ item.title }}</h3>

                <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
                    <h2 class="mt-4 mb-2">Organization</h2>
                    <v-row>
                        <v-col cols="6" class="mb-1">
                            <h3 v-if="checkStatus(item.department)" class="mb-0">Department: <a>{{ item.department
                            }}</a></h3>
                            <h3 v-if="checkStatus(item.division)" class="mb-0">Division: <a>{{ item.division }}</a></h3>
                        </v-col>
                        <v-col cols="6">
                            <h3 v-if="checkStatus(item.branch)" class="mb-0">Branch: <a>{{ item.branch }}</a></h3>
                            <h3 v-if="checkStatus(item.unit)" class="mb-0">Unit: <span>{{ item.unit }}</span></h3>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
                    <h2 class="mt-4 mb-2">Contact:</h2>
                    <v-row>
                        <v-col class="mb-1">
                            <h3 v-if="checkStatus(item.phone_office)" class="mb-0">Phone Office: <a>{{ item.phone_office
                            }}</a></h3>
                            <h3 v-if="checkStatus(item.mobile)" class="mb-0">Mobile: <a>{{ item.mobile }}</a></h3>
                        </v-col>
                        <v-col>
                            <h3 v-if="checkStatus(item.email)" class="mb-0">E-mail Address: <a>{{ item.email }}</a></h3>
                            <h3 v-if="checkStatus(item.fax_office)" class="mb-0">Fax Office: <span>{{ item.fax_office
                            }}</span></h3>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card v-if="checkStatus(item.manager)" class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
                    <h2 class="mt-4 mb-2">Position Information</h2>
                    <v-row>
                        <v-col class="mb-1">
                            <h3 class="mb-0">Manager: <span>{{ item.manager }}</span></h3>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card class="my-5 py-1 pb-3 px-5 employee-detail" elevation="1">
                    <h2 class="mt-4 mb-2">Location</h2>
                    <v-row>
                        <v-col class="mb-1">
                            <h3 v-if="checkStatus(item.office)" class="mb-0">Office: <span>{{ item.office }}</span></h3>
                            <h3 v-if="checkStatus(item.suite)" class="mb-0">Suite: <span>{{ item.suite }}</span></h3>
                            <h3 v-if="checkStatus(item.address)" class="mb-0">Address: <a>{{ item.address }}</a></h3>
                            <h3 v-if="checkStatus(item.community)" class="mb-0">Community: <span>{{ item.community
                            }}</span></h3>
                            <h3 v-if="checkStatus(item.postal_code)" class="mb-0">Postal Code: <span>{{ item.postal_code
                            }}</span></h3>
                            <h3 v-if="checkStatus(item.mailcode)" class="mb-0">Mail Code: <span>{{ item.mailcode
                            }}</span></h3>
                            <h3 v-if="checkStatus(item.po_box)" class="mb-0">P.O. Box: <span>{{ item.po_box }}</span>
                            </h3>
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
import SearchBarHeader from "./UI/SearchBarHeader.vue";

const axios = require("axios");
export default {
    components: {
        DepartmentHeader,
        SearchBarHeader,
    },
    name: "EmployeeDetail",
    data: () => ({
        department: '',
        breadcrumbsList: [],
        employee: [],
        show: 90,
        loading: false,
        items: [],
        search: "",
        title: '',
        options: {},
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
    computed: {

    },
    mounted() {
        this.getDataFromApi();

    },
    methods: {
        checkStatus(param) {
            if (param == null || param == "" || param == "-") {
                return false
            } else if (param.length > 0) {
                return true
            }
        },

        generateUrl(param) {
            let find = ' ';
            let reg = new RegExp(find, 'g');
            let paramFormatted = param.replace(reg, '-')
            return this.title + '/' + paramFormatted

        },
        toggleBranches(param) {
            if (this.show === param) {
                this.show = null
            } else
                this.show = param;
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
                    this.department = resp.data.data[0].department
                    this.division = resp.data.data[0].division
                    this.branch = resp.data.data[0].branch
                    this.title = resp.data.data[0].full_name
                    this.loading = false;
                    this.updateBreadCrumbs();
                })

                .catch((err) => console.error(err))
                .finally(() => {
                    this.loading = false;
                });


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
                } else if (element.name == 'Division') {
                    element.name = this.division;
                    element.link = ('/find-employee/' + this.department + '/' + this.division).replace(reg, '-').toLowerCase() + '/all-branches'
                } else if (element.name == 'Branch') {
                    if (this.branch === null) {
                        element.name = null
                        element.link = null
                    }
                    element.name = this.branch;
                    element.link = ('/find-employee/' + this.department + '/' + this.division + '/' + this.branch).replace(reg, '-').toLowerCase()
                } else if (element.name == 'Username') {
                    element.name = this.title
                }
            }))



            
            this.breadcrumbsList = arr
        },
    }
};
</script>
  
<style>
.v-main {
    background: white !important;
}

.employee-detail a {
    font-size: 22px;
    font-weight: 400;
    text-decoration: underline;
}

.employee-detail h2,
.employee-detail h3 {
    font-weight: bold;
}

.employee-detail h2 {
    font-size: 30px;
}

.employee-detail h3 {
    font-size: 22px;
}
</style>