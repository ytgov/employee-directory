<template>
  <div class="full-width py-6 gray-bg bg-img">
    <v-container>
      <v-row>
        <v-col cols="12" sm="2" class="d-flex algin-center justify-center">
          <div
            class="d-flex align-center justify-center icon-responsive"
          >
            <IconLoader :image="image" :color="'purple'" />
          </div>
        </v-col>
        <v-col cols="12" sm="10" class="d-flex algin-center justify-start">
          <h2
            class="mb-n1 text-responsive"
            style="color: #522a44 !important; font-size: 32px !important"
          >
            {{ title }}
          </h2>
        </v-col>
      </v-row>
    </v-container>
    <div class="title-bg"></div>
  </div>
</template>

<script>
import IconLoader from "../icons/IconLoader.vue";
export default {
  components: {
    IconLoader,
  },
  props: ["image", "title"],
};
</script>

<style scoped>

.text-responsive {
  text-align: center;
}
.icon-responsive{
  width: 100px;
}

@media (min-width: 600px) {
  .icon-responsive{
    width: 100%;
    max-width: 60px;
  }
  .text-responsive {
  text-align: left;
}
}

</style>
