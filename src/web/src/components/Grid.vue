<template>
  <div class="employee-grid">
    <SearchBarHeader />
    <DepartmentHeader :title="title" :image="title.toLowerCase()" />
    <v-container class="px-0">
      <v-breadcrumbs class="mt-6 mb-8 breadcrumbs px-0" :items="breadcrumbsList">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.link">
            {{
              $t('components.departments_api')[item.name] ?
                $t('components.departments_api')[item.name] : ( ($t('components.divisions_api')[item.name]) ?
                  $t('components.divisions_api')[item.name] : ( ($t('components.branch_api')[item.name]) ?
                    $t('components.branch_api')[item.name] : $t(item.name)))
            }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <v-row>
        <v-col cols="12" md="2" class="d-flex align-center justify-start">
          <h4 class="">{{ $t("components.grid.group_by") }}: </h4>
        </v-col>
        <v-col cols="12" md="8">
          <v-chip-group v-model="selection" center-active mandatory>
            <v-row>
              <v-col class="d-flex flex-column align-sm-center justify-sm-space-around flex-sm-row justify-md-start">
                <v-chip label outlined color="#00616D">{{ $t("components.grid.see_all") }}</v-chip>
                <v-chip label outlined color="#00616D">{{ $t("components.grid.location") }}</v-chip>
                <v-chip label outlined color="#00616D">{{ $t("components.grid.position") }}</v-chip>
              </v-col>
            </v-row>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row>
        <DivisionsCard :division="this.division" :checkClass="this.branch" :checkHover="this.division" :department="this.department"
          class="mt-6" />
      </v-row>

      <div class="pt-6 pb-n12 mt-10 d-flex flex-column align-start justify-center">
        <div v-if="results">
          <h2 class="px-0" style="font-size: 34px !important;">{{ $t("components.grid.no_results") }}</h2>
        </div>
        <div v-else class="d-flex align-center justify-start">
          <h2 class="px-0" style="font-size: 34px !important;">   {{ ($t('components.divisions_api')[division]) ? $t('components.divisions_api')[division] : division }}    </h2>
          <h3 class="ml-4">( {{ divisionLength }} {{ $t("components.grid.results") }} )</h3>
        </div>

        <div v-if="branch !== 'All branches'" class=" d-flex align-center justify-start">
          <h2 style="font-size: 25px !important;"> {{ ($t('components.branch_api')[branch]) ? $t('components.branch_api')[branch] : branch }} </h2>
          <h3 style="font-size: 16px !important;" class="ml-4">( {{ totalLength }} {{ $t("components.grid.results") }} )</h3>
        </div>
      </div>
      <div class="text-center loading" v-show="loading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>

      <div v-if="!results">
        <div v-if="itemsValue === 0" class="mb-6 mt-2">
        <EmployeesGrid :check="mobileCheck" :items="items" :department="department" />
      </div>

      <div v-if="itemsValue === 1" v-for='(value, parent_array, key) in items' class="mb-6 mt-2">
        <v-row class="px-3">
          <div class="mt-8 d-flex align-center">
            <h3 class="division-text ">{{ cleanLocation(parent_array) }}</h3>
          </div>
        </v-row>
        <div class="mt-4 d-flex align-center">
          <EmployeesGrid :check="mobileCheck" :items="value" :department="department" />
        </div>
      </div>

      <div v-if="itemsValue === 2" v-for='(value, parent_array, key) in items' class="mb-6 mt-2">
        <v-row>
          <div class="mt-8 d-flex align-center">
            <h3 class="division-text px-3 position">{{$t('components.positions_api')[cleanParam(parent_array)] ? $t('components.positions_api')[cleanParam(parent_array)] : cleanParam(parent_array) }} </h3>
          </div>
        </v-row>
        <div class="mt-8 d-flex align-center">
          <EmployeesGrid :check="mobileCheck" :items="value" :department="department" />
        </div>
      </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import DepartmentHeader from "./UI/DepartmentHeader.vue";
import DivisionsCard from "./UI/DivisionsCard.vue";
import IconLoader from "./icons/IconLoader.vue";
import SearchBarHeader from "./UI/SearchBarHeader.vue";
import * as urls from "../urls";
import EmployeesGrid from "./UI/EmployeesGrid.vue";
import { syncLocaleWithRoute } from "@/utils/localeUtils.js";
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";


export default {
  name: "Grid",
  mixins: [breadcrumbMixin],
  components: {
    DepartmentHeader,
    DivisionsCard,
    IconLoader,
    SearchBarHeader,
    EmployeesGrid
  },
  data: () => ({
    results: false,
    itemsValue: null,
    selection: '',
    dataTableParam: 0,
    branch: '',
    breadcrumbsList: [],
    department: '',
    title: '',
    division: '',
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    divisionLength: 0,
    headers: [
      { text: "Name", value: "formatted_name" },
      { text: "Position", value: "title" },
      { text: "Email address", value: "email" },
      { text: "Phone number", value: "phone_office" },
    ],
    page: 1,
    pageCount: 0,
    itemsPerPage: 9999,
    windowWidth: window.innerWidth,
    mobileCheck: false,
  }),
  watch: {
    "$route": {
      handler() {
        this.getDataFromApi().then(this.updateBreadCrumbs);
      },
      immediate: true,
    },
    "$i18n.locale": {
      handler() {
        this.$nextTick(() => {
          this.getDataFromApi().then(this.updateBreadCrumbs);
        });
      },
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
  },
  windowWidth: {
    handler() {
      if (this.windowWidth > 900) {

        this.mobileCheck = false
      } else this.mobileCheck = true
    }
  },
  async mounted() {
    await syncLocaleWithRoute(this);
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
    this.mobileCheck = this.windowWidth <= 900;
    this.$root.$on("localeChanged", this.updateBreadCrumbs);
    this.getDataFromApi();
  },
  beforeDestroy() {
    this.$root.$off("localeChanged", this.updateBreadCrumbs);
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    cleanParam(param) {
      return param === "-" ? "N/A" : param;
    },
    cleanLocation(location) {
      if (location[0] === ',') {
        let link = location.slice(1);
        return link.replace(/['"]+/g, '')
      } else {
        return location.replace(/['"]+/g, '')
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
    capitalizeString(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async getDataFromApi() {
      await syncLocaleWithRoute(this);
      var find = '-';
      var reg = new RegExp(find, 'g');
      const { department, division, branch } = this.$route.params;
      this.loading = true;
      this.title = this.capitalizeString(department.replace(reg, ' '))

      this.department = this.capitalizeString(department.replace(reg, ' '))
      this.division = this.capitalizeString(division.replace(reg, ' '))
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

          if (this.items.length === 0) {
            this.results = true
          }
          const locale = this.$i18n.locale || "en";
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

<style scoped></style>