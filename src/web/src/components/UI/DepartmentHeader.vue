<template>
  <div class="full-width py-6 gray-bg bg-img">
    <v-container class="small-container">
      <v-row>
        <v-col cols="12" sm="2" class="d-flex algin-center justify-center">
          <div
            class="d-flex align-center justify-center icon-responsive"
          >
            <IconLoader height="60px" :image="image" :color="'purple'" />
          </div>
        </v-col>
        <v-col cols="12" sm="10" class="justiy">
          <h2
            class="mb-n1 text-responsive"
            style="color: #522a44 !important; font-size: 32px !important"
          >
            {{ title }}
          </h2>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import IconLoader from "../icons/IconLoader.vue";
export default {
  components: {
    IconLoader,
  },
  props: ["image", "title"],
  data() {
    return {
      active: false,
    }
  },
};
</script>

<style scoped>

.bg-img {
  background-image: url(../../../public/Aurora-main.svg);
  background-repeat: no-repeat;
  background-position: calc(100% + 50px) 0;
  background-position-y: -10px;
  background-size:300px;
}

@media (min-width: 600px) {
  .bg-img {

    background-position: calc(80% + 500px) 0;
    background-position-y: center;
    background-size: 800px;
  }
}
.justify {
  display: flex;
  align-content: center;
  justify-content:center;
}
.text-responsive {
  text-align: center;
}
.icon-responsive{
  width: 100px;
  height:60px;
}

@media (min-width: 600px) {

  .justify {
    justify-content: start;
  }
  .icon-responsive{
    width: 100%;
    max-width: 60px;
    
  }
  .text-responsive {
  text-align: left;
}
}

@media (min-width: 1904px) {
  .small-container{
    max-width: 1185px;
  }
}

</style>
