// This file defines a Pinia store that manages the data for the events booking app. 
// It has state for rooms and events data. 
// It has actions to initialize mock data, fetch real data, and book tickets for a student by calling the bookTicket method on the EventDetails model.
// This store manages data locally on the client side right now, but integration with a cloud database is required.

import { defineStore } from 'pinia';
import { Booking, Room } from '@/models/Room';
import EventDetails from '@/models/EventDetails';

// For creating testing/mock data
import { generateMockData, upLoadMockData } from './mock/mockGeneration';

// Add Amplify GraphQL Imports 
import { listEvents, listRooms } from '@/graphql/queries'
import { deleteRoom, deleteEvent, createEvent, createRoom, updateEvent } from '@/graphql/mutations';
import { generateClient } from 'aws-amplify/api';

// Create GraphQL API client 
const apiClient = generateClient(); 

export const useDataStore = defineStore('data', {
  state: () => {
    return {
      rooms: [] as Room[],
      events: [] as EventDetails[],      
    };
  },
  actions: {
    async initMockData() {
      console.log("Generating Mock Data");
      const mockData = generateMockData();
      this.rooms = mockData.rooms;
      this.events = mockData.events;
    },

    async fetchData() {
      // Add cloud service to get 'real' data
      // Get all the rooms and events from the database. 
      // Expensive operation (if a lot of data) so we only do this on start. 
      // No need to do it after that in current architecture.      
      const dbRooms = await apiClient.graphql({ query: listRooms });
      const dbEvents = await apiClient.graphql({ query: listEvents });
      
      // Map the dbRooms to Room objects
      this.rooms = dbRooms.data.listRooms.items.map(room => {
        return new Room(room.id, room.name, room.capacity, []);
        // TODO: no bookings returned! Challenge, how would you write a custom GraphQL query to return them?
      });

      // Map the dbEvents to Events objects
      this.events = dbEvents.data.listEvents.items.map(event => {
        let ev = new EventDetails(event.id, event.name, event.description, event.event_owner, event.room_id, event.image_file_name, new Date(event.event_datetime_start), new Date(event.event_datetime_end), event.event_duration, event.total_tickets);
        event.tickets.forEach(ticket => {
          ev.bookTicket(ticket);
        });
        return ev;
      });
    },

    async upLoadData() {      
      upLoadMockData(); 
    },    

    // Book ticket takes in a event id (number) and a student_id string parameter and calls bookTicket(student_id: string) on the event item in events array
    // This happens in the client and does not relect in the data other clients have - it is all local. 
    async bookTicket(eventId: string, studentId: string) {
      const event: EventDetails = this.events.find(e => e.id === eventId) as EventDetails;
      if (event) {
        if (event.total_tickets > event.tickets.length) {
          event.bookTicket(studentId);
          // Add Amplify changes so DynamoDB is updated too
          // update database too
          const input = {
            id: event.id,
            tickets: event.tickets
          };

          const updatedEvent = await apiClient.graphql( { query: updateEvent, variables: { input: input } } );
          console.log('Ticket booked:', updatedEvent);          
        }
      }
    },
  },
});
