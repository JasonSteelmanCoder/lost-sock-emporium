# The Lost Sock Emporium

A place to find a replacement sock for the one you lost!

## Description

The Lost Sock Emporium is a full stack e-commerce web app, meant to sell single socks to replace the ones you lost. Its front end is built with React, while its back end is made up of Node, Express, and PostgreSQL. Passport.js and Express-session allow the user to register, log in, and log out. Data on products, users, sessions, and orders are stored and processed by the SQL database. Express endpoints pass this data on via HTTP calls from React components. 

## Link

This app is deployed using the cloud service Render. 
https://lost-sock-emporium.onrender.com

## Getting Started

### Dependencies

#### Core Dependencies

* **React** ('^18.2.0'): A JavaScript library for building highly interactive user interfaces
* **Node** ('^18.18.1'): A runtime environment for running JavaScript on the server side
* **Express** ('^4.18.2'): A web application framework for building out API endpoints
* **PostgreSQL**: A database for storing data on products, users, and sessions

#### Additional Libraries and Tools: Back End

* "bcrypt": "^5.1.1",
* "body-parser": "^1.20.2",
* "connect-pg-simple": "^9.0.1",
* "cors": "^2.8.5",
* "dotenv": "^16.4.1",
* "express-session": "^1.17.3",
* "passport": "^0.7.0",
* "passport-local": "^1.0.0",
* "pg": "^8.11.3",
* "swagger-jsdoc": "^6.2.8",
* "swagger-ui-express": "^5.0.0"

#### Additional Libraries and Tools: Front End

* "@reduxjs/toolkit": "^2.1.0",
* "@testing-library/jest-dom": "^5.17.0",
* "@testing-library/react": "^13.4.0",
* "@testing-library/user-event": "^13.5.0",
* "react": "^18.2.0",
* "react-dom": "^18.2.0",
* "react-redux": "^9.1.0",
* "react-router-dom": "^6.22.0",
* "react-scripts": "5.0.1",
* "web-vitals": "^2.1.4"

### Installing

* Clone repository
* Navigate to server directory and run `npm install`
* Navigate to client directory and run `npm install` 

### Executing program

* In the terminal, navigate to the server directory and input `npm run start`.
* In a new terminal, navigate to the client directory and input `npm run start`.

## Authors

Jason Steelman
https://www.linkedin.com/in/jasonsteelmancoder
https://github.com/JasonSteelmanCoder

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

* [awesome-readme](https://github.com/matiassingers/awesome-readme)