/**
 * This file generates mock room and event data to use for testing 
 * the room booking system. It creates a set number of rooms, 
 * events distributed over different dates/times, allocates tickets 
 * to events, and adds the bookings to the rooms. The data can 
 * then be imported elsewhere to test components that rely on 
 * real data without needing a connection to a database.
 */
import Room from "@/models/Room";
import EventDetails from "@/models/EventDetails";

import mockRooms from "./rooms.mock.json";
import mockEvents from "./events.mock.json";

let rooms: Room[] = [];
let events: EventDetails[] = [];

const eventImages = ["e1.png", "e2.png", "e3.png", "e4.png", "e5.png", "e6.png", "e7.png", "e8.png"];

export function generateMockData() {
  // Create events in each room (3 rooms, id = "1", "2", "3") from 7 days in the past until 7 days in the future
  // Each event is 1 or 2 hours in length between 17:00 and 21:00
  // total_tickets for an event == room capacity
  // Each event has 10 - 20 tickets already allocated
  // Each image_file_name is a random value from eventImages
  // Each name and description in mockEvents is used for each event
  // room bookings array has each event start and end time added to it
  let imageIndex: number = 0;
  let count: number = 0;
  mockRooms.Room.forEach((room) => {
    const newRoom: Room = new Room(room.id, room.name, room.capacity);
    rooms.push(newRoom);
  });

  let nameIndex = 0;
  let hour = 17;
  const oneDay = 1;
  const today = new Date();
  // Rooms
  for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
    const room = rooms[roomIndex];
    // Days (change the initial days to be how many days in the past, and the limit to the events on days in the future)
    for (let i = -2; i <= 2; i++) { // -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7
      // Date logic...
      var date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      // Hours
      for (let startHour = 17; startHour <= 21; startHour += 2) { // 17 - 19, 19 - 21, 21 - 23
        let endHour = startHour + 2;
        const event = new EventDetails(events.length + 1, mockEvents[nameIndex].name,
          mockEvents[nameIndex].description, "1", room.id,
          eventImages[imageIndex],
          new Date(`${dateString}T${startHour}:00:00Z`),
          new Date(`${dateString}T${endHour}:00:00Z`), 2, room.capacity);
        imageIndex++;
        if (imageIndex >= eventImages.length)
          imageIndex = 0;

        // Generate array of ticket objects
        const tickets = Array.from({
          length: room.capacity - Math.floor((Math.random() * 10) + 1)
        }, () => ({ student_id: Math.floor((Math.random() * 900) + 100).toString() }));

        // For test, the 'authenticated' student has id of 1, so add to even day events
        // This snippet would add the user to half the events
        // if (i % 2)
        //   tickets.push({ student_id: "1" });

        // Map over tickets to call bookTicket
        tickets.map(ticket => {
          event.bookTicket(ticket.student_id);
        });

        events.push(event);
        room.addBooking(event.event_datetime_start, event.event_datetime_end);

        nameIndex++;
        if (nameIndex >= mockEvents.length)
          nameIndex = 0;
      }
    }
  }

  events.sort((a, b) => {
    return a.event_datetime_start.getTime() - b.event_datetime_start.getTime();
  });

  return { rooms, events };
};
