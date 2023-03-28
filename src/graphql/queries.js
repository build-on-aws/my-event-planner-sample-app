/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const findSuitableRooms = /* GraphQL */ `
  query FindSuitableRooms(
    $max_tickets: Int
    $start_datetime: AWSDateTime
    $end_datetime: AWSDateTime
  ) {
    findSuitableRooms(
      max_tickets: $max_tickets
      start_datetime: $start_datetime
      end_datetime: $end_datetime
    )
  }
`;
export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      name
      capacity
      availability {
        datetime_start
        datetime_end
      }
      createdAt
      updatedAt
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        capacity
        availability {
          datetime_start
          datetime_end
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      description
      event_owner
      room_id
      image_file_name
      event_datetime_start
      event_datetime_end
      event_duration
      total_tickets
      tickets {
        student_id
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        event_owner
        room_id
        image_file_name
        event_datetime_start
        event_datetime_end
        event_duration
        total_tickets
        tickets {
          student_id
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
