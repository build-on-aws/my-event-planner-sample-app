import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  createEvent,
  createRoom,
  deleteEvent,
  deleteRoom,
} from "./graphql/mutations";
import { listEvents, listRooms } from "./graphql/queries";

export const deleteAllRecords = async () => {
  console.log("Attempting to delete all records");
  const rooms = await API.graphql(graphqlOperation(listRooms));
  const room_ids = rooms.data.listRooms.items.map((room) => room.id);
  room_ids.map((id) => {
    return API.graphql(graphqlOperation(deleteRoom, { input: { id } }));
  });

  const events = await API.graphql(graphqlOperation(listEvents));
  const event_ids = events.data.listEvents.items.map((event) => event.id);
  event_ids.map((id) => {
    return API.graphql(graphqlOperation(deleteEvent, { input: { id } }));
  });

  console.log("All records deleted");
};

export const addMockRecords = async () => {
  // First, create some availabilities (that will be added to a room)
  // On the 24 hour clock, these are the possible start and end hours
  const startHours = [17, 18, 19, 20];
  const endHours = [21, 22, 23];
  let availabilities = [];

  try {
    for (let i = 0; i < 7; i++) {
      // Set initial date to today's date
      var datetime_start = new Date();
      datetime_start.setDate(datetime_start.getDate() + i);

      var datetime_end = new Date(datetime_start);

      datetime_start.setHours(startHours[getRandomIndex(startHours.length)]);
      datetime_start.setMinutes(0);
      datetime_start.setSeconds(0);
      datetime_start.setMilliseconds(0);

      datetime_end.setHours(endHours[getRandomIndex(endHours.length)]);
      datetime_end.setMinutes(0);
      datetime_end.setSeconds(0);
      datetime_end.setMilliseconds(0);

      availabilities.push({
        datetime_start: datetime_start.toISOString(),
        datetime_end: datetime_end.toISOString(),
      });
    }

    // Now create some rooms (with these availabilities)
    let room_names = ["Room 1A", "Room 2B", "Room 3C"];
    let room_capacities = [100, 75, 300];
    await Promise.all(
      room_names.map(async (value, index) => {
        await API.graphql({
          query: createRoom,
          variables: {
            input: {
              name: room_names[index],
              capacity: room_capacities[index],
              availability: availabilities,
            },
          },
        });
      })
    );
  } catch (error) {
    console.log(error);
  }
  // List all items
  const allRooms = await API.graphql({
    query: listRooms,
  });

  // Now add some events (the current admin is the 'owner' in each case)
  try {
    const userInfo = await Auth.currentAuthenticatedUser();
    var signedin_student_id = userInfo.attributes.sub;
    var names = [
      "Chess Club",
      "Debate Club",
      "Photography Society",
      "Student Newspaper",
      "Model UN",
      "Film Club",
      "Creative Writing Society",
      "LGBTQI+ Alliance",
      "Engineering Club",
      "Dance Team",
    ];

    for (var i = -5; i < 5; i++) {
      // Some events are in the past, some are in the future (for testing purposes)
      var event_datetime_start = new Date();
      event_datetime_start.setDate(event_datetime_start.getDate() + i);
      var event_datetime_end = new Date(event_datetime_start);
      event_datetime_start.setHours(17);
      event_datetime_start.setMinutes(0);
      event_datetime_start.setSeconds(0);
      event_datetime_start.setMilliseconds(0);

      event_datetime_end.setHours(19);
      event_datetime_end.setMinutes(0);
      event_datetime_end.setSeconds(0);
      event_datetime_end.setMilliseconds(0);

      var randomClub = getRandomIndex(names.length);

      const response = await API.graphql({
        query: createEvent,
        variables: {
          input: {
            name: names[randomClub],
            description: "All welcome at our events",
            event_owner: signedin_student_id,
            room_id: allRooms.data.listRooms.items[0].id,
            // image_file_name: storage_key.key,
            event_datetime_start: event_datetime_start.toISOString(),
            event_datetime_end: event_datetime_end.toISOString(),
            event_duration: 2,
            total_tickets: getRandomIndex(25) + 25,
            tickets: [{ student_id: signedin_student_id }], // the creator gets the first ticket
          },
        },
      });
      console.log("Response: ", response.data.createEvent);
    }
  } catch (err) {
    console.log("Error: ", err);
  }
};

function getRandomIndex(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}
