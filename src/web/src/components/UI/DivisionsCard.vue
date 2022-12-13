<template>
    <v-row>
        <v-col>
    
        <v-card max-width="1090"  class="mx-auto flex-column py-10">
            <v-card outlined color="transparent" v-for="(item, index, id) in items" class="px-8">
                <v-hover v-slot="{ hover }">
                    <v-card col="6" outlined color="transparent">                    
                        <li>
                            <a :key="id" class="division">{{ index }}</a>
                        </li>
                        <v-expand-transition>
                            <ul v-if="hover">
                                <li v-for="detail in item">
                                    <a class="branch my-2 px-0 py-3">{{ detail.branch }}</a>
                                </li>
                            </ul>
                        </v-expand-transition>
                    
                    </v-card>
                </v-hover>
            </v-card>
        </v-card>
    </v-col>
    </v-row>
</template>


<script>
const axios = require("axios");
export default {
    props:['division','branch'],
    data() {
        return {
            items: [],
            department: 'highways and public works',
        }
    },
    created() {
        this.getDataFromApi();
    },
    methods: {
        getDataFromApi() {
            this.loading = true;

            axios.request({
                method: 'POST',
                data: {
                    department: this.department
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