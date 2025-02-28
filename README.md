# Programming Practice Generator - Frontend

This is the frontend application for the Programming Practice Generator tool. It provides a user interface for generating programming practice problems using AI.

## Features

- Input programming topics and languages
- Select difficulty levels
- Generate customized practice problems
- View problems with examples and hints
- Material-UI based responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will start on port 3000.

## Configuration

The application expects the backend server to be running on `http://localhost:3001`. If your backend is running on a different port or host, update the API endpoint in `src/App.js`.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Dependencies

- React
- Material-UI
- Axios for API calls
- Emotion for styled components
