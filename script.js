function saveSettings() {
  const theme = document.getElementById('theme').value;
  apiKey = document.getElementById('apiKey').value; // Update live variable
  localStorage.setItem('theme', theme);
  if (apiKey) {
    localStorage.setItem('apiKey', apiKey);
  }
  applyTheme(theme);
  // Optional: Subtle feedback instead of alert
  console.log('Settings saved!');
}

function applyTheme(theme) {
  document.body.className = theme;
  // Force reflow for browser to apply changes
  document.body.style.display = 'none';
  void document.body.offsetHeight; // Trigger reflow
  document.body.style.display = '';
  console.log('Theme applied:', theme); // For debugging
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the current video ID with the default video
  let currentVideoId = 'dQw4w9WgXcQ';

  const searchInput = document.querySelector('.search-bar');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  const thumbnailGrid = searchResults.querySelector('.thumbnail-grid');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  // Use saved API key or prompt for it if not set
  let apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    apiKey = prompt('Please enter your YouTube API Key:');
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    } else {
      alert('API Key is required for searches.');
    }
  }

  function performSearch() {
    const query = searchInput.value.trim();
    if (query === '') {
      searchResults.style.display = 'none';
      return;
    }

    // Update the heading with the search query
    searchResults.querySelector('h2').textContent = `Search Results for '${query}'`;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        thumbnailGrid.innerHTML = '';
        if (!data.items || data.items.length === 0) {
          thumbnailGrid.innerHTML = '<p>No results found.</p>';
        } else {
          data.items.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const thumbnailUrl = item.snippet.thumbnails.default.url;

            const a = document.createElement('a');
            a.href = `https://www.youtube.com/embed/${videoId}`;
            a.target = 'video-player';
            a.className = 'thumbnail';
            a.setAttribute('aria-label', `Play ${title}`);

            // Update currentVideoId and reset progress UI when a thumbnail is clicked
            a.addEventListener('click', () => {
              currentVideoId = videoId;
              progressContainer.style.display = 'none';
              progressBar.value = 0;
              progressText.textContent = '';
            });

            const img = document.createElement('img');
            img.src = thumbnailUrl;
            img.alt = `Thumbnail for ${title}`;

            const p = document.createElement('p');
            p.textContent = title;

            a.appendChild(img);
            a.appendChild(p);
            thumbnailGrid.appendChild(a);
          });
        }
        searchResults.style.display = 'block';
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        thumbnailGrid.innerHTML = '<p>Error fetching search results. Check your API key?</p>';
        searchResults.style.display = 'block';
      });
  }

  // Search button click event
  searchButton.addEventListener('click', performSearch);

  // Enter key press in search input
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  // Download button click event
  document.getElementById('download-button').addEventListener('click', () => {
    progressContainer.style.display = 'block';
    progressBar.value = 0;
    progressText.textContent = 'Starting download...';

    fetch(`/download?videoId=${currentVideoId}`)
      .then(response => response.text())
      .then(text => {
        console.log(text); // Outputs "Download started"
        const eventSource = new EventSource(`/progress/${currentVideoId}`);
        eventSource.onmessage = function(event) {
          const data = JSON.parse(event.data);
          if (data.status === 'error') {
            progressText.textContent = `Error: ${data.message}`;
            eventSource.close();
          } else if (data.status === 'complete') {
            progressBar.value = 100;
            progressText.textContent = 'Download Complete!';
            eventSource.close();
          } else {
            const percentage = data.percentage;
            progressBar.value = percentage;
            const speed = data.speed || 'N/A';
            const eta = data.eta || 'N/A';
            progressText.textContent = `Progress: ${percentage.toFixed(1)}% (Speed: ${speed}, ETA: ${eta})`;
          }
        };
        eventSource.onerror = function() {
          console.error("SSE error occurred");
          eventSource.close();
        };
      })
      .catch(error => {
        console.error('Error starting download:', error);
        progressText.textContent = 'Error starting download';
      });
  });

  // Load saved settings
  const savedTheme = localStorage.getItem('theme') || 'default';
  applyTheme(savedTheme);
  document.getElementById('theme').value = savedTheme;
  document.getElementById('apiKey').value = localStorage.getItem('apiKey') || '';
});