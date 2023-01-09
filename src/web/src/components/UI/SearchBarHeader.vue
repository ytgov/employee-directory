<template>

    <div class="full-width yellow-border white-bg ml-0 pl-0 pt-16 mt-n5">

        <v-container class="container-content ">
            <h1>Find a goverment Employee</h1>

            <div v-if="info" class="mb-6 mt-6">
                <p><strong>
                    You can use this service to find the contact information of a person who works for a Government of
                    Yukon
                    organization.
                </strong></p>

                <p>
                Enter the person's first or last name, position title, email address or telephone number in the search
                box to
                get started. You can also enter the name of a department, division or branch to view all employees in
                that
                specific organization.
                </p >
            </div>

            <v-form @submit.prevent="updateSearch" class="ml-4 pt-8">

            
            <v-row>
                <v-col class="mb-n9" sm="5" cols="12">
                    <v-text-field :error-messages="this.nameError?  ['Please enter a valid name.'] : []" label="Search by Name" v-model="nameSearch" dense=""
                        background-color="#F1F1F1" outlined="outlined" flat="" color="" solo>
                    </v-text-field>
                </v-col>
                <v-col class="mb-n9" sm="5" cols="12">
                    <v-select :error-messages="this.dptError?  ['Please select a department.'] : []" :items="item" v-model="departmentSearch" dense="" background-color="#F1F1F1"
                        outlined="outlined" flat="" label="Department" solo>
                    </v-select>
                </v-col>
                <v-col class="d-flex justify-top mb-3" sm="2" cols="12">
                    <v-btn width="100%" class="mt-0 py-2" height="40px" type="submit" color="#00616D">Search</v-btn>
                </v-col>
            </v-row>
        </v-form>



        </v-container>





    </div>
</template>


<script>

const axios = require("axios");
import * as urls from "../../urls";

export default {
    watch:{
        nameSearch(){
            if(this.nameSearch !== ''){
                this.nameError = false
            }
        },
        departmentSearch(){
            if(this.departmentSearch !== ''){
                this.dptError =false
            }
        }
    },
    created() {
        this.getEmployeesData()
    },
    data() {
        return {
            options: [],
            item: [],
            nameSearch: '',
            departmentSearch: '',
            nameError: false,
            dptError: false,
        }
    },
    props: ['info',],

    methods: {

        

        updateSearch() {
            const find = ' ';
            const reg = new RegExp(find, 'g');
            let name = this.nameSearch.replace(/\s+/g, '.').trim()
            
            let department = this.departmentSearch.replace(reg, '-').replace(/\//g,'')
            
            if (name === '') {
                this.nameError =true
                return
            } else if(department === '') {
                this.dptError = true
                return
            }

            name = 'keyword=' + name.trim()

            department = '&department=' + department.toLowerCase()
            
            window.location.href = '/find-employee/search/' + name.toLowerCase().trim() + department.toLowerCase()
        },
        getEmployeesData() {
            this.loading = true;

            axios
                .post(
                    `${urls.EMPLOYEES_URL}searchBar`,
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