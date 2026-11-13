"""Find a spoken phrase in reviewed word timestamps, with Arabic normalization."""
import argparse,json,re,unicodedata
from pathlib import Path

def normalize(s):
 s=''.join(c for c in unicodedata.normalize('NFKC',s) if unicodedata.category(c)!='Mn')
 s=s.translate(str.maketrans({'أ':'ا','إ':'ا','آ':'ا','ى':'ي','ـ':''}))
 return re.sub(r'[^\w]+',' ',s.lower()).strip()

def matches(words,phrase):
 query=normalize(phrase).split();flat=[]
 for i,w in enumerate(words):
  flat.extend((t,i) for t in normalize(w['word']).split())
 return [{'start':words[flat[i][1]]['start'],'end':words[flat[i+len(query)-1][1]]['end'],'index':flat[i][1]} for i in range(len(flat)-len(query)+1) if query and [t for t,j in flat[i:i+len(query)]]==query]

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('transcript');p.add_argument('phrase');p.add_argument('--occurrence',type=int);a=p.parse_args();data=json.loads(Path(a.transcript).read_text());hits=matches(data['words'],a.phrase)
 if not hits:raise SystemExit('Phrase not found. Review the transcript; no timing was guessed.')
 if a.occurrence:
  if a.occurrence<1 or a.occurrence>len(hits):raise SystemExit('Occurrence out of range.')
  hits=[hits[a.occurrence-1]]
 print(json.dumps(hits,ensure_ascii=False,indent=2))
