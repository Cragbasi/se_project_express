## WTWR (What to Wear?): Back End

## Project Overview

The What To Wear (WTWR) app is designed to help users manage a database of clothing items based on weather conditions. Users can organize clothing into categories for hot, warm, and cold weather, ensuring they always have the right outfit for any forecast.

The app retrieves real-time weather data using a weather API based on geographic coordinates and displays relevant clothing suggestions. This back-end project establishes the server, handling API requests, user authentication, and database operations.

## Technologies and Implementation

## Core Dependencies

- Express.js (express@^4.21.2) – Framework for handling API routing and middleware.
- MongoDB (mongoose@^8.9.5) – NoSQL database for storing user and clothing item data.
- Nodemon – Automatically restarts the server when files change during development.
- Eslint & Prettier – Maintain clean, consistent, and error-free code formatting.

## Project Setup

- Installing Dependencies
  npm install express@^4.21.2 mongoose@^8.9.5
- Connecting to MongoDB
  mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');
- Starting the Server
  Entry point: app.js (Runs on port 3001)
- Run in standard mode: npm run start
- Run with auto-restart: npm run dev

## Project Structure

The project is structured for scalability:

- Routes (routes/) – Handles API request routing.
- Controllers (controllers/) – Contains logic for handling requests.
- Models (models/) – Defines MongoDB schemas for users and clothing items.
- Utils (utils/) – Stores supporting data, including error codes.

## Error Handling

If a request encounters an issue, appropriate error responses are returned:

- 400 – Invalid data passed for item/user creation or updates.
- 404 – Requested user or clothing item not found, or non-existent endpoint.
- 500 – Default server error with message: "An error has occurred on the server."
  Error codes are stored in utils/errors.js, ensuring scalability as new error types are added.

## Features

## Authorization

Currently, authorization is temporarily hardcoded. Users do not send authentication data yet, but this feature will be implemented in future updates.

## Liking/Disliking Items

Users can like an item once and remove their like afterward.

- MongoDB Operators Used:
- $addToSet – Adds an item to an array only if it’s not already there.
- $pull – Removes an item from an array.

## API Testing

The WTWR server API has been deployed remotely and tested using:

- Postman – To validate API functionality.
- GitHub Actions – For automated testing and CI/CD workflows
