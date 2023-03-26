// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { Auth, Hub } from "aws-amplify";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "Signin",
    component: () => import("@/views/Signin.vue"),   
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Amplify supplies a Hub that listens for events, we are interested in sign-in and sign-out events
Hub.listen("auth", async (data) => {
  if (data.payload.event === 'signOut'){      
      router.push({path: '/signin'});
  } else if (data.payload.event === 'signIn') {      
      router.push({path: '/'});
  }
});


// Adding method to chech if user is authenticated before moving navigating to the requested page
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication by examining requiresAuth
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      // Call the Amplify Auth method to check if the user is authenticated.
      const user = await Auth.currentAuthenticatedUser();      
      if (!user) {
        // Not authenticated, so redirect to signin page.
        console.log("Detected user not already signed in, redirecting to signin view")
        next("/signin");
      } 
      else {
        // They are authenticated, so we can continue.
        console.log("Use is authenticated")
        next();
      }
    } catch (err) {
      // Error, so redirect to signin page.
      console.log("Signin error")
      next("/signin");
    }
  } else {
    // Route does not require authentication, so we can continue.
    next();
  }
});
// End of new method
export default router;