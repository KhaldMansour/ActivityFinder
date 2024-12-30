# ActivityFinder

This is a NestJS application that implements the following features:

- **Authentication System**: User registration and login functionality.
- **Activity Management**: Users can create and own activities, with the ability to index activities by title.
- **Swagger Documentation**: Auto-generated Swagger UI for API documentation.
- **Unit and Integration Tests**: Testing for various parts of the application, including unit and integration tests.
- **GitHub Actions**: Configured workflows for linting and running tests.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
  - [Authentication](#authentication)
  - [Activities](#activities)
  - [Swagger Documentation](#swagger-documentation)
  - [Testing](#testing)
  - [GitHub Actions](#github-actions)
- [Usage](#usage)


## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   
   `git clone https://github.com/KhaldMansour/ActivityFinder.git`

2. Install the dependencies:

   `cd nestjs-app`  
   `npm install`

3. Set up environment variables (if any). You can use `.env` for local development.

## Features

### Authentication

The application provides an authentication system that supports user registration and login.

- **Register**: Users can create an account with their first name, last name, email, and password.
- **Login**: Users can log in with their email and password to obtain a JWT token.

### Activities

Users can create and manage activities. Each activity has the following attributes:

- **Title**: The name of the activity.
- **Price**: The price of the activity.
- **Rating**: A rating between 0 and 5.
- **Has Offer**: An optional field indicating whether the activity has an offer.
- **Supplier**: The user who owns the activity.

### Swagger Documentation

Swagger has been added to the application for API documentation. Once the server is running, visit `http://localhost:3000/api/docs` to access the interactive Swagger UI. 

The documentation includes:
- Endpoints for user registration, login, and activity management.
- Model descriptions for requests and responses.
- Example inputs and outputs.

### Testing

Unit and integration tests are written using Jest. The tests include:

- Unit tests for service methods and controllers.
- Integration tests for API endpoints to ensure the system works as expected.

#### Running Tests

To run the tests:

`npm run test`


### GitHub Actions

GitHub Actions are configured to automate linting and testing tasks.

#### Linting

A GitHub Action (`lint.yml`) runs the `npm run lint` command to ensure code quality. The workflow triggers on `push` or `pull_request` to the `main` branch.

#### Running Tests

A separate GitHub Action (`test.yml`) is configured to run tests automatically using the `npm run test` command. This also triggers on `push` or `pull_request` to the `main` branch.

## Usage

Once the application is set up, you can run it locally by executing:

`npm run start`

The API will be available at `http://localhost:3000/api/`.

You can also run the application in **development mode** using:

`npm run start:dev`

This will enable live reloading for any code changes.

