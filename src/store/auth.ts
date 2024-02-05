/*
This file defines a Pinia store that manages authentication state. 
It tracks whether the user is signed in via the userAuthenticated variable. 
When signed in, it also tracks the user's ID in the userId variable. 

The store exposes a signIn() action that toggles the authenticated state. 
This allows other parts of the app to call signIn() when a user logs in or out to keep the global auth state in sync.  
Note that initially, as there is no authentication backend implemented, signing in/out is a toggle (it doesn't really authenticate the user).
*/
import { defineStore } from 'pinia';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userAuthenticated: false,
        userId: '',
    }),
    // add action to check if the user is already signed in (and set the userId and authenticated status)
    actions: {
        async checkPreviousUserSignedIn() {
            try {
                const user = await getCurrentUser();
                this.userAuthenticated = true;
                this.userId = user.userId;
            }
            catch (error) {
                this.userAuthenticated = false;
                this.userId = '';
            }
        }
    }
});

// Listen for authentication events
Hub.listen('auth', async (data) => {
    const store = useAuthStore();
    switch (data.payload.event) {
        case 'signedIn':
            const user = await getCurrentUser();
            store.userId = user.userId;
          break;
        case 'signedOut':
            store.userId = '';
          break;
      }
});  
