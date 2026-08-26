import json
import os

transcript_path = r'c:\Users\asare\.gemini\antigravity-ide\brain\512b1e40-082a-4ab6-bbb8-3b7fa4daa6ae\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\asare\Desktop\Bloom-Maternal-Health-App\frontend\assets\animations\ghana_context.json'

with open(transcript_path, encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    if '"nm":"Comp 1"' in line and '"type":"USER_INPUT"' in line:
        data = json.loads(line)
        content = data.get('content', '')
        
        # find where the JSON starts
        start_idx = content.find('{"v":"5.9.6"')
        if start_idx != -1:
            json_str = content[start_idx:]
            # find where the JSON ends (before any <ADDITIONAL_METADATA> or <USER_REQUEST> if it was pasted awkwardly)
            end_idx = json_str.find('<USER_REQUEST>')
            if end_idx != -1:
                json_str = json_str[:end_idx].strip()
            
            with open(output_path, 'w', encoding='utf-8') as out:
                out.write(json_str)
            print("Successfully extracted animation to", output_path)
            break
