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
   - Start a simple web server with Python:
     ```bash
     python3 -m http.server 8000
     ```
   - Open your browser and visit `http://localhost:8000`.

   - Give your YouTube API key when asked and from 
     Settings on the left click it open, make sure the API key is there
     ans then click Save Settings.

**Note**: For more detailed instructions, including step-by-step guidance and screenshots, check out the [LocalTube_Tutorial.pdf](./LocalTube_Tutorial.pdf) included in this repository.

---

## Optional: Enable Video Downloading

If you’d like to download videos (e.g., in 1080p or higher) through LocalTube instead of just streaming, you’ll need to set up a Python virtual environment and install additional packages (`flask` and `yt-dlp`). This is optional and only necessary if your Linux package manager doesn’t provide these libraries or if you want to enable downloading functionality.

### Prerequisites
- **Python 3.x** installed on your system (check with `python3 --version`).
- **pip** (Python package installer, usually included with Python).

### Step-by-Step Instructions

1. **Create a Python Virtual Environment**  
   This isolates the project’s dependencies from your system Python. In the `LocalTube` directory, run:
   ```bash
   python3 -m venv venv
   ```
2. **Activate the Virtual Environment**
   Activate it to use the isolated Python environment:
   ```bash
   source venv/bin/activate
   ```
   - Your terminal prompt should change (e.g., (venv) appears), indicating the environment is active.

3. **Install Required Packages**
    Use the provided requirements.txt file to install flask and yt-dlp:
   ```bash
   pip install -r requirements.txt
   ```
   - This installs flask (for the web server) and yt-dlp (for downloading videos).

4. **Run the Flask Application**
    Start the Flask server to enable downloading (replace app.py with your actual Flask script name if different):
   ```bash
   python3 app.py
   ```
   - The server typically runs on http://localhost:8000. Check your script’s output for the exact address.


5. **Access LocalTube with Downloading**
   Open your browser and go to http://localhost:8000 (or the address provided by the Flask server). You can now use
   LocalTube’s downloading feature.

## Notes
   - Deactivating the Environment: When done, deactivate the virtual environment with:
   ```bash
   deactivate
   ```
   - requirements.txt: Ensure this file is in your LocalTube directory with the content:
   ```bash
   flask
   yt-dlp
   ```

   - Why This Is Optional: The basic streaming setup (using python -m http.server 8000) doesn’t require this. 
     Only set this up if you want to download videos.

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

## Contact
For support, feedback, or contributions, feel free to:

- Open an issue on the GitHub Issues page.
- Email me directly at haxbox2000@gmail.com


---

**Enjoy a tracker-free YouTube experience with LocalTube!**