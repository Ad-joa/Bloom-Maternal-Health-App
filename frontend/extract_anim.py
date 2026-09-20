import json
import os
import re

transcript_path = r'c:\Users\asare\.gemini\antigravity-ide\brain\512b1e40-082a-4ab6-bbb8-3b7fa4daa6ae\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\asare\Desktop\Bloom-Maternal-Health-App\frontend\assets\animations\ghana_context.json'

with open(transcript_path, encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    if '"nm":"Comp 1"' in line:
        data = json.loads(line)
        content = data.get('content', '')
        
        # The JSON usually starts with {"v":"5.9.6" and ends with ]}
        match = re.search(r'\{"v":"5\.9\.6".*?\]\}', content, re.DOTALL)
        if match:
            with open(output_path, 'w', encoding='utf-8') as out:
                out.write(match.group(0))
            print("Successfully extracted animation to", output_path)
            break
