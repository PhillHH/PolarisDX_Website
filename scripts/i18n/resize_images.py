from PIL import Image
import os

files = [
    "src/assets/Frank Stoffels.jpg",
    "src/assets/Ulrike Schuerholz.jpg",
    "src/assets/Adriano Zuccala.jpeg"
]

for filepath in files:
    try:
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            continue

        with Image.open(filepath) as img:
            print(f"Processing {filepath} (Original: {img.size})")

            # Resize if width > 800
            if img.width > 800:
                # Calculate new height to maintain aspect ratio
                ratio = 800 / float(img.width)
                new_height = int((float(img.height) * float(ratio)))
                img = img.resize((800, new_height), Image.Resampling.LANCZOS)
                print(f"Resized to {img.size}")

            # Save with optimization
            img.save(filepath, optimize=True, quality=85)
            print(f"Saved {filepath}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
