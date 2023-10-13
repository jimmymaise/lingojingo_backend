# LingoJingo Backend README

## Overview

The `lingojingo_backend` repository serves as the backend for the LingoJingo application, a vocabulary learning platform. It aims to provide a robust and scalable backend that supports various features such as managing user data, handling vocabulary and topic data, and providing APIs for the frontend to consume.

The backend is built using Node.js and uses MongoDB as its database. It also utilizes Firebase for user authentication.

### Project Background

This project was initiated as my side project while learning Node.js. It was also supported by a 20K$ credit from Google Cloud. Despite the effort and resources put into it, the project did not achieve its expected user retention rates. As a result, the project is now open-source, and contributions are welcome to help improve and evolve it.

## Prerequisites

To set up and run the repository, you'll need the following installed on your machine:

- Node.js
- npm
- MongoDB
- Firebase account (for user authentication)

## Installation

### Clone the Repository

Clone the repository to your local machine using the command git clone

### Install Dependencies

Navigate to the root directory of the project and run the command `npm install` to install the necessary dependencies.

### Environment Variables

The application requires several environment variables to be set:

- NODE_ENV
- ES_URL
- MONGO_URL
- MONGO_DB_NAME
- FIRE_BASE_CONFIG_SERVICE

You can set these variables in a `.env` file located in the root directory of the project.

### Database Setup

Ensure that MongoDB is installed and running. The `MONGO_URL` and `MONGO_DB_NAME` environment variables should point to your MongoDB instance.

## Running the Application

To start the server, navigate to the root directory of the project and run the command `node server.js`

## Additional Notes

This is a high-level overview of the setup process. Depending on your specific environment and the configuration of the application, additional steps may be required.

## References

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)

