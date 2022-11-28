<template>
    <div class="full-width py-6 gray-bg bg-img">
      <v-container class="d-flex container-content">
        <div style="width: 40px" class="mr-4 d-flex align-center justify-center">
          <img
            style=" width:100%; filter: invert(20%) sepia(16%) saturate(1465%) hue-rotate(268deg) brightness(95%) contrast(97%)"
            :src="require('../../assets/svg/' + img)" class="m-auto" />
        </div>
        <h2 class="mb-n1" style="color:#522A44 !important; font-size: 32px !important;">{{ title }}</h2>
      </v-container>
      <div class="title-bg"></div>
    </div>
</template>

<script>
    export default {
        props: ['img','title']
    }
</script>

<style>


</style>