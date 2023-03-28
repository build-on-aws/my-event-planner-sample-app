<template>
    <v-card class="mx-auto" max-width="300">
      <v-img :src="event.url" class="text-white" cover> </v-img>
      <v-card-item>
        <v-card-title>{{ event.name }}</v-card-title>
        <v-card-subtitle>{{ getFormattedDate }}</v-card-subtitle>
        <v-card-subtitle class="text-red">{{ event.room_name }}</v-card-subtitle>
      </v-card-item>
      <v-card-text>{{ event.description }}</v-card-text>
      <v-card-subtitle
        >Tickets available: {{ numTicketsAvailable }} (capacity:
        {{ event.total_tickets }})</v-card-subtitle
      >
      <v-divider class="mx-4 mb-1"></v-divider>
      <v-card-actions>
        <v-btn
          v-if="bookable"
          color="deep-purple-lighten-2"
          variant="text"        
          >Book Ticket</v-btn>
        <v-btn v-else color="orange" variant="text">Sold Out!</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      event: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {};
    },
    computed: {
      numTicketsAvailable() {
        return this.event.total_tickets - this.event.tickets.length;
      },
      bookable() {
        if (this.event.tickets.length < this.event.total_tickets) return true;
        return false;
      },
      getFormattedDate() {
        const date = new Date(this.event.event_datetime_start);
        const day = date.getDate().toString().padStart(2, "0");
        const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
        const year = date.getFullYear().toString();
        let hours = date.getHours();
        const amPm = hours >= 12 ? "PM" : "AM";
        hours %= 12;
        hours = hours ? hours : 12;
        const minutes = date.getMinutes().toString().padStart(2, "0");
  
        const endHour = hours + this.event.event_duration;
  
        const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${amPm} - ${endHour}:00 ${amPm}`;      
        return formattedDate;
      },
    },
  };
  </script>
  