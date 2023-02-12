<template>
  <div class="home">
    <h1>Not Found</h1>
    <div v-if="employee === true">
      <h2>This Employee is not available.</h2>
      <v-btn @click="$router.go(-1)" height="40px" color="#00616D">Go back</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      employee: false,
    }
  },
  created() {
    this.checkError();
  },

  methods : {
    checkError() {
      if(window.location.href.includes('/employee-not-found/')){
        this.employee = true;
      }

    }
  }
}

</script>
