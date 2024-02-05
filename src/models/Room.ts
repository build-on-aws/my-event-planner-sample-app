// This file defines a Room class that represents a room that can be booked.
// It stores information about the room such as its ID, name, and capacity,
// as well as bookings in the form of start and end Date objects.
// Methods allow adding bookings and checking availability.

export class Booking {
    datetime_start: Date;
    datetime_end: Date;
    
    constructor(start: Date, end: Date) {
      this.datetime_start = start;
      this.datetime_end = end;
    }
  }
  
export class Room {
    id: string;
    name: string;
    capacity: number;
    bookings: Booking[];

    // Some rooms start with no bookings
    constructor(id: string, name: string, capacity: number, bookings: Booking[]) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.bookings = bookings;
    }        

    // Add a new booking to this to room
    addBooking(start: Date, end: Date) {
        const booking = new Booking(start, end);
        this.bookings.push(booking);
    }
}
