<template>
  <div class="home">
    <SearchBarHeader class="search-header" :title="null" />

    <div class="aurora-town">
      <span class="aurora--main"></span>
    </div>

    <v-breadcrumbs class="mt-6 breadcrumbs ml-n5" :items="breadcrumbsList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item class="z-indx" :href="item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <h1 class="my-16" style="font-weight:600 !important; font-size: 34px;">Page not found</h1>
    <v-card class="not-found-card mb-6" color="transparent" outlined>
      <h2>Sorry, that page isn’t here.</h2>
      <p>You didn’t do anything wrong. We may have moved the page you're looking for somewhere else.</p>
    </v-card>
    <v-card class="not-found-card mb-6" color="transparent" outlined>
      <h2>Did you follow a link from here?</h2>
      <p>If you reached this page from another part of Yukon.ca, <a
          href="https://yukon.ca/en/your-government/contact-and-follow-government/contact-government">let us know</a> so
        we can correct our mistake.</p>
    </v-card>
    <v-card class="not-found-card mb-6" color="transparent" outlined>
      <h2>Did you follow a link from another site?</h2>
      <p>Links from other sites can sometimes be old or misspelled. <a
          href="https://yukon.ca/en/your-government/contact-and-follow-government/contact-government">Let us know</a>
        where you came from and we can try to contact the other site to fix the problem.</p>
    </v-card>
    <v-card class="not-found-card mb-6" color="transparent" outlined>
      <h2>Did you type the URL?</h2>
      <p>You may have typed the address (URL) wrong. Check to make sure you’ve got the exact right spelling or
        capitalization.</p>
    </v-card>
    <v-btn class="my-8" @click="$router.push('/')" height="40px" color="#00616D">Home</v-btn>
  </div>
</template>

<script>
import SearchBarHeader from '../components/UI/SearchBarHeader.vue'

export default {
  components: {
    SearchBarHeader,
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

body .aurora-town {
  width: 100vw;
  position: relative;
  margin-top: -6px
}

body .aurora--main {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 50px;
  -webkit-transition: all .4s ease;
  -o-transition: all .4s ease;
  transition: all .4s ease
}

@media (min-width:767px) {
  body .aurora--main {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 200px;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease
  }
}

.z-indx {
  z-index: 100;
}
body .aurora--main:before {
  position: absolute;
  top: 0;
  right: -100px;
  display: block;
  overflow: hidden;
  width: 300px;
  height: 50px;
  content: "";
  -webkit-transition: all .4s ease;
  -o-transition: all .4s ease;
  transition: all .4s ease;
  background-image: url(../../public/Aurora-small-mobile.svg);
  background-repeat: no-repeat
}

@media (min-width:767px) {
  body .aurora--main:before {
    position: absolute;
    top: -30px;
    right: -33%;
    width: 100%;
    height: 185px;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease;
    background-image: url(../../public/Aurora-main.svg);
    background-size: contain
  }
}

body .aurora--mini {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  padding: 50px 0s
}

body .aurora--mini:before {
  position: relative;
  display: block;
  width: 260px;
  height: 45px;
  margin: 0 auto;
  content: "";
  background-image: url(../../public/Aurora-main.svg);
  background-repeat: no-repeat
}
</style>