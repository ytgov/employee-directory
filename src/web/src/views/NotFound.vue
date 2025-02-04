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

      <h1 class="my-16" style="font-weight:600 !important; font-size: 34px;">{{ $t("components.not_found.page_not_found") }}</h1>
      <h1 style="font-weight:500">{{ $t("components.not_found.fullpath") }} {{ latestFullPath }} {{ $t("components.not_found.fullpath_sufix") }}</h1>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("components.not_found.page_is_not_here.title") }}</h2>
        <p>{{ $t("components.not_found.page_is_not_here.body") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("components.not_found.reached_from_inside.title") }}</h2>
        <p>{{ $t("components.not_found.reached_from_inside.body.part1") }}<a
            :href="$t('yukon_urls.contact_government')">{{ $t("components.not_found.reached_from_inside.body.part2") }}</a>{{ $t("components.not_found.reached_from_inside.body.part3") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("components.not_found.reached_from_outside.title") }}</h2>
        <p>{{ $t("components.not_found.reached_from_outside.body.part1") }}<a
            :href="$t('yukon_urls.contact_government')">{{ $t("components.not_found.reached_from_outside.body.part2") }}</a>{{ $t("components.not_found.reached_from_outside.body.part3") }}</p>
      </v-card>
      <v-card class="not-found-card mb-6" color="transparent" outlined>
        <h2>{{ $t("components.not_found.address_wrong_message.title") }}</h2>
        <p>{{ $t("components.not_found.address_wrong_message.body") }}</p>
      </v-card>
      <v-btn class="my-8" @click="goToHome()" height="40px" color="#00616D">{{ $t("components.not_found.home.title") }}</v-btn>
    </v-container>
  </div>
</template>

<script>
import Aurora from '../components/UI/Aurora.vue';
import SearchBarHeader from '../components/UI/SearchBarHeader.vue'
import { syncLocaleWithRoute } from "@/utils/localeUtils.js";
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";

export default {
  components: {
    SearchBarHeader,
    Aurora
},
  data() {
    return {
      breadcrumbsList: [],
      noBgImg: false,
      latestFullPath: "",
    }
  },
  mixins: [breadcrumbMixin],
  watch: {
    "$route": {
      handler() {
        this.updateBreadCrumbs();
      },
      immediate: true,
    },
    "$i18n.locale": {
      handler() {
        this.updateBreadCrumbs();
      },
  },
  },
  emits: ['changeBg'],
  async mounted() {
    await syncLocaleWithRoute(this);
    this.$emit('changeBg');
    this.latestFullPath = this.$cookies.get("latestFullPath") || ""; 
    this.updateBreadCrumbs();

  },
  methods: {
    goToHome() {
      const locale = this.$route.params.locale || "en";
      this.$router.push(`/${locale}/find-employee`);
    }
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