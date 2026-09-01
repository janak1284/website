import os
import re

directory = 'src/pages'
for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace 'http://127.0.0.1:8000/...' with `${import.meta.env.VITE_API_URL}/...`
        content = re.sub(r"'http://127\.0\.0\.1:8000([^']*)'", r"`${import.meta.env.VITE_API_URL}\1`", content)
        
        # Replace `http://127.0.0.1:8000/...` with `${import.meta.env.VITE_API_URL}/...`
        content = re.sub(r"`http://127\.0\.0\.1:8000([^`]*)`", r"`${import.meta.env.VITE_API_URL}\1`", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
print("Done")
