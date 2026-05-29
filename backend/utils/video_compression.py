import os
import subprocess
import tempfile
import time

def compress_video_ffmpeg(input_filepath: str, output_filepath: str) -> bool:
    """
    Compresses a video using FFmpeg with aggressive settings to save 70-90% storage space.
    Uses H.264 codec, ultrafast preset, CRF 30, and scales to max 480p at 15fps.
    """
    try:
        command = [
            'ffmpeg',
            '-y',  # Overwrite output file if it exists
            '-i', input_filepath,
            '-vcodec', 'libx264',
            '-preset', 'ultrafast',  # Prioritize speed over perfect compression ratios to prevent backend timeout
            '-crf', '30',  # Aggressive compression (28-32 is very high for web)
            '-vf', 'scale=-2:480',  # Scale to max 480p height (width auto-scaled to preserve aspect ratio)
            '-r', '15',  # Reduce framerate to 15 fps
            '-acodec', 'aac',
            '-b:a', '64k',  # 64kbps audio is highly compressed but still perfectly clear for AI parsing
            output_filepath
        ]
        
        print(f"Starting aggressive video compression on {input_filepath}...")
        start_time = time.time()
        
        # Run the subprocess and capture output for debugging if needed
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            print(f"FFmpeg failed with exit code {result.returncode}")
            print(result.stderr)
            return False
            
        end_time = time.time()
        
        original_size = os.path.getsize(input_filepath)
        new_size = os.path.getsize(output_filepath)
        saved_bytes = original_size - new_size
        savings_percent = (saved_bytes / original_size * 100) if original_size > 0 else 0
        
        print(f"Compression Complete! Time: {end_time - start_time:.2f}s")
        print(f"Size reduced from {original_size/1024/1024:.2f}MB to {new_size/1024/1024:.2f}MB (Saved {savings_percent:.1f}%)")
        
        return True
        
    except Exception as e:
        print(f"Exception during FFmpeg compression: {e}")
        return False

def extract_thumbnail(input_filepath: str, output_image_path: str) -> bool:
    """
    Extracts the first frame of the video as a thumbnail preview image.
    """
    try:
        command = [
            'ffmpeg',
            '-y',
            '-i', input_filepath,
            '-vframes', '1',  # Extract only 1 frame
            '-q:v', '5',  # Lower quality for the image to save space
            output_image_path
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.returncode == 0
    except Exception as e:
        print(f"Exception during FFmpeg thumbnail extraction: {e}")
        return False
