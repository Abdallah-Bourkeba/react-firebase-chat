# React Firebase Chat

A real-time chat application built with React and Firebase.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

React Firebase Chat is a real-time chat application that leverages the power of React for the frontend and Firebase for the backend. It allows users to communicate with each other in real-time with a simple and intuitive user interface.

## Features

- Real-time messaging
- User authentication with Firebase
- Responsive design
- Emoji support
- User presence indicator

## Demo

You can see a live demo of the application [here](https://bourkeba-chat.netlify.app/).

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository**
   ```sh
   git clone https://github.com/Abdallah-Bourkeba/react-firebase-chat.git
   ```

2. **Navigate to the project directory**
   ```sh
   cd react-firebase-chat
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Set up Firebase**
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a new web app to your Firebase project.
   - Copy the Firebase configuration and replace it in the `.env` file:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

5. **Start the development server**
   ```sh
   npm start
   ```

## Usage

After setting up the project, you can start using the chat application by registering a new user or logging in with an existing account.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
