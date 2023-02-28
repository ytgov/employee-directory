<template>
  <div class="books">

    <SearchBarHeader />

    <DepartmentHeader :title="title" :image="title.toLowerCase()" />
    <v-container class="px-0">
      <v-breadcrumbs class="mt-6 mb-8 breadcrumbs px-0" :items="breadcrumbsList">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.link">
            {{ item.name }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <v-row>
        <v-col cols="12" md="2" class="d-flex align-center justify-start">
          <h4 class="">Group by: </h4>
        </v-col>
        <v-col cols="12" md="8">
          <v-chip-group v-model="selection" center-active mandatory>
            <v-row>
              <v-col class="d-flex flex-column align-sm-center justify-sm-space-around flex-sm-row justify-md-start">
                <v-chip label outlined color="#00616D">See all government employees</v-chip>
                <v-chip label outlined color="#00616D">Location</v-chip>
                <v-chip label outlined color="#00616D">Position</v-chip>
              </v-col>
            </v-row>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row>
        <DivisionsCard :division="this.div" :checkClass="this.branch" :checkHover="this.div"
          :department="this.department" class="mt-6" />
      </v-row>

      <div class="pt-6 pb-n12 mt-10 d-flex flex-column align-start justify-center">

        <div class="d-flex align-center justify-start">
          <h2 class="px-0" style="font-size: 34px !important;">{{ div }}</h2>
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
      <div v-if="itemsValue === 0" class="mb-6 mt-2">
        <!-- <EmployeesGrid/> -->
        <v-data-table dense class="py-5 px-0 d-table" hide-default-footer :items="items" :headers="headers"
          :options.sync="options" :loading="loading" :items-per-page="itemsPerPage" hide-default-header
          mobile-breakpoint="0">
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
                <td class="default-cursor"> {{ item.title }} </td>
                <td class="default-cursor"> {{ item.email }}</td>
                <td class="default-cursor"> <a :href="getPhone(item.phone_office)" :class="{ telephone: mobileCheck, 'telephone-desktop' : mobileCheck === false }"> {{ item.phone_office }} </a>
                </td>
              </tr>
            </tbody>
          </template>

        </v-data-table>

      </div>

      <div v-if="itemsValue === 1" v-for='(value, parent_array, key) in items' class="mb-6 mt-2">
        <v-row class="px-3">
          <div class="mt-8 d-flex align-center">
            <h3 class="division-text ">{{ cleanLocation(parent_array) }}</h3>
          </div>
        </v-row>
        <div class="mt-4 d-flex align-center">
          <v-data-table dense class="py-5 d-table" hide-default-footer :items="value" :headers="headers"
            :loading="loading" hide-default-header mobile-breakpoint="0">
            <template v-slot:header="{ props }">
              <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
              </th>
            </template>
            <template v-slot:body="{ items }">
              <tbody class="table-body">
                <tr class="table-border" v-for='item in value'>
                  <td>
                    <a class="d-flex flex-wrap align-center full-name" style="word-wrap: normal"
                      :href="urlEmployee(item.department, item.full_name_url)">
                      {{ item.formatted_name }}
                    </a>
                  </td>
                  <td class="default-cursor">{{ item.title }}</td>
                  <td class="default-cursor">{{ item.email }}</td>
                  <td class="default-cursor"> <a :href="getPhone(item.phone_office)" :class="{ telephone: mobileCheck, 'telephone-desktop' : mobileCheck === false }"> {{ item.phone_office }} </a></td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </div>
      </div>

      <div v-if="itemsValue === 2" v-for='(value, parent_array, key) in items' class="mb-6 mt-2">
        <v-row>
          <div class="mt-8 d-flex align-center">
            <h3 class="division-text px-3">{{ cleanParam(parent_array) }}</h3>
          </div>
        </v-row>
        <div class="mt-8 d-flex align-center">
          <v-data-table dense class="py-5 d-table" hide-default-footer :items="value" :headers="headers"
            :loading="loading" hide-default-header mobile-breakpoint="0">
            <template v-slot:header="{ props }">
              <th class="data-header py-3 pl-3 " v-for="head in props.headers">{{ head.text }}
              </th>
            </template>
            <template v-slot:body="{ items }">
              <tbody class="table-body">
                <tr class="table-border" v-for='item in value'>
                  <td>
                    <a class="d-flex flex-wrap align-center full-name" style="word-wrap: normal"
                      :href="urlEmployee(item.department, item.full_name_url)">
                      {{ item.formatted_name }}
                    </a>
                  </td>
                  <td class="default-cursor">{{ item.title }}</td>
                  <td class="default-cursor">{{ item.email }}</td>
                  <td class="default-cursor"> <a :href="getPhone(item.phone_office)" :class="{ telephone: mobileCheck, 'telephone-desktop' : mobileCheck === false }"> {{ item.phone_office }} </a> </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import DepartmentHeader from "./UI/DepartmentHeader.vue";
import DivisionsCard from "./UI/DivisionsCard.vue";
import IconLoader from "./icons/IconLoader.vue";
import SearchBarHeader from "./UI/SearchBarHeader.vue";
import * as urls from "../urls";
import EmployeesGrid from "./UI/EmployeesGrid.vue";

export default {
  name: "Grid",
  components: {
    DepartmentHeader,
    DivisionsCard,
    IconLoader,
    SearchBarHeader,
    EmployeesGrid
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
      { text: "Name", value: "formatted_name" },
      { text: "Position", value: "title" },
      { text: "E-mail address", value: "email" },
      { text: "Phone number", value: "phone_office" },
    ],
    page: 1,
    pageCount: 0,
    itemsPerPage: 9999,
    windowWidth: window.innerWidth,
    mobilecheck: false,
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
    },
    windowWidth: {
      handler() {
        if (this.windowWidth > 900) {
          this.mobileCheck = false
        } else this.mobileCheck = true
      }
    }
  },
  emits: ['changeBg'],
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
    if (this.windowWidth > 900) {
      this.mobileCheck = false
    } else this.mobileCheck = true
    this.getDataFromApi();
    this.updateBreadCrumbs();
    this.$emit('changeBg');
  },
  methods: {
    getPhone(number) {
      const find = "-";
      const reg = new RegExp(find, "g");
      const numberFormatted = number.replace(reg, "");
      const link = "tel:" + numberFormatted;

      if(this.mobileCheck === false) {
        return
      } else { return String(link); }
    },
    onResize() {
      this.windowWidth = window.innerWidth
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
        return link.replace(/['"']+/g, '')
      } else {
        return location.replace(/['"']+/g, '')
      }
    },
    urlEmployee(department, name) {
      var find = ' ';
      var reg = new RegExp(find, 'g');
      return '/find-employee/employee-detail/' + department.replace(reg, '-') + '/' + name
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
          element.link = '/find-employee/' + this.department.replace(reg, '-')
        } else if (element.name == 'Division') {
          element.name = this.div;
          if (this.branch !== 'all-branches') {
            element.link = ('/find-employee/' + this.department + '/' + this.div).replace(reg, '-') + '/all-branches'
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
      arr = arr.filter(item => item.name !== null)
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
          url: `${urls.FIND_EMPLOYEE_URL}${department}/${division}/${branch}?search=`
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
.full-name {
  cursor: pointer;
  margin-left: 3px;
}

.table-header {
  height: 300px !important;
}

.overf {
  z-index: 1;
  overflow: hidden;
}

.angle-right {
  width: 6px;
}

.angle-right-multiple {
  width: 5px;
}
</style>