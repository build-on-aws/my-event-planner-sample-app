// This file defines a Room class that represents a room that can be booked.
// It stores information about the room such as its ID, name, and capacity,
// as well as bookings in the form of start and end Date objects.
// Methods allow adding bookings and checking availability.

export default class Room {
    id: string;
    name: string;
    capacity: number;
    bookings: Date[];

    // Rooms always start with no bookings
    constructor(id: string, name: string, capacity: number) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.bookings = [];
    }

    // Add a new booking to this to room
    addBooking(start: Date, end: Date) {
        this.bookings.push(start, end);
    }
}
