import json
import re

transcript_path = r'c:\Users\asare\.gemini\antigravity-ide\brain\512b1e40-082a-4ab6-bbb8-3b7fa4daa6ae\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\asare\Desktop\Bloom-Maternal-Health-App\frontend\assets\animations\ghana_context.json'

found = False
with open(transcript_path, encoding='utf-8') as f:
    for line in reversed(f.readlines()):
        if '"type":"USER_INPUT"' in line:
            try:
                data = json.loads(line)
                content = data.get('content', '')
                if '"v":"5.9.6"' in content and '"nm":"Comp 1"' in content:
                    # Extract starting from {"v":"5.9.6"
                    start_idx = content.find('{"v":"5.9.6"')
                    
                    if start_idx != -1:
                        json_str = content[start_idx:]
                        
                        # Find the matching closing bracket or truncate at next tag
                        end_idx = json_str.find('<USER_REQUEST>')
                        if end_idx != -1:
                            json_str = json_str[:end_idx].strip()
                        
                        with open(output_path, 'w', encoding='utf-8') as out:
                            out.write(json_str)
                        print("Successfully extracted animation to", output_path)
                        found = True
                        break
            except Exception as e:
                print("Error parsing line:", e)

if not found:
    print("Could not find the animation string in the transcript.")
