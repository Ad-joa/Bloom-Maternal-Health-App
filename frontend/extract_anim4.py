import json

transcript_path = r'c:\Users\asare\.gemini\antigravity-ide\brain\512b1e40-082a-4ab6-bbb8-3b7fa4daa6ae\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\asare\Desktop\Bloom-Maternal-Health-App\frontend\assets\animations\ghana_context.json'

with open(transcript_path, encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines[-200:]):
    if '{"v":"5.9.6"' in line:
        print("Found line!")
        data = json.loads(line)
        content = data.get('content', '')
        start_idx = content.find('{"v":"5.9.6"')
        if start_idx != -1:
            json_str = content[start_idx:]
            end_idx = json_str.find('</ADDITIONAL_METADATA>')
            if end_idx != -1:
                json_str = json_str[:end_idx]
            
            end_idx2 = json_str.find('<USER_REQUEST>')
            if end_idx2 != -1:
                json_str = json_str[:end_idx2]
            
            json_str = json_str.strip()
            with open(output_path, 'w', encoding='utf-8') as out:
                out.write(json_str)
            print("Successfully extracted animation to", output_path)
            break
