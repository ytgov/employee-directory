<template>
  <div class="Homepage-departments">
    <SearchBarHeader class="z-indx" :info="this.findEmployeeHeaderInfo" :disabled="serviceUnavailable"/>
    
    <Aurora/>
    <v-container class="px-0">
      <v-breadcrumbs class="mt-sm-6 mb-sm-0 breadcrumbs mt-2 mb-n8 px-0" :items="breadcrumbsList">

        <template v-slot:item="{ item }">

          <v-breadcrumbs-item :href="item.link">
            {{ $t(item.name) }}
          </v-breadcrumbs-item>

        </template>
      </v-breadcrumbs>
      <ServiceStatusBanner   v-if="serviceUnavailable || staleData" :isStaleData="staleData"  />
      <div class="text-center loading" v-show="loading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>

      <div class="full-width pt-6 bg-img" v-if="!serviceUnavailable">
        <v-container class="container-content" v-if="!serviceUnavailable">
          <v-row>
            <v-col cols="12" sm="12" class="align-center justify d-flex">
              <h2 class="mb-n1 text-responsive" style="color: #522a44 !important; font-size: 32px !important">
                {{ $t("components.employees.browse_directory_by_department") }}
              </h2>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-row class="mb-6 mt-8">
        <v-col cols="12" md="4" sm="6" xs="12" v-for='(items, index, id) in item' :key="id">
          <v-hover v-slot="{ hover }">
            <v-card :href="indexUrl(index, items)" class="mx-auto employee-division-card" max-width="344" outlined>
              <v-card class="d-flex">
                <v-list-item three-line class="icon-list">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6  ma-2 center-items">
                      <a class="index-text department-link">             
                        {{ $t('components.departments_api')[index.trim()] ? $t('components.departments_api')[index.trim()] : index }}   
                      </a>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import IconLoader from './icons/IconLoader.vue'
import SearchBarHeader from './UI/SearchBarHeader.vue'
import * as urls from "../urls";
import Aurora from './UI/Aurora.vue';
import { syncLocaleWithRoute } from "@/utils/localeUtils.js";
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
import ServiceStatusBanner from './ServiceStatusBanner.vue';
import debounce from 'lodash/debounce';

const axios = require("axios");
export default {
  components: {
    IconLoader,
    SearchBarHeader,
    Aurora,
    ServiceStatusBanner
  },
  mixins: [breadcrumbMixin],
  name: "Employees",
  data: () => ({
    noBgImg: true,
    breadcrumbsList: [],
    show: false,
    loading: true,
    item: [],
    options: {},
    findEmployeeHeaderInfo: true,
    serviceUnavailable: false,
    staleData: false,
  }),
  created() {
    this.debouncedGetEmployees = debounce(() => {
      this.getEmployeesData();
    }, 300);
  },
  watch: {
    options: {
      handler() {
        if (this.serviceUnavailable) {
          return;
        }
        this.debouncedGetEmployees();
      },
      deep: true,
    },
    "$route": {
        handler() {
          this.getEmployeesData().then(this.updateBreadCrumbs);
        },
        immediate: true,
      },
      "$i18n.locale": {
        handler() {
          this.$nextTick(() => {
            this.getEmployeesData().then(this.updateBreadCrumbs);
          });
        },
      },
  },
  async mounted() {
    await syncLocaleWithRoute(this);
    this.updateBreadCrumbs();
  },
  methods: {
     indexUrl(field) {
      const locale = this.$i18n.locale || "en";
      let department = '/'+ locale + "/find-employee/" + field.replace(/\//g, '')
      let noSpaces = department.replaceAll(/\s/g, '-');
      return String(noSpaces)

    },
    async getEmployeesData() {
      this.loading = true;
      try {
        const resp = await axios.post(urls.EMPLOYEES_URL);
        this.staleData = resp.data.meta?.stale === true;
        this.serviceUnavailable = !resp.data?.data && !this.staleData;
        this.item = resp.data?.data || [];
      } catch (error) {
        console.error("Error fetching employees data:", error);
        this.serviceUnavailable = true;
        this.staleData = false;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style>
.center-items{
  display: flex;
  justify-content: center;
  text-align: center;
}
a.department-link{
  color:#005a65;
  white-space: normal; 
}
a.department-link:visited{
  color:#643f5d;
}
a.department-link:hover{
  color:#008392;
}
.aurora--main {
  pointer-events: none;
  position: relative;
  z-index: 0;
}
</style>