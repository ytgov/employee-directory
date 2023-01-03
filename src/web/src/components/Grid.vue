<template>
  <div class="books">

    <SearchBarHeader />

    <DepartmentHeader :title="title" :image="title.toLowerCase()" />

    <v-breadcrumbs class="mt-6 mb-8 breadcrumbs" :items="breadcrumbsList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <v-row>
      <v-col xs="12" md="2" class="d-flex align-center justify-start">
        <h4 class="">Group by their: </h4>
      </v-col>
      <v-col xs="12" md="10">
        <v-chip-group v-model="selection" center-active mandatory active-class="chips--active">
          <v-chip label outlined color="#00616D">All Employees</v-chip>
          <v-chip label outlined color="#00616D">By Location</v-chip>
          <v-chip label outlined color="#00616D">By Position</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
      <DivisionsCard :division="this.div" :checkClass="this.branch.toLowerCase()" :checkHover="this.div.toLowerCase()"
        :department="this.department.toLowerCase()" class="mt-6" />
    </v-row>
    
    <div class=" pl-6 pt-6 pb-n12 mt-10 d-flex flex-column align-start justify-center">

      <div class=" d-flex align-center justify-start">
        <h2 style="font-size: 34px !important;">{{ div }}</h2>
        <h3 class="ml-4">( {{ divisionLength }} Results )</h3>
      </div>
      <div v-if="branch !== 'All branches'" class=" d-flex align-center justify-start">
        <h2 style="font-size: 25px !important;">{{ branch }}</h2>
        <h3 style="font-size: 16px !important;" class="ml-4">( {{ totalLength }} Results )</h3>
      </div>
    </div>
    <div class="text-center loading" v-show="loading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-if="itemsValue === 0" class="class=d-flex mb-6 mt-2">

      <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="items" :headers="headers"
        :options.sync="options" :loading="loading" :items-per-page="itemsPerPage" hide-default-header
        mobile-breakpoint="0">
        <template v-slot:header="{ props }">
          <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
          </th>
        </template>
        <template v-slot:body="{ items }">
          <tbody class="table-body">
            <tr :class="{ 'table-body-managers': item.level === 0, 'table-body-second-managers': item.level === 1 }" class="table-border"
              v-for='(item, index, id ) in items' :key="id">
              <td>
                <a class="d-flex flex-wrap align-center" :class="'ml-' + item.level" style="word-wrap: normal;"
                  :href="urlEmployee(item.department, item.full_name_url)">
                  <IconLoader v-if="item.level === 1" :color="'blue'" :image="item.level" class="angle-right"></IconLoader> 
                  <IconLoader v-if="item.level > 1"  v-for='n in item.level'  :color="'blue'" image="1" class="angle-right-multiple"></IconLoader>
                  <label class="full-name">{{ item.full_name }}</label>
                </a>
              </td>
              <td>{{ item.title }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone_office }}</td>
              <td>{{ item.manager }}</td>
            </tr>
          </tbody>
        </template>

      </v-data-table>

    </div>

    <div v-if="itemsValue === 1" v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
      <v-row>
        <div class="mt-8 ml-12 d-flex align-center">
          <h3 class="division-text ">{{ cleanLocation(parent_array) }}</h3>
        </div>
      </v-row>
      <div class="mt-4 ml-5 d-flex align-center">
        <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="value" :headers="headers"
          :loading="loading" hide-default-header mobile-breakpoint="0">
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

    <div v-if="itemsValue === 2" v-for='(value, parent_array, key) in items' class="class=d-flex mb-6 mt-2">
      <v-row>
        <div class="mt-8 ml-12 d-flex align-center">
          <h3 class="division-text ">{{ cleanParam(parent_array) }}</h3>
        </div>
      </v-row>
      <div class="mt-8 ml-5 d-flex align-center">
        <v-data-table dense class="pa-5 d-table auto width-100" hide-default-footer :items="value" :headers="headers"
          :loading="loading" hide-default-header mobile-breakpoint="0">
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
    </div>›
  </div>
</template>

<script>
const axios = require("axios");
import DepartmentHeader from "./UI/DepartmentHeader.vue";
import DivisionsCard from "./UI/DivisionsCard.vue";
import IconLoader from "./icons/IconLoader.vue";
import SearchBarHeader from "./UI/SearchBarHeader.vue";
export default {
  name: "Grid",
  components: {
    DepartmentHeader,
    DivisionsCard,
    IconLoader,
    SearchBarHeader,
  },
  data: () => ({
    itemsValue: null,
    selection: '',
    dataTableParam: 0,
    branch: '',
    breadcrumbsList: [],
    department: '',
    title: '',
    div: '',
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    divisionLength: 0,
    headers: [
      { text: "Name", value: "full_name" },
      { text: "Position", value: "title" },
      { text: "E-Mail Address", value: "email" },
      { text: "Phone Number", value: "phone_office" },
    ],
    page: 1,
    pageCount: 0,
    itemsPerPage: 9999,
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
  methods: {
    cleanParam(param) {
      if (param === '-') {
        param = 'N/A'
      }
      return param;
    },
    cleanLocation(location) {
      if (location[0] === ',') {
        let link = location.slice(1);
        return link.replace(/['"']+/g, '')
      } else {
        return location.replace(/['"']+/g, '')
      }
    },
    urlEmployee(department, name) {
      var find = ' ';
      var reg = new RegExp(find, 'g');
      return '/find-employee/employee-detail/' + department.replace(reg, '-').toLowerCase() + '/' + name.toLowerCase()
    },
    capitalizeString(param) {
      const string = param
      return string.charAt(0).toUpperCase() + string.slice(1);
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
          element.name = this.div;
          if (this.branch !== 'all-branches') {
            element.link = ('/find-employee/' + this.department + '/' + this.div).replace(reg, '-').toLowerCase() + '/all-branches'
          } else {
            element.link = null
          }
        } else if (element.name == 'Branch') {
          if (this.branch === 'all-branches') {
            element.name = null
          } else {
            element.name = this.branch;
          }
        }
      }))
      this.breadcrumbsList = arr
    },
    getDataFromApi() {
      var find = '-';
      var reg = new RegExp(find, 'g');
      const { department, division, branch } = this.$route.params;
      this.loading = true;
      let formattedQueryParam = ''
      if (division == null) {
        formattedQueryParam = `${encodeURIComponent(`${department}`)}`
      } else if (division !== null && branch == null || branch == undefined) {
        formattedQueryParam = `${encodeURIComponent(`${department}-%252F-${division}`)}`
      } else if (division !== null && branch !== null) {
        formattedQueryParam = `${encodeURIComponent(`${department}-%252F-${division}-%252F-${branch}`)}`
      }
      this.title = this.capitalizeString(department.replace(reg, ' '))
      this.department = this.capitalizeString(department.replace(reg, ' '))
      this.div = this.capitalizeString(division.replace(reg, ' '))
      this.branch = this.capitalizeString(branch.replace(reg, ' '))
      const search = `${encodeURIComponent(`${this.search}`)}`;
      axios
        .request({
          method: 'POST',
          data: {
            groupBy: this.selection,
          },
          url: `http://localhost:3000/api/employees/Find-Employee/${department}/${division}/${branch}?search=`
        })
        .then((resp) => {
          this.items = resp.data.data;
          this.totalLength = resp.data.meta.branchCount;
          this.divisionLength = resp.data.meta.divisionCount;
          this.itemsPerPage = resp.data.meta.divisionCount;
          this.itemsValue = this.selection
          this.updateBreadCrumbs();
          this.loading = false;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });
    },
  }
};
</script>

<style scoped>
.full-name{
  margin-left:3px;
}
.table-header {
  height: 300px !important;
  background-color: green;
}
.bg-img {
  background-image: url(../../public/Aurora-main.svg);
  background-repeat: no-repeat;
  background-position-x: 300px;
  background-position-y: center;
}
@media (min-width: 1180px) {
  .bg-img {
    background-position-x: 2878px;
    background-position-y: center;
  }
}
.overf {
  z-index: 1;
  overflow: hidden;
}
.angle-right{
  width: 6px;
}
.angle-right-multiple{
  width: 5px;
}
</style>