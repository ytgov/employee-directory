<template>

    <div class="full-width yellow-border white-bg ml-0 pl-0 pt-16 mt-n5">

        <v-container class="container-content ">
            <h1 class="ml-5">Find a goverment Employee</h1>

            <v-banner v-if="info" class="mb-6 mt-13">
                <span>
                    You can use this service to find the contact information of a person who works for a Government of
                    Yukon
                    organization.
                </span>
                <br />
                <br />
                Enter the person's first or last name, position title, email address or telephone number in the search
                box to
                get started. You can also enter the name of a department, division or branch to view all employees in
                that
                specific organization.
            </v-banner>

            <v-form>

            
            <v-row>
                <v-col sm="5" cols="12">
                    <v-text-field label="Search by Name" v-model="nameSearch" dense=""
                        background-color="#F1F1F1" outlined="outlined" flat="" color="" solo>
                    </v-text-field>
                </v-col>
                <v-col sm="5" cols="12">
                    <v-select  :items="item" v-model="departmentSearch" dense="" background-color="#F1F1F1"
                        outlined="outlined" flat="" label="Department" solo>
                    </v-select>
                </v-col>
                <v-col class="d-flex justify-top" sm="2" cols="12">
                    <v-btn width="100%" :href="updateSearch()" class="mt-0 py-2" height="40px" type="submit" color="#00616D">Search</v-btn>
                </v-col>
            </v-row>
        </v-form>



        </v-container>





    </div>
</template>


<script>

const axios = require("axios");

export default {

    created() {
        this.getEmployeesData()
    },
    data() {
        return {
            options: [],
            item: [],
            nameSearch: '',
            departmentSearch: ''
        }
    },
    props: ['info',],

    methods: {
        submit() {
            if (this.departmentSearch === '') {
                console.log('working')
            }
        },

        updateSearch() {
            const find = ' ';
            const reg = new RegExp(find, 'g');
            let name = this.nameSearch.replace(/\s+/g, '.').trim()
            let department = this.departmentSearch.replace(reg, '-')

            if (name === '') {
                return '/find-employee/' + department.toLowerCase()
            }

            name = 'keyword=' + name.trim()

            if (department !== '') {
                department = '&department=' + department.toLowerCase()
            } else {
                department = '&department=any-department'
            }
            return '/find-employee/search/' + name.toLowerCase().trim() + department.toLowerCase()
        },
        getEmployeesData() {
            this.loading = true;

            axios
                .post(
                    "http://localhost:3000/api/employees/searchBar",
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
    }



}

</script>


<style scoped>
.v-text-field>>>fieldset {
    border: 1.5px solid #F3A901;
}
</style>