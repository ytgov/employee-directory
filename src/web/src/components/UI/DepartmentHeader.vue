<template>
  <div class="full-width py-6 gray-bg bg-img">
    <v-container class="d-flex container-content">
      <div style="width: 40px" class="mr-4 d-flex align-center justify-center">
        <IconLoader :image="image" :color="'purple'" />
      </div>
      <h2 class="mb-n1" style="color:#522A44 !important; font-size: 32px !important;">{{ title }}</h2>
    </v-container>
    <div class="title-bg"></div>
  </div>
</template>

<script>
import IconLoader from '../icons/IconLoader.vue'
export default {
  components: {
    IconLoader
  },
  props: ['image', 'title']
}
</script>

<style>

</style>