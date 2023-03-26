// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { Auth } from "aws-amplify";

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
    // path: '/',
    // component: () => import('@/layouts/default/Default.vue'),
    // children: [
    //   {
    //     path: '',
    //     name: 'Home',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    //   },
    // ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
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
        next("/signin");
      } 
      else {
        // They are authenticated, so we can continue.
        next();
      }
    } catch (err) {
      // Error, so redirect to signin page.
      next("/signin");
    }
  } else {
    // Route does not require authentication, so we can continue.
    next();
  }
});
// End of new method
export default router;