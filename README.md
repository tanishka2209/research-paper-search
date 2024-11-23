# Research Paper Search Web App

## Overview

This project is a simple web application that allows users to search for research papers, display the results, and save specific papers to their collection. The application consists of a React frontend and a Node.js/Express backend.

## Features

- Search for research papers
- Display search results
- Save papers to a personal collection
- Remove papers from the saved collection
- Responsive design for various screen sizes

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/meeheer123/research-paper-search.git
   cd research-paper-search
   ```

2. Install the dependencies for both the frontend and backend:

   ```shell
   npm install
   ```

## Configuration

No additional configuration is required for this demo application. However, in a production environment, you might want to set up environment variables for the server port, API keys, etc.

## Running the Application

To run both the frontend and backend concurrently:

   ```shell
   npm run dev
   ```

This command will start the React development server on `http://localhost:3000` and the Express backend server on `http://localhost:5000`.

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Use the search bar to look for research papers.
3. Click the "Save Paper" button to add a paper to your saved collection.
4. Switch to the "Saved Papers" tab to view your saved papers.
5. Click "Remove from Saved" to remove a paper from your saved collection.

## Project Structure

```plaintext
research-paper-search/
├── public/
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── server.js
├── package.json
└── README.md
```

- `src/App.js`: Main React component containing the application logic
- `server.js`: Express server handling API requests for saved papers

## Technologies Used

- Frontend: React, Tailwind CSS, Lucide React (for icons)
- Backend: Node.js, Express
- State Management: React Hooks
- HTTP Requests: Axios

## Limitations

- The search functionality currently uses mock data. In a real-world application, this would be connected to an actual research paper API or database.
- The saved papers are stored in memory on the server and will be reset when the server restarts. In a production application, you would use a persistent database.
