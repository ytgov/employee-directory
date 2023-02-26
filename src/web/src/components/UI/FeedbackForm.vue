<template>

  <v-container class="px-0">
    <div class=" mb-5 container text-center">
      <img src="/Aurora-mini.svg" style="margin: 5% 0px 3% 0px" height="44" />
    </div>
    <div class="pt-6 z-i" style="border-top:1px solid #d4c7cf;">
      <div class="d-flex align-end">
        <h4 class="mr-4" style="font-weight:500;">Was this page helpful? *</h4>
        <div @click="startForm(1)" class="icon mr-4">
          <IconLoader :color="colorCheck === 1 ? 'blue': 'black'" height="40" :image="'cabinet office'"/>
        </div>
        <div @click="startForm" class="icon mr-4">
          <IconLoader @click="startForm(2)" :color="colorCheck === 2 ? 'blue': 'black'" class="icon icon-inverted" height="40" :image="'cabinet office'"/>
        </div>
      </div>
    </div>
    <v-form v-if="formStatus" class="pt-8">
      <h4 style="font-weight:500;">{{ feedbackCheck === 1 ? 'How did this page help you? *' : 'How can we improve this page? *' }}</h4>
      <v-textarea outlined class="mt-4 area" background-color="#f1f1f1" rows="5">

      </v-textarea>
      <v-btn class="btn px-7" tonal elevation="0" height="60px" color="#00616D">Submit feedback</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import IconLoader from '../icons/IconLoader.vue';

export default {
  data() {
    return {
      formStatus: false,
      feedbackCheck : 0,
      colorCheck: 0,
    }
  },
  components: {
    IconLoader
  },
  watch: {
    feedbackCheck(){
      if(this.feedbackCheck === 1) {
        this.colorCheck = 1
      } else this.colorCheck = 2
    }
  },
  methods: {
    startForm(type) {
    this.formStatus = true;
    if (type === 1) {
      this.feedbackCheck = 1
    } else this.feedbackCheck = 2
    },
  },
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