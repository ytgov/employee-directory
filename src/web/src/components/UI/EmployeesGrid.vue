<template>
    <v-data-table dense class="py-5 px-0 d-table" hide-default-footer :items="items" :headers="headers"
        :options.sync="options" :loading="loading" :items-per-page="itemsPerPage" hide-default-header mobile-breakpoint="0">
        <template v-slot:header="{ props }">
            <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
            </th>
        </template>
        <template v-slot:body="{ items }">
            <tbody class="table-body">
                <tr :class="{ 'table-body-managers': item.level === 0, 'table-body-second-managers': item.level === 1 }"
                    class="table-border" v-for='(item, index, id ) in items' :key="id">
                    <td>
                        <a class="d-flex flex-wrap align-center" :class="'ml-' + item.level" style="word-wrap: normal;"
                            :href="urlEmployee(item.department, item.full_name_url)">
                            <IconLoader v-if="item.level === 1" :color="'blue'" :image="item.level" class="angle-right">
                            </IconLoader>
                            <IconLoader v-if="item.level > 1" v-for='n in item.level' :color="'blue'" image="1"
                                class="angle-right-multiple"></IconLoader>
                            <label class="full-name">{{ item.formatted_name }}</label>
                        </a>
                    </td>
                    <td class="default-cursor"> {{ title }} </td>
                    <td class="default-cursor"> {{ email }}</td>
                    <td class="default-cursor"> <a :href="getPhone(phone_office)"
                            :class="{ telephone: mobileCheck, 'telephone-desktop': mobileCheck === false }"> {{ phone_office }} </a>
                    </td>
                </tr>
            </tbody>
        </template>

    </v-data-table>
</template>


<script>

export default {
    props: ['',],
    data(){
        return {

        }
    }
}

</script>


<style scoped></style>