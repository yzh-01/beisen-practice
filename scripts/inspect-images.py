from pathlib import Path
from PIL import Image, ImageDraw
import json

project = Path(__file__).resolve().parent.parent
upstream = next((project / 'research/upstream').glob('BeiSen_Practice-*'))
text = (upstream / 'src/data/questions.js').read_text(encoding='utf8')
questions = [json.loads(line.strip().rstrip(',')) for line in text.splitlines() if line.strip().startswith('{"id":')]
groups = {'graphic': [q for q in questions if q['id'].startswith('g-')][:25], 'data': [q for q in questions if q['id'].startswith('d-')][25:50]}
for name, group in groups.items():
    for page in range(0, len(group), 5):
        sheet = Image.new('RGB', (1200, 5*370), 'white')
        draw = ImageDraw.Draw(sheet)
        for row, q in enumerate(group[page:page+5]):
            draw.text((10, row*370+8), f"{q['id']} | source answer {q['answer']}", fill='black')
            x=10
            for filename in q.get('images', []):
                im = Image.open(upstream / 'public/question-bank' / filename).convert('RGB')
                im.thumbnail((570, 320))
                sheet.paste(im, (x, row*370+35))
                x += 590
        sheet.save(project / f'research/{name}-{page//5+1+(5 if name=="data" else 0)}.png')
ids=[1,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,24,25,89]
print(json.dumps([{'id':q['id'],'images':[{'file':f,'size':Image.open(upstream/'public/question-bank'/f).size} for f in q.get('images',[])]} for q in questions if q['id'] in ['g-'+str(i) for i in ids]]))
