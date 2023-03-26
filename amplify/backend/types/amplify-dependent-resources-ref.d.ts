export type AmplifyDependentResourcesAttributes = {
  "api": {
    "myeventplanner": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "myeventplannerAuth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "adminsGroupRole": "string"
    }
  },
  "storage": {
    "EventImages": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}