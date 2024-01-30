## Building a Serverless Web App with Amplify (Sample App)

This repo contains sample app code to accompany AWS Workshop Studio [Building a Serverless Web App with Amplify](https://catalog.us-east-1.prod.workshops.aws/workshops/1665a9b6-958b-4b70-ba52-14127b8fa99f/en-US) labs.   
The sample app is an event planning app for students on campus.   
Students can create events that other students can browse.   

Update Jan 2024:
There are currently 2 labs in the workshop, and there are 2 corresponding branches in the repo:
1. Lab 1: Minimal web app with user authentication (Amazon Cognito)
2. Lab 2: Adding data to the web app (Amazon S3 and Amazon DynamoDB)

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
It is usually possible to switch to a specific previouis version of the tools if that happens.  
The versions used at time of authoring:
* Node.js: **v18.15.0**   
* AWS Amplify CLI: **11.0.3**

### Installation
If in hosted workshop: 
1. Clone the repo
1. In the repo root folder:
    1. `npm install`    
    1. `npm install aws-amplify @aws-amplify/ui-vue`
    1. `amplify configure`
        1. You will be prompted to:
            ````
            Sign in to your AWS administrator account:
            https://console.aws.amazon.com/
            Press Enter to continue
            ````
        1. Ignore and press enter to continue
        1. Select region: **us-east-1**
        1. You will be prompted to:
            ````
            Follow the instructions at
            https://docs.amplify.aws/cli/start/install/#configure-the-amplify-cli
            to complete the user creation in the AWS console
            https://console.aws.amazon.com/iamv2/home#/users/create
            Press Enter to continue
            ````
        1. Ignore and press enter to continue
        1. When prompted to:
            ````
            Enter the access key of the newly created user:
            ? accessKeyId: [hidden]
            ? secretAccessKey: [hidden]
            ````
        1. Enter the keys that can be found on the **Get AWS CLI credentials** sidebar link on the Workshop Studio page.
        1. Enter the profile name of your choice (you can have several profiles) or accept the default                
    1. `amplify push`

If supplying your own AWS account, choose:
1. Clone the repo
1. In the repo root folder:
    1. `npm install`    
    1. `amplify configure`
        1. [Follow the steps](https://docs.amplify.aws/cli/start/install/#configuring-the-amplify-cli) to use your own AWS account to configure Amplify            
    1. `amplify push`

### Running
1. In the repo root folder:
    1. **npm run dev**
    1. Open the localhost website (http://localhost:3000 is the default)
    1. On first launching this app, select the **Create Account** tab and create an account by entering a valid email address and password.
        * The verification code will be sent to the email address, verify account before proceeding        
    1. Sign in using this address

Optional - if you want to access the Admin features of this app (for creating some mock data), then:
In the repo root folder:
1. `amplify console`
    1. Select **AWS console**
    1. Open the link supplied by the Amplify CLI
    1. Select **Go to Amplify Studio to enable.**
    1. Switch **Enable Amplify Studio.** to **On**
    1. Once enabled, go back on page and select **Launch Studio**, ensure you allow the new window to open (in case your browser blocks it)
    1. In Amplify Studio, select **User management** from the sidebar
        1. You should see any accounts you have already created in the Users list.
    1. Select Groups, you should see *admins* in the list
    1. Select admins, then **Add user(s)**
    1. Find a user by email that you want to add as an admin, select **Add users**
1. Should you ever want to return to Amplify Studio, select **Amplify Studio** from the options `amplify console` presents

### Clean-up
To ensure you are not charged, delete the AWS Amplify app that was created by the installation steps above. 
> Note, that this will also delete the generated Amplify source code files such as schema.graphql. If you wish to keep those files, copy them somewhere else or create a repo with them before running this.
1. **amplify delete**


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

