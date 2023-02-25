
import IconLoader from '../icons/IconLoader.vue';

<template>
  <div>
  <v-container class="px-0">
    <div class=" mb-5 container text-center">
      <img src="/Aurora-mini.svg" style="margin: 5% 0px 3% 0px" height="44" />
    </div>

    <div class="pt-6" style="border-top:1px solid #d4c7cf;">
      <div class="d-flex align-end">
        <h4 class="mr-4" style="font-weight:500;">Was this page helpful? *</h4>
        <IconLoader class="icon mr-4" height="40" :image="'cabinet office'"/>
        <IconLoader class="icon icon-inverted" height="40" :image="'cabinet office'"/>
      </div>
    </div>
    <v-form class="pt-8">
      <h4 style="font-weight:500;">How did this page help you? *</h4>
      <v-textarea outlined class="mt-4 area" background-color="#f1f1f1" rows="5">

      </v-textarea>
      <v-btn class="btn px-7" tonal elevation="0" height="60px" color="#00616D">Submit feedback</v-btn>
    </v-form>
  </v-container>
</div>

</template>

<script>
import IconLoader from '../icons/IconLoader.vue';

export default {
  data() {
    return {

    }
  },
  components: {
    IconLoader
  }
}

</script>

<style scoped>
.btn {
  color: white !important;
  border: none !important;
}
.area {
  border: #ccc !important;
}

.icon-inverted {
  transform: rotate(180deg);
}

.icon {
  cursor: pointer;
}
</style>