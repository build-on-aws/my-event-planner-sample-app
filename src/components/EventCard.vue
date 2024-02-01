<!-- 
  This component displays the details of an event such as the name, date, location etc. on a card.
  It also shows the number of tickets left and allows an authenticated user to book a ticket if available.
  The component fetches the event data from props and computes additional details like 
  the room name and formatted date. 
-->
<script setup lang="ts">
import { computed, toRefs, ref, Ref, inject } from 'vue';
import EventDetails from '@/models/EventDetails';
import Room from '@/models/Room';
import { useDataStore } from '../store/data';
import { useAuthStore } from '../store/auth';
const userAuthenticated = computed(() => useAuthStore().userAuthenticated);
const userid = computed(() => useAuthStore().userId);

// This is most of the details we need, but some have to be computed
const cardEvent = defineProps<{ eventDetail: EventDetails; }>();

// Get Room name fropm the id
const data = useDataStore();
const allRooms = computed(() => data.rooms);

// a computed ref
const numTicketsAvailable = computed(() => {
  return cardEvent.eventDetail.total_tickets - cardEvent.eventDetail.tickets.length;
});

const isFutureDate = computed(() => {
  const now = new Date();
  const eventStart = new Date(cardEvent.eventDetail.event_datetime_start);
  return eventStart > now;
});

const bookable = computed(() => {
  // Bookable if enough tickets left and the event is in the future...  
  if (cardEvent.eventDetail.tickets.length < cardEvent.eventDetail.total_tickets)
    return true;
  return false;
});

const getRoomName = computed(() => {
  // get Room name from event.room_id
  return allRooms.value.find(room => room.id === cardEvent.eventDetail.room_id)?.name;
});

const getFormattedDate = computed(() => {
  const date = new Date(cardEvent.eventDetail.event_datetime_start);
  const day = date.getDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const year = date.getFullYear().toString();
  let hours = date.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours ? hours : 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const durationHours = cardEvent.eventDetail.event_duration;
  const endHour = hours + durationHours;

  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${amPm} - ${endHour}:00 ${amPm}`;
  return formattedDate;
});

</script>

<template>
  <v-card class="mx-auto" max-width="300" color="surface">
    <v-img :src="eventDetail.image_file_name" cover> </v-img>
    <v-card-item>
      <v-card-title>{{ eventDetail.name }}</v-card-title>
      <v-card-subtitle>{{ getFormattedDate }}</v-card-subtitle>
      <v-card-subtitle color="warning"><strong>{{ getRoomName }}</strong></v-card-subtitle>
    </v-card-item>
    <v-card-text>{{ eventDetail.description }}</v-card-text>
    <v-card-subtitle>Tickets available: {{ numTicketsAvailable }} (capacity:
      {{ eventDetail.total_tickets }})</v-card-subtitle>
    <v-divider class="mx-4 mb-1"></v-divider>

    <div v-if="userAuthenticated">
      <v-card-actions v-if="isFutureDate">
        <v-btn v-if="bookable" color="success" variant="text" @click="data.bookTicket(eventDetail.id, userid)">Book
          Ticket</v-btn>
        <v-btn v-else color="warning" variant="text">Sold Out!</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-card-subtitle>Event Ended</v-card-subtitle>
      </v-card-actions>
    </div>
    <div v-else>
      <v-card-actions>
        <v-card-subtitle>Sign in to book tickets</v-card-subtitle>
      </v-card-actions>
    </div>
  </v-card>
</template>
