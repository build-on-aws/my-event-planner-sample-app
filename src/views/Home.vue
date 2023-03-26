<template>
  <!-- This view should only show the user what page they are on -->
  <div class="home">
    <h1>Home</h1>
    <p>This is the home page. It doesn't do much yet!</p>    
    <p v-if="isAdmin">You are signed in as admin.</p> 
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
export default {
  data() {
    return {
      isAdmin: false,
    };
  },
  async mounted() {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      const groups =
        userInfo.signInUserSession.accessToken.payload["cognito:groups"];
      if (groups && groups.includes("admins")) {
        this.isAdmin = true;
      }
    } catch (err) {
      console.log("Error", err);
    }
  },
};
</script>
