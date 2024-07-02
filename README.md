# Destin Server

Destin is a partner searching application with admin functionalities, designed to help users find partners and manage application data effectively. This repository contains the server-side code necessary to support the application.

## Features

- Partner Search and Management
- User Authentication and Authorization
- Admin Panel for Application Management
- CRUD Operations for Partners and Users
- Nodemailer Integration for Email Notifications

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for Authentication
- Nodemailer for Email Sending
- Winston for Logging

## Installation

1. Clone the repository:
   git clone https://github.com/apuchandradas5568/destin-server.git
   cd destin-server

2. Install dependencies for the client and server:
    cd server
    npm install


3. Create a .env file in the server directory and add your MongoDB URI, JWT secret, and other necessary environment variables:
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret


## Usage
1. Start the server:
   cd server
   npm start
   
