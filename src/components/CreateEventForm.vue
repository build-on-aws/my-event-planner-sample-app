<template>
  <v-form @submit.prevent ref="form">
    <v-card min-width="800">
      <v-card-title class="py-3 mx-3">Create Event</v-card-title>
      <v-text-field
        class="mx-6"
        clearable
        label="Event title"
        v-model="name"
        :rules="nameRules"
        required
      ></v-text-field>
      <v-textarea
        class="mx-6"
        no-resize
        rows="2"
        clearable
        label="Description"
        v-model="description"
      ></v-textarea>
      <div class="d-flex mx-6">
        <v-select
          class="mr-2 mt-2"
          label="Select Date"
          :items="datesLocalisedArray"
          v-model="eventDate"
          required
          :rules="dateRules"
        ></v-select>
        <v-text-field
          class="ml-2 mt-2"
          clearable
          label="Total tickets"
          :rules="ticketRules"
          v-model="total_tickets"
          required
        ></v-text-field>
      </div>
      <div class="d-flex mx-6">
        <v-select
          class="mr-2 mt-2"
          label="Start time"
          :items="timesArray"
          :rules="startTimeRules"
          v-model="event_datetime_start"
          required
        ></v-select>
        <v-select
          class="ml-2 mt-2"
          label="End time"
          :items="timesArray"
          :rules="endTimeRules"
          v-model="event_datetime_end"
          required
        ></v-select>
      </div>
      <div class="d-flex mx-6">
        <v-btn class="mr-2" density="default" color="blue" @click="findRooms"
          >Find Suitable Rooms</v-btn
        >
        <v-select
          class="ml-2"
          label="Select Room"
          :disabled="!foundRooms"
          density="compact"
          :items="roomsList"
          item-disabled=""
          item-title="name"
          item-value="id"
          v-model="selectedRoomId"
          required
          :rules="findRoomRules"
        ></v-select>
      </div>
      <div class="d-flex mx-6">
        <v-checkbox
          density="compact"
          class="mr-2"
          direction="horizontal"
          v-model="useGenericImage"
          label="Use generic event image"
        ></v-checkbox>
        <v-file-input
          class="ml-2"
          :disabled="useGenericImage"
          clearable
          show-size
          density="compact"
          accept=".jpg,.jpeg,.png, image/png, image/jpeg"
          @change="fileChange"
          label="Event Advertising Photo"
          :rules="image_file_nameRules"
        ></v-file-input>
      </div>
      <v-card-actions>
        <v-btn
          class="mx-2"
          type="submit"
          color="blue"
          @click="publishEvent"
          :disabled="publishInProgress"
          >Publish Event</v-btn
        >
        <v-btn color="red" @click="emits('close-dialog', true)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>

  <!-- Snackbar components are pop-up messages for alerting the user to errors. -->
  <v-snackbar v-model="uploadFailed" multi-line color="red"
    >Failed to upload image, please check selection and try again. Event was
    <b><u>not</u></b> published.
    <template v-slot:actions
      ><v-btn color="white" variant="text" @click="uploadFailed = false"
        >Close</v-btn
      ></template
    >
  </v-snackbar>
  <v-snackbar v-model="publishFailed" multi-line color="red"
    >Failed to publish event. Please try again.
    <template v-slot:actions
      ><v-btn color="white" variant="text" @click="publishFailed = false"
        >Close</v-btn
      ></template
    >
  </v-snackbar>
  <v-snackbar v-model="findRoomsFailed" multi-line color="red"
    >{{ findRoomsError }}
    <template v-slot:actions
      ><v-btn color="white" variant="text" @click="findRoomsFailed = false"
        >Close</v-btn
      ></template
    >
  </v-snackbar>
</template>

<script setup>
const emits = defineEmits(["close-dialog"]);
</script>

<script>
import { API, Storage, Auth, graphqlOperation } from "aws-amplify";
import { findSuitableRooms } from "../graphql/queries";
import { createEvent } from "../graphql/mutations";

export default {
  data() {
    return {
      start_datetime: Date(),
      end_datetime: Date(),
      publishInProgress: false,
      useGenericImage: true,
      publishFailed: false,
      uploadFailed: false,
      datesArray: Array(),
      datesLocalisedArray: Array(),
      dateRules: [
        (value) => {
          if (value == "") return "Select a date";
          return true;
        },
      ],
      timesArray: Array(),
      findRoomsFailed: false,
      findRoomsError: "",
      foundRooms: false, // Changed to true when user clicks Find Rooms and Lambda returns values
      selectedRoomId: null,
      roomsList: Array(),
      findRoomRules: [
        (value) => {
          if (value) return true;
          return "You must choose a room before publishing an event";
        },
      ],
      loading: [],
      noFiles: true,
      imageFile: null,
      image_file_name: "",
      image_file_nameRules: [
        (value) => {
          if (!this.useGenericImage) return true;
          if (value) return true;
          return "You must specify a file OR select 'Use generic event image'";
        },
      ],

      name: "",
      nameRules: [
        (value) => {
          if (value) return true;
          return "Name is requred.";
        },
      ],
      description: "",

      event_datetime_start: "",
      startTimeRules: [
        (value) => {
          if (value) return true;
          return "Select event start time";
        },
      ],
      event_datetime_end: "",
      endTimeRules: [
        (value) => {
          if (value) return true;
          return "Select event end time";
        },
        (value) => {
          // We define the times allowed so this is quicker than creating Date objects (this should also be in form validation)
          let start_hour = parseInt(this.event_datetime_start.split(":")[0]);
          let end_hour = parseInt(value.split(":")[0]);
          if (start_hour >= end_hour) return "Event cannot start after it has finished";
          this.event_duration = end_hour - start_hour;
          return true;
        },
      ],

      eventDate: "",
      eventDateRules: [
        (value) => {
          if (value) return true;
          return "Event must have a date";
        },
      ],
      event_duration: 0,
      total_tickets: 0,
      ticketRules: [
        (value) => {
          if (value > 0) return true;
          return "Tickets must be greater than 0";
        },
      ],
      picker: null,
    };
  },
  methods: {
    fileChange(event) {
      this.imageFile = event.target.files[0];
      this.noFiles = !event.target.files.length;
    },

    // This method is fired when the user clicks 'Find Rooms'
    async findRooms() {
      if (this.eventDate == "") {
        this.findRoomsError = "Please select a date before searching rooms";
        this.findRoomsFailed = true;
        return;
      }
      if (this.event_datetime_start == "") {
        this.findRoomsError = "Please select a start time before searching rooms";
        this.findRoomsFailed = true;
        return;
      }
      if (this.event_datetime_end == "") {
        this.findRoomsError = "Please select an end time before searching rooms";
        this.findRoomsFailed = true;
        return;
      }
      if (this.total_tickets <= 0) {
        this.findRoomsError =
          "Please set the total number of tickets before searching rooms";
        this.findRoomsFailed = true;
        return;
      }
      // Call this to populate the start and end datetimes with all the info for the query
      this.calculateEventStartEndTimes()
      console.log(`Searching for rooms available from ${this.start_datetime.toISOString()} to ${this.end_datetime.toISOString()} with a capacity of at least ${this.total_tickets}`)
            
      const variables = {
        max_tickets: this.total_tickets,
        start_datetime: this.start_datetime.toISOString(),
        end_datetime: this.end_datetime.toISOString(),              
      }
      
      await API.graphql(graphqlOperation(findSuitableRooms, variables))
      .then(response => {
        // Check the status code
        const successHeader = "{statusCode=200, body="        
        if(response.data.findSuitableRooms.includes(successHeader))
        {
          var strData = response.data.findSuitableRooms.slice(successHeader.length, response.data.findSuitableRooms.length-1)                 
          var parsedData = JSON.parse(strData)          
          this.roomsList = parsedData 
        }

      })
      .catch(error => {
        console.log("Error: ", error)
        this.findRoomsError = "Error calling Lambda function";
          this.findRoomsFailed = true;
      })
      
      // Get the array of names for showing in the drop down list
      if (this.roomsList.length == 0) {
        this.findRoomsError =
          "Unfortunately there are no suitable rooms available. Try changing date/times/tickets.";
          this.findRoomsFailed = true;
      }
      // Enable the selection box
      this.foundRooms = true;
    },

    // Publish event
    async publishEvent() {
      this.publishInProgress = true;
      // If the user has selected generic image, upload that.
      try {
        var storage_key = "";

        if (this.useGenericImage) {
          const key = "generic.jpeg";
          const fileName = "./generic.jpeg"; // This file does not exist but you could add this functionality if you wish
          const res = await fetch(fileName);
          const imageBlob = await res.arrayBuffer();
          const resultKey = await Storage.put(key, imageBlob, {
            level: "protected",
            contentType: "image/*",
          });
          storage_key = resultKey;
        } else {
          const resultKey = await Storage.put(this.imageFile.name, this.imageFile, {
            level: "protected",
          });
          storage_key = resultKey;
        }
      } catch (error) {
        this.uploadFailed = true;
        console.log("Error uploading image: ", error);
        return;
      }

      this.calculateEventStartEndTimes()

      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        var signedin_student_id = userInfo.attributes.sub;
        const response = await API.graphql({
          query: createEvent,
          variables: {
            input: {
              name: this.name,
              description: this.description,
              event_owner: signedin_student_id,
              room_id: this.selectedRoomId,
              image_file_name: storage_key.key,
              event_datetime_start: this.start_datetime.toISOString(),
              event_datetime_end: this.end_datetime.toISOString(),
              event_duration: this.event_duration,
              total_tickets: this.total_tickets,
              tickets: [{ student_id: signedin_student_id }], // the creator gets the first ticket
            },
          },
        });
      } catch (err) {
        console.log("Error: ", err);
      }
      this.$refs.form.reset();
      this.publishInProgress = false;
      this.emits("close-dialog", true);
    },
    calculateEventStartEndTimes()
    {
      // Construct the correct date/time(s)
      // var consolidated_date_time_start = new Date();
      // var consolidated_date_time_end = new Date();
      try {
        var eventdate = new Date(this.eventDate);
        var eventTimeStart = new Date();
        var eventTimeEnd = new Date();
        eventTimeStart.setHours(parseInt(this.event_datetime_start.split(":")[0]) + 12); // Convert to 24 hour clock
        eventTimeEnd.setHours(parseInt(this.event_datetime_end.split(":")[0]) + 12); // Convert to 24 hour clock
        this.start_datetime = new Date(
          eventdate.getFullYear(),
          eventdate.getMonth(),
          eventdate.getDate(),
          eventTimeStart.getHours(),
          0,
          0,
          0
        );
        this.end_datetime = new Date(
          eventdate.getFullYear(),
          eventdate.getMonth(),
          eventdate.getDate(),
          eventTimeEnd.getHours(),
          0,
          0,
          0
        );
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  },

  mounted() {
    // Populate the times
    this.timesArray = [
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
      "10:00 PM",
      "11:00 PM",
    ];
    // Populate the date fields
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    var currentDate = new Date();
    var endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);
    while (currentDate <= endDate) {
      this.datesArray.push(new Date(currentDate));
      this.datesLocalisedArray.push(currentDate.toLocaleDateString(undefined, options));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  },
};
</script>
