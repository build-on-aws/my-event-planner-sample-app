// This file defines a Pinia store that manages the data for the events booking app. 
// It has state for rooms and events data. 
// It has actions to initialize mock data, fetch real data, and book tickets for a student by calling the bookTicket method on the EventDetails model.
// This store manages data locally on the client side right now, but integration with a cloud database is required.

import { defineStore } from 'pinia';
import Room from '@/models/Room';
import EventDetails from '@/models/EventDetails';

// For creating testing/mock data
import { generateMockData } from './mock/mockGeneration';

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
      // TODO: Add cloud service to get 'real' data
    },

    // Book ticket takes in a event id (number) and a student_id string parameter and calls bookTicket(student_id: string) on the event item in events array
    // This happens in the client and does not relect in the data other clients have - it is all local. Amplify changes this to use DynamoDB    
    async bookTicket(eventId: number, studentId: string) {
      const event: EventDetails = this.events.find(e => e.id === eventId) as EventDetails;
      if (event) {
        if (event.total_tickets > event.tickets.length) {
          event.bookTicket(studentId);
        }
      }
    },
  },
});
