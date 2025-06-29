import json
import os
import glob
import pandas as pd


folder_path = 'data/raw_json/'
json_pattern = os.path.join(folder_path, '*.json')
json_files = glob.glob(json_pattern)

artist_file_map = []


for file_path in json_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            file_name = os.path.basename(file_path).replace('.json', '')
            if isinstance(data, list):
                for entry in data:
                    artist = entry.get('artistName')
                    artist_file_map.append({'label': file_name, 'artist': artist})
    except Exception as e:
        print(f"Error reading {file_path}: {e}")


df = pd.DataFrame(artist_file_map)
df['artist'] = df['artist'].str.strip()
df = df.dropna(subset=['artist'])


output_path = 'data/result/artist_file_map.json'
df.to_json(output_path, orient='records', indent=2, force_ascii=False)

