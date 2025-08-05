from flask import Flask, send_from_directory, request, Response
import yt_dlp
import threading
import json
import time

app = Flask(__name__)

# Global dictionary to store progress data for each video_id
progress_data = {}

def progress_hook(d, video_id):
    """Update progress data based on yt-dlp's progress hook."""
    if d['status'] == 'downloading':
        format_id = d['info_dict']['format_id']
        if format_id in progress_data[video_id]['formats']:
            fmt = progress_data[video_id]['formats'][format_id]
            # Update size if total_bytes is provided (e.g., for dynamic streams)
            if 'total_bytes' in d:
                fmt['size'] = d['total_bytes']
            # Update downloaded bytes for the current format
            if 'downloaded_bytes' in d:
                fmt['downloaded_bytes'] = d['downloaded_bytes']
            # Calculate total downloaded bytes and total size across all formats
            total_downloaded = sum(f['downloaded_bytes'] for f in progress_data[video_id]['formats'].values())
            total_size = progress_data[video_id]['total_size']
            # Compute overall percentage, ensuring it doesn’t exceed 100%
            percentage = (total_downloaded / total_size) * 100 if total_size > 0 else 0.0
            percentage = min(percentage, 100.0)
            # Format speed and ETA for display
            speed = d.get('speed', 0)
            eta = d.get('eta', 0)
            speed_str = f"{speed / 1024 / 1024:.2f} MiB/s" if speed else "Unknown"
            eta_str = f"{eta // 60:02}:{eta % 60:02}" if eta else "Unknown"
            # Update progress data
            progress_data[video_id].update({
                'percentage': percentage,
                'speed': speed_str,
                'eta': eta_str
            })
    elif d['status'] == 'finished':
        format_id = d['info_dict']['format_id']
        if format_id in progress_data[video_id]['formats']:
            fmt = progress_data[video_id]['formats'][format_id]
            # Ensure size is accurate when finished
            if 'total_bytes' in d:
                fmt['size'] = d['total_bytes']
            fmt['downloaded_bytes'] = fmt['size']
            # Check if all formats are complete
            if all(f['downloaded_bytes'] >= f['size'] for f in progress_data[video_id]['formats'].values()):
                progress_data[video_id]['status'] = 'complete'
                progress_data[video_id]['percentage'] = 100.0

def run_download(video_id):
    """Handle the download process and initialize progress tracking."""
    try:
        ydl_opts = {
            'progress_hooks': [lambda d: progress_hook(d, video_id)],
            'no_color': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract video info without downloading to get format details
            info = ydl.extract_info(f'https://www.youtube.com/watch?v={video_id}', download=False)
            # Handle multiple formats (e.g., video + audio) or single format
            if 'requested_formats' in info:
                formats = info['requested_formats']
            else:
                formats = [info]
            # Initialize formats dictionary with sizes and downloaded bytes
            formats_dict = {
                fmt['format_id']: {
                    'size': fmt.get('filesize', 0) or fmt.get('filesize_approx', 0),
                    'downloaded_bytes': 0
                } for fmt in formats
            }
            # Calculate total size of all formats
            total_size = sum(fmt['size'] for fmt in formats_dict.values())
            if total_size == 0:
                # Fallback if sizes are unavailable (e.g., live streams)
                total_size = float('inf')  # Will handle separately if needed
            # Initialize progress data
            progress_data[video_id] = {
                'formats': formats_dict,
                'total_size': total_size,
                'percentage': 0.0,
                'speed': 'Unknown',
                'eta': 'Unknown',
                'status': 'downloading'
            }
            # Start the download
            ydl.download([f'https://www.youtube.com/watch?v={video_id}'])
    except Exception as e:
        progress_data[video_id] = {'status': 'error', 'message': str(e)}

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/download')
def download():
    video_id = request.args.get('videoId')
    if video_id:
        # Set initial state
        progress_data[video_id] = {'status': 'starting'}
        threading.Thread(target=run_download, args=(video_id,)).start()
        return 'Download started'
    else:
        return 'No video ID provided', 400

@app.route('/progress/<video_id>')
def progress_stream(video_id):
    def generate():
        while True:
            data = progress_data.get(video_id, {'percentage': 0.0, 'status': 'starting'})
            yield f"data: {json.dumps(data)}\n\n"
            if data.get('status') in ['complete', 'error']:
                break
            time.sleep(1)
    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    print("Starting Flask app...")
    try:
        app.run(port=8000, debug=True)
    except Exception as e:
        print(f"Error running Flask app: {e}")