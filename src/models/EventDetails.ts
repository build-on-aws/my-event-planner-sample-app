/**
 * This file defines a EventDetails class that represents details for an event.
 * It has properties like id, name, date/time, tickets etc. 
 * There is also a bookTicket method to allow booking a ticket by adding a student id to the tickets array.
 * This class can be instantiated and used to store and access information about an event.
*/

export default class EventDetails {
  id: number;
  name: string;
  description: string;
  event_owner: string;
  room_id: string;
  image_file_name: string;
  event_datetime_start: Date;
  event_datetime_end: Date;
  event_duration: number;
  total_tickets: number;
  tickets: string[];

  constructor(id: number, name: string, description: string, event_owner: string, room_id: string,
    image_file_name: string, event_datetime_start: Date, event_datetime_end: Date,
    event_duration: number, total_tickets: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.event_owner = event_owner;
    this.room_id = room_id;
    this.image_file_name = image_file_name;
    this.event_datetime_start = event_datetime_start;
    this.event_datetime_end = event_datetime_end;
    this.event_duration = event_duration;
    this.total_tickets = total_tickets;
    this.tickets = [];
  }

  // Add a method to 'book a ticket' that adds the student id to the tickets array
  bookTicket(student_id: string) {
    this.tickets.push(student_id);
  }

}
