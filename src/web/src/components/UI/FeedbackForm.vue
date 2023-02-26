<template>
  <v-container class="px-0">
    <div class=" mb-5 container text-center">
      <img src="/Aurora-mini.svg" style="margin: 5% 0px 3% 0px" height="44" />
    </div>
    <div class="pt-6 z-i" style="border-top:1px solid #d4c7cf;">
      <div class="d-flex align-end">
        <h4 class="mr-4" style="font-weight:500;">Was this page helpful? *</h4>
        <div @click="startForm(1)" class="icon mr-4">
          <IconLoader :color="colorCheck === 1 ? 'blue' : 'black'" height="40" :image="'cabinet office'" />
        </div>
        <div @click="startForm" class="icon mr-4">
          <IconLoader @click="startForm(2)" :color="colorCheck === 2 ? 'blue' : 'black'" class="icon icon-inverted"
            height="40" :image="'cabinet office'" />
        </div>
      </div>
    </div>
    <v-form ref="feedbackForm" @submit.prevent="sendEmail" v-if="formStatus" class="pt-8">
      <h4 style="font-weight:500;">{{ feedbackCheck === 1 ? 'How did this page help you? *' : 'How can we improve this page ? * ' }}</h4>
      <v-textarea :error-messages="this.feedbackError ? ['Please enter a message!'] : []" v-model="feedbackText" outlined
        class="mt-4 area" background-color="#f1f1f1" rows="5">

      </v-textarea>
      <v-btn type="submit" class="btn px-7" tonal elevation="0" height="60px" color="#00616D">Submit feedback</v-btn>
    </v-form>

    <v-card class="form-success my-4 pa-4" v-if="success">Thanks for taking the time to send us your feedback.</v-card>
  </v-container>
</template>

<script>

import { Email } from '@/assets/smtp/smtp.js'

import IconLoader from '../icons/IconLoader.vue';

import { emailConfig } from '@/config.js'


export default {
  data() {
    return {
      formStatus: false,
      feedbackCheck: 0,
      colorCheck: 0,
      feedbackText: '',
      feedbackError: false,
      success: false,
    }
  },
  components: {
    IconLoader
  },
  watch: {
    feedbackCheck() {
      if (this.feedbackCheck === 1) {
        this.colorCheck = 1
      } else this.colorCheck = 2
    },
    feedbackText() {
      if (this.feedbackText !== '') {
        this.feedbackError = false
      }
    }
  },
  methods: {
    convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
  },


    startForm(type) {
      this.formStatus = true;
      if (type === 1) {
        this.feedbackCheck = 1
      } else this.feedbackCheck = 2
    },
    sendEmail() {
      if (this.feedbackText === '') {
        this.feedbackError = true
        return
      } else {
        const convertedDate = this.convertTZ(new Date()) 

        convertedDate.getHours();

        let emailSubject = '';

        const url = window.location.href;

        if(this.feedbackCheck === 1) {
          emailSubject = 'How did this page help you?'
        } else emailSubject = 'How can we improve this page?'

        Email.send({


          SecureToken: emailConfig[0].SecureToken,
          To: emailConfig[0].To,
          From: emailConfig[0].From,
          Subject: emailConfig[0].Subject,
          Body: `

          <h2>Submited on: ${convertedDate}</h2> <br>
          <h3>${emailSubject}</h3> <br>
          <p>${this.feedbackText}</p> <br>
          <p>Url: ${url}</p>

          `
        }).then(() => this.formStatus = false, this.success = true, this.colorCheck = 0, this.feedbackText = '');
      }
    }
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

.form-success {
  border: none !important;
  background-color: #dbedcf !important;
}
</style>