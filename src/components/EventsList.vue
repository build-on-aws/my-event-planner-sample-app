<!--
This file handles displaying EventCard components based on the current view in the UI store. 
It watches the currentView value from the UI store and filters the list of events appropriately,
showing upcoming events, past events, my tickets, or all events depending on what view is selected.
The filtered list of events is kept in eventsToShow and passed to the EventCard components for display.
-->

<script setup lang="ts">
import EventCard from './EventCard.vue';
import EventDetails from '@/models/EventDetails';
import { onMounted, watch, computed, ref } from 'vue';

import { useUIStore } from '../store/ui';
import { useDataStore } from '../store/data';

const data = useDataStore();
const allEvents = computed(() => data.events);
let eventsToShow = ref<EventDetails[]>([]);

const ui = useUIStore();
const currentView = computed(() => ui.currentView);

import { useAuthStore } from '../store/auth';
const userAuthenticated = computed(() => useAuthStore().userAuthenticated);
const userid: string = computed(() => useAuthStore().userId).value;

onMounted(() => {
  refreshEventsToShow();
});

watch(currentView, () => {
  // currentView changed  
  refreshEventsToShow();
});

function refreshEventsToShow() {
  if (currentView.value === 'upcoming-events') {
    eventsToShow.value = (allEvents.value as EventDetails[]).filter(e => e.event_datetime_start < new Date());
    return;
  }

  if (currentView.value === 'past-events') {
    eventsToShow.value = (allEvents.value as EventDetails[]).filter(e => e.event_datetime_end >= new Date());
    return;
  }

  if (currentView.value === 'my-tickets') {
    if (!userAuthenticated) {
      // This button should only be clickable if the user is signed in
      return;
    }
    eventsToShow.value = (allEvents.value as EventDetails[]).filter(e => e.tickets.includes(userid));
    return;
  }
  // return all events, this is unexpected behaviour, it means an unhandled currentView...
  eventsToShow.value = (allEvents.value as EventDetails[]);
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="event in eventsToShow" :key="event.id">
        <EventCard :event-detail="event"></EventCard>
      </v-col>
    </v-row>
  </v-container>
</template>