<template>
  <v-app>
    <v-navigation-drawer permanent app color="primary">
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-title class="my-2 text-h5"
            >My Event Planner</v-list-item-title
          >
          <v-list-item-subtitle class="my-2"
            >Find the best campus events!</v-list-item-subtitle
          >
        </v-list-item>
      </template>
      <v-list
        v-for="item in menuItems"
        :key="item.menuText"
        @click="callMethod(item.methodName)"
      >
        <v-list-item class="ma-1" link>
          <template v-slot:prepend>
            <v-icon>{{ item.iconName }}</v-icon>
          </template>
          <v-list-item-title>{{ item.menuText }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary">
      <v-toolbar-title> {{ currentEventsView }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- AdminTools -->
      <v-btn v-if="isAdmin" color="warning"
        >Admin
        <v-dialog v-model="adminDialog" activator="parent" width="auto">
          <v-card>
            <v-card-text>
              Warning: This command will delete ALL the data in the database,
              and then add some mock (fake) data. If you proceed, this dialog
              will automatically close when finished.
            </v-card-text>
            <v-card-actions>
              <v-btn color="warning" @click="adminTools">Proceed</v-btn>
              <v-btn color="primary" @click="adminDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
      <!-- End of AdminTools Template -->
      <v-btn color="secondary" @click="signOut">Sign Out</v-btn>
    </v-app-bar>
    <v-main  style="background-color: #B0BEC5">
      <v-container>
        <!-- This is where events will appear -->
        <v-row>
          <v-col v-for="event in events" :key="event.id">
            <EventCard :event="event"></EventCard>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- Show the CreateEventDialog -->
    <v-dialog persistent v-model="showCreateEventDialog" width="auto" >
      <CreateEventForm v-on:close-dialog="closeCreateFormDialog"/>
    </v-dialog>
    
  </v-app>
</template>

<script setup>
import { Storage, Auth, API, graphqlOperation } from "aws-amplify";
import { listEvents, getRoom } from "../graphql/queries";
import { deleteAllRecords, addMockRecords } from "../mock.js"; // AdminTools requirement
import EventCard from "@/components/EventCard.vue";
// Import the new component
import CreateEventForm from "@/components/CreateEventForm.vue";

const menuItems = [
  {
    menuText: "All Upcoming Events",
    iconName: "mdi-calendar-arrow-right",
    methodName: "showAllUpcomingEvents",
  },
  {
    menuText: "All Past Events",
    iconName: "mdi-calendar-arrow-left",
    methodName: "showAllPastEvents",
  },
  {
    menuText: "My Tickets",
    iconName: "mdi-ticket",
    methodName: "showMyTickets",
  },
  {
    menuText: "My Planned Events",
    iconName: "mdi-calendar-edit",
    methodName: "showMyPlannedEvents",
  },
  // Add this new side bar option to the menuItems
  {
    menuText: "Create Event",
    iconName: "mdi-pen",
    methodName: "showCreateEventForm",
  }
];
</script>

<script>
export default {
  data() {
    return {
      currentEventsView: "All Upcoming Events",
      isAdmin: false,
      adminDialog: false, // AdminTools requirement
      events: Array(),
      showCreateEventDialog: false // 
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
    await this.showAllUpcomingEvents()
  },
  methods: {
    callMethod(methodName) {
      this[methodName]();
    },

    async showAllUpcomingEvents() {
      this.currentEventsView = "All Upcoming Events";
      // Call the list method to retrieve all events that meet the filter criteria (events in the future)
      try {
        const results = await API.graphql(
          graphqlOperation(listEvents, {
            filter: { event_datetime_start: { gt: new Date().toISOString() } },
          })
        );

        // Copy the results data array into our local events object array
        this.events = results.data.listEvents.items;
        // Sort them
        this.sortEventsByDate();

        // Get room names data (in a later step)
        await this.getRoomNames()
        // Get secure image urls (in a later step)
        await this.getSecureImageUrls()
      } catch (err) {
        console.log("Error retrieving events: ", err);
      }
    },
    async getRoomNames() {      
      this.events.forEach(async (event) => {
        const room = await API.graphql(graphqlOperation(getRoom, { id: event.room_id}))
        if(!room.data || !room.data.getRoom) {
          event.room_name = "No venue"
          return;
        }
        event.room_name = room.data.getRoom.name        
      })      
    },
    // Download secure images
    async getSecureImageUrls() {
      this.events = await Promise.all(
        this.events.map(async (event) => {
          event.url = ""; // add the url field to the event
          if (event.image_file_name) {
            const preSignedImageURL = await Storage.get(event.image_file_name, {
              level: "protected", // defaults to `public`
              identityId: event.student_id, // id of another user, if `level: protected`
              download: false, // defaults to false
              contentType: "image/*", // set return content type, eg "text/html"
            }).catch((err) => console.log(err));
            // // TODO: remove console.log("Url: ", preSignedImageURL);
            event.url = preSignedImageURL;
          }

          return event;
        })
      );
    },
    sortEventsByDate() {
      // Sorting events by date Asc
      this.events.sort((a, b) => {
        const astart = new Date(a.event_datetime_start);
        const bstart = new Date(b.event_datetime_start);
        return astart - bstart;
      });
    },
    showAllPastEvents() {
      this.currentEventsView = "All Past Events";
      // Add your code here in later steps
      // Challenge: This is very similar to the showUpcomingEvents method, but one small change. 
      // Can you implement it to show only events in the past?
    },
    async showMyTickets() {
      this.currentEventsView = "My Tickets";
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        var signedin_student_id = userInfo.attributes.sub;
        // Get all future events. We can do this because there will not be too many events at any given time
        const results = await API.graphql(
          graphqlOperation(listEvents, {
            filter: { event_datetime_start: { gt: new Date().toISOString() } },
          })
        );

        // Copy the results data array into our local events object array, filter for tickets matching student id        
        this.events = results.data.listEvents.items.filter(event => event.tickets.some(ticket => ticket.student_id === signedin_student_id));        
          // Sorting items by date Asc
        this.events.sort((a, b) => {
          const astart = new Date(a.event_datetime_start);
          const bstart = new Date(b.event_datetime_start);
          return astart - bstart;
        });
        // Get room names data
        await this.getRoomNames()
        // Get secure image urls
        await this.getSecureImageUrls()
      } catch (err) {
        console.log("Error retrieving events: ", err);
      }
    },

    async showMyPlannedEvents() {
      this.currentEventsView = "My Planned Events";
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        var signedin_student_id = userInfo.attributes.sub;
        const myEvents = await API.graphql(
        graphqlOperation(listEvents, { filter: {  event_owner: { eq: signedin_student_id, }}}));
        this.events = myEvents.data.listEvents.items;
        // Sorting items by date Asc
        this.events.sort((a, b) => {
          const astart = new Date(a.event_datetime_start);
          const bstart = new Date(b.event_datetime_start);
          return astart - bstart;
        });
        // Get room names data
        await this.getRoomNames()
        // Get secure image urls
        await this.getSecureImageUrls()
      } catch (err) {
        console.log("Error retrieving events: ", err);
      }
    },
    // Dialog open and close commands
    showCreateEventForm() {
      this.showCreateEventDialog = true
    },
    async closeCreateFormDialog() {
      this.showCreateEventDialog = false
      await this.showAllUpcomingEvents()
    },
    // AdminTools method
    adminTools() {
      this.currentEventsView = "Admin Tools";
      deleteAllRecords();
      addMockRecords();
      this.adminDialog = false;
    },
    // Signout method (redirects to signin)
    async signOut() {
      await Auth.signOut();
      // TODO: remove this.$router.push("/signin");
    },
  },
};
</script>
