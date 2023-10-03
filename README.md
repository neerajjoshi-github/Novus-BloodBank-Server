# NOVUS: Blood Donation Management Web App (Server)

## Overview

This is a server-side web application designed to help organizations efficiently manage blood donation data. This app allows organizations to keep track of their blood inventory, record donations from donors, and facilitate the distribution of blood to hospitals.

## Table of Contents

- [Features](#features)
- [Run Locally](#run-locally)
- [Dependencies](#dependencies)

## Features

- **User Authentication**: Secure user authentication with JSON Web Tokens (JWT).
- **Responsive Design**: Optimized for both large screens and mobile devices.
- **Inventory Management**: Efficiently manage blood inventory for donors, hospitals, and organizations.
- **Ease of Use**: Easily add new inventories.
- **Database**: Utilize mongodb to store data.

## Run Locally

To get started with NOVUS, follow these steps:

1. Clone the Novus-BloodBank-Client repository to your local machine.

```bash
  git clone https://github.com/neerajjoshi-github/Novus-BloodBank-Server.git
```

2. Navigate to the server directory.

```bash
  cd Novus-BloodBank-Server
  npm install
```

3. Run `npm install` to install server-side project dependencies.

```bash
  npm install
```

4. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your environment variables:

```bash
  MONGODB_CONNECTION_URL="your_mongodb_connection_url"
  PORT="port_number"
  JWT_SECRET="your_jwt_secret"
```

4. Start the server.

```bash
 npm run dev
```

5. The server will be runing at port PORT or 3000.

6. **Frontend Setup**: To complete the NOVUS Blood Donation Management Web App, you will need to set up a frontend server. For detailed instructions and access to the frontend server code, please visit our [Frontend Server Repository](https://github.com/neerajjoshi-github/Novus-BloodBank-Client).

## Dependencies

The server relies on various libraries and packages for development and functionality. Key dependencies include:

- **Express**: A web application framework for building APIs.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB.
- **bcryptjs**: Library for hashing and salting passwords.
- **jsonwebtoken**: Used for generating and verifying JSON Web Tokens (JWT).
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: Library for loading environment variables from a `.env` file.
- **http-errors**: Library for creating HTTP errors with meaningful messages.

Please refer to the `package.json` file for the complete list of server-side dependencies.

## I hope you find this project interesting and useful. Thanks for checking it out!!
