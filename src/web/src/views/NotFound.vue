<template>
  <div class="home">
    <SearchBarHeader class="search-header" :title="null" />
    
    <Aurora/>

    <v-container class="px-0">

      <v-breadcrumbs class="mt-6 breadcrumbs ml-n5" :items="breadcrumbsList">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item class="z-indx" :href="item.link">
            {{ $t(item.name) }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <h1 class="my-16" style="font-weight:600 !important; font-size: 34px;">{{ $t("NotFound.pageNotFound") }}</h1>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("NotFound.isNotHere") }}</h2>
        <p>{{ $t("NotFound.mayHaveMoved") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("NotFound.followALinkIn") }}</h2>
        <p>{{ $t("NotFound.leaveAMessageIn.text1") }}<a
            :href="$t('YukonHome.contactGovernment')">{{ $t("NotFound.leaveAMessageIn.text2") }}</a>{{ $t("NotFound.leaveAMessageIn.text3") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("NotFound.followALinkIn") }}</h2>
        <p>{{ $t("NotFound.leaveAMessageOut.text1") }}<a
            :href="$t('YukonHome.contactGovernment')">{{ $t("NotFound.leaveAMessageOut.text2") }}</a>{{ $t("NotFound.leaveAMessageOut.text3") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("NotFound.typedAddressWrong") }}</h2>
        <p>{{ $t("NotFound.typedAddressWrong") }}</p>
      </v-card>
      <v-btn class="my-8" @click="$router.push('/')" height="40px" color="#00616D">Home</v-btn>
    </v-container>
  </div>
</template>

<script>
import Aurora from '../components/UI/Aurora.vue';
import SearchBarHeader from '../components/UI/SearchBarHeader.vue'

export default {
  components: {
    SearchBarHeader,
    Aurora
},
  data() {
    return {
      breadcrumbsList: [],
      noBgImg: false,
    }
  },
  watch: {
    options: {
      handler() {
        this.getEmployeesData();
      },
      '$route'() {
        this.breadcrumbsList = this.$route.meta.breadcrumb
      },
      deep: true,
    },
  },
  emits: ['changeBg'],
  mounted() {
    this.updateBreadCrumbs();
    this.$emit('changeBg');
  },
  methods: {
    updateBreadCrumbs() {
      this.breadcrumbsList = this.$route.meta.breadcrumb
    },
  },
}

</script>

<style scoped>
.not-found-card h2 {
  font-size: 26px;
}

a {
  text-decoration: underline;
}
</style>