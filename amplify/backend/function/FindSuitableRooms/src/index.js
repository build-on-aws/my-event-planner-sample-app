/* Amplify Params - DO NOT EDIT
	API_MYEVENTPLANNER_GRAPHQLAPIENDPOINTOUTPUT
	API_MYEVENTPLANNER_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MYEVENTPLANNER_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const queryAllRooms = /* GraphQL */ `
  query listRooms {
    listRooms 
    {
      items {
        id
        name
        capacity
        availability {
          datetime_start
          datetime_end
        }
      }
    }
  }
`;

const queryEvents = /* GraphQL */ `
  query listEvents {
    listEvents 
    {
      items {
        id
        room_id
        event_datetime_start
        event_datetime_end
        event_duration  
      }
    }
  }
`;


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
let statusCode = 200;
 export const handler = async (event) => {
  // console.log(`EVENT: ${JSON.stringify(event)}`);
  var max_tickets = event.arguments.max_tickets;
  var start_datetime = new Date(event.arguments.start_datetime);
  var end_datetime = new Date(event.arguments.end_datetime);

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  // Get all the rooms and events
  var roomsData = await runQuery(endpoint, signer, queryAllRooms);
  var eventsData = await runQuery(endpoint, signer, queryEvents);

  // Add your code here to identify rooms before sending the response back to the client.
  // 1. Filter out rooms that do not have enough capacity  
  let suitableRooms = roomsData.data.listRooms.items.filter(room => room.capacity >= max_tickets);
  

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "*"
    // }, 
    body: JSON.stringify(suitableRooms)
  };
};

async function runQuery(endpoint, signer, query) {
  const queryRequestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query: query }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(queryRequestToBeSigned);
  const request = new Request(endpoint, signed);

  
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }
  return body;
}