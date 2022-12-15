<template>
    <v-row>
        <v-col class="flex-row align-center justify-center">

            <v-card elevation="1" max-width="1090" class="mx-auto flex-column py-10">
                <v-row>
                    <v-col cols="6" v-for="(item, index, id) in items" class="px-8 py-1">
                        <v-hover v-slot="{ hover }">
                            <v-card outlined color="transparent">
                                <li>
                                    <a :href="generateUrl('division', index, index)" :key="id" class="division">{{ index }}</a>
                                </li>
                                <v-expand-transition>
                                    <ul v-if="hover">
                                        <li v-for="detail in item">
                                            <a :href="generateUrl('branch', detail.branch, index)" class="branch my-2 px-0 py-3">{{ detail.branch }}</a>
                                        </li>
                                    </ul>
                                </v-expand-transition>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </v-card>
            <v-card tile class="mx-auto mt-n3" height="11px" width="281px" color="#244C5A"></v-card>
        </v-col>
    </v-row>
</template>


<script>
const axios = require("axios");
export default {

    props: ['department','division','branch'],
    data() {
        return {
            items: [],
        }
    },
    watch: {
        department: function () {
            this.getDataFromApi();
        }
    },
    methods: {
        generateUrl(type, param, index) {

            const urlLocation = String(window.location.href)
            let url = urlLocation.split(window.location.pathname)

            url = url.filter(element => {
                return element !== ''
            })
            url = url[0]
            let find = ' ';
            
            let reg = new RegExp(find, 'g');
            let department = this.department.replace(reg,'-')
            let indexFormatted = index.replace(reg, '-')
            let paramFormatted = param.replace(reg, '-')

            if (type === 'division') {

                console.log(indexFormatted)
                if (indexFormatted === 'N/A') {
                    return url +'/find-employee/' + department + '/'
                }
                return url + '/find-employee/'+ department + '/' + indexFormatted.toLowerCase() + '/3ajd9h'

            } else if (type === 'branch') {
                if (param === 'N/A') {
                    return url + '/find-employee/' + department + '/' + indexFormatted.toLowerCase() + '/-'
                }
                return url + '/find-employee/' + department + '/' + indexFormatted.toLowerCase() + '/' + paramFormatted.toLowerCase()
            }


        },
        getDataFromApi() {
            this.loading = true;

            axios.request({
                method: 'POST',
                data: {
                    department: this.$props.department
                },
                url: `http://localhost:3000/api/employees/DivisionsCard`
            }

            )

                .then((resp) => {
                    this.items = resp.data.data;
                    this.totalLength = resp.data.meta.count;
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
li {
    list-style: none;
}

a {
    font-size: 19px;
}
</style>