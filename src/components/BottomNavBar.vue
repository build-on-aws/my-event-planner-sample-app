<!-- 
  This component defines the bottom navigation bar with buttons to switch between views of past events, upcoming events, and user tickets. 
  It uses Pinia stores to manage UI state and check if user is authenticated before allowing access to tickets. 
-->
<script setup lang="ts">
import { useUIStore } from '../store/ui';
import { useAuthStore } from '@/store/auth';
import { computed } from 'vue';

const auth = useAuthStore();
const userAuthenticated = computed(() => auth.userAuthenticated);

const ui = useUIStore();

</script>

<template>
  <v-bottom-navigation active>
    <!-- bg-color="secondary"    -->
    <v-btn value="past" @click="ui.setCurrentView('upcoming-events')">
      <v-icon>mdi-calendar-arrow-left</v-icon>
      <span>Past Events</span>
    </v-btn>

    <v-btn value="mytickets" :disabled="!userAuthenticated" @click="ui.setCurrentView('my-tickets')">
      <v-icon>mdi-ticket</v-icon>
      <span>My Tickets</span>
    </v-btn>

    <v-btn value="upcoming" @click="ui.setCurrentView('past-events')">
      <v-icon>mdi-calendar-arrow-right</v-icon>
      <span>Upcoming Events</span>
    </v-btn>
  </v-bottom-navigation>
</template>
