# LocalTube

**LocalTube** is a lightweight, local front-end for YouTube that lets you search and watch videos without the tracking and analytics of the official YouTube site. It leverages the YouTube Data API v3 to fetch video data and stream content directly from YouTube, offering a cleaner, more private viewing experience.

This project is designed for personal use and runs on your local machine. Optionally, you can host it on a remote VPS for broader access.

---

## Features
- **Privacy-focused**: No Google Analytics or user tracking.
- **Simple interface**: Search and play videos with ease.
- **Local setup**: Runs locally using a basic Python web server.

---

## Installation

Follow these steps to set up LocalTube on your machine:

### 1. Obtain a YouTube Data API Key
   - **Purpose**: The API key enables access to YouTube's video data.
   - **Steps**:
     1. Sign in to the [Google Cloud Console](https://console.cloud.google.com/) with a Gmail account.
     2. Create a new project (or use an existing one).
     3. Enable the **YouTube Data API v3** for your project.
     4. Go to the "Credentials" section and generate an **API key**.
   - **Note**: Keep your API key confidential and avoid sharing it publicly.

### 2. Set Up the Project
   - Clone the LocalTube repository:
     ```bash
     git clone https://github.com/EdgeOfAssembly/LocalTube.git
     ```
   - Navigate to the project directory:
     ```bash
     cd LocalTube
     ```
   - Open `index.html` in a text editor and find the `apiKey` variable (around line 52).
   - Replace `'YOUR_API_KEY_HERE'` with your API key.
   - Save and close the file.

### 3. Launch a Local Web Server
   - Start a simple web server with Python:
     ```bash
     python -m http.server
     ```
   - Open your browser and visit `http://localhost:8000`.

---

## Usage
- **Search**: Enter a query (e.g., "predator") in the search bar at the top.
- **View Results**: Click "Search" to display video thumbnails below the player.
- **Play Videos**: Click a thumbnail to load and play the video in the embedded player.

**Tip**: Use the "Go to Results" link in the sidebar to jump to the search results section.

---

## Limitations
- **API Quota**: The free API key provides around 100 requests per day, suitable for personal use.
- **Streaming**: Videos are streamed from YouTube, requiring an internet connection.

---

## License
This project is in the **public domain**. Feel free to use, modify, and distribute it without any restrictions.

---

## Troubleshooting
- **No Search Results**: Verify your API key is correctly inserted in `index.html`.
- **Server Issues**: Ensure the Python web server is running and `http://localhost:8000` is accessible.
- **Quota Limits**: If you exceed the API request limit, request a quota increase from Google or switch to a new API key.

---

**Enjoy a tracker-free YouTube experience with LocalTube!**