<template>
  <v-app style="background-color: #333333">
    <v-card class="mx-auto" max-width="800" style="margin-top: 10%;">
        <!-- Check the workshop step that tells you to add a banner image (and change the extension if needed) -->
        <v-img class="align-end text-white" src="@/assets/banner.jpeg" cover>   
            <v-card-title>My Event Planner</v-card-title>
        </v-img>         
        <v-card-subtitle class="pt-4">Find, book, and create campus events</v-card-subtitle>
        <v-card-text>
          There are so many great events happening on campus, it can be hard to keep
          track! Now there is a way to find upcoming events, book tickets, and even create your
          own events, all from a single app.        
      </v-card-text>  
      <v-card-actions>
        <v-btn color="primary" @click="showSignin=true">Sign in</v-btn>        
      </v-card-actions>
    </v-card>
    <!-- This dialog only shows when the user clicks sign in -->
    <v-dialog v-model="showSignin"  width="unset">
        <v-card>
            <authenticator/>                        
        </v-card>   
    </v-dialog>
  </v-app>
</template>

<script setup>
import { Authenticator } from "@aws-amplify/ui-vue"
import "@aws-amplify/ui-vue/styles.css"

</script>

<script>
export default {
  data() {
    return {
        showSignin: false,        
    };
  }, 
}
</script>
