<!-- Renders a Vue application with an app bar, a main content area showing a list of events, and a bottom navigation bar -->

<script setup lang="ts">

import AppBar from '@/components/AppBar.vue';
import EventsList from '@/components/EventsList.vue';
import BottomNavBar from './components/BottomNavBar.vue';

</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <EventsList />
    </v-main>
    <BottomNavBar />
  </v-app>
</template>