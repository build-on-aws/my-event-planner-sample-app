## Building a Serverless Web App with AWS Amplify (Sample App)

*This is lab1-start branch*  

This repo contains sample app code to accompany AWS Workshop Studio [Building a Serverless Web App with Amplify](https://catalog.us-east-1.prod.workshops.aws/workshops/1665a9b6-958b-4b70-ba52-14127b8fa99f/en-US) labs.   
The sample app is an event planning app for students on campus.   
Students can create events that other students can browse.   

Update Jan 2024:
There are currently 2 labs in the workshop, and there are corresponding branches in the repo:
1. Lab 1: Minimal web app with user authentication (Amazon Cognito)
2. Lab 2: Adding data to the web app (Amazon DynamoDB)

Each lab has a branch for the initial lab code e.g., lab1-start and the completed lab code e.g., lab1-complete.

### Audience
This is a foundational repo aimed at students learning serverless cloud concepts for the first time.  
The web app is supplied, but basic knowledge of web development is useful.  

### Technology and Services
The app stack:
* [Node.js](https://nodejs.org/) & JavaScript
* [Vue](https://vuejs.org/)
* [Vuetify](https://vuetifyjs.com/)
* [Vite](https://vitejs.dev/)

The labs show you how to add these services to the app with AWS Amplify:
* [AWS Amplify](https://aws.amazon.com/amplify/):
    * [Amazon Cognito](https://aws.amazon.com/cognito/)     
    * [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)     

The app requires an AWS account to provision and run:
* If you are attending an AWS Workshop event, this is supplied to you. 
* If you are using this repo outside of an hosted Workshop event, you will need to supply your own AWS account: [Create](https://aws.amazon.com/resources/create-account/) a new account or [sign in](https://aws.amazon.com/console/) to your existing account.

> Warning: The repo provisions AWS services, which incur a cost. While provisioning and briefly running the app as a learning exercise would only incur a relatively small cost, care should be taken to delete the AWS Amplify app and associated services when no longer needed to ensure future charges do not accrue. Instructions on how to delete the app are included at the end of this README

### Prerequisites
The following software is required:
1. [Git](https://git-scm.com/)
1. [Node.js, which includes NPM](https://nodejs.org/en/download)
1. [AWS Amplify CLI](https://docs.amplify.aws/cli/start/install/)

As these tools are often updated, it's possible this repo will 'break' or fail to compile/run when one of the tools is updated.  
It is usually possible to switch to a specific previous version of the tools if that happens.  
The versions used at time of authoring:
* Node.js: **v20.5.1**   
* AWS Amplify CLI: **12.10.1**

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

