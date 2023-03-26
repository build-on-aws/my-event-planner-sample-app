<template>
    <authenticator>
        <template v-slot="{ user }">
            <v-card max-width="400" class="mx-auto mx-6">
                <v-card-title>Signed in</v-card-title>                
                <v-card-subtitle v-if="user">Hello {{  user.attributes.email }}</v-card-subtitle>                
                <!-- Add a button to route to home -->
                <router-link class="ma-3" to="/">Continue to app</router-link>
                <!-- Add a sign out button -->
                <v-btn class="ma-2" @click="auth.signOut()">Sign out</v-btn>
            </v-card>
        </template>
    </authenticator>    
</template>

<script setup>
// Import Amplify Auth
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'

const auth = useAuthenticator()
</script>
