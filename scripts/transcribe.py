"""Local multilingual word timestamps. Model downloads on first use; media stays local."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('input');p.add_argument('--out',required=True);p.add_argument('--language',default='ar');p.add_argument('--model',default='small');a=p.parse_args()
try:from faster_whisper import WhisperModel
except ImportError:raise SystemExit('Run npm run setup -- --speech, then use .venv/bin/python (Windows: .venv/Scripts/python.exe).')
if Path(a.out).exists():raise SystemExit('Output exists. Choose a new filename.')
m=WhisperModel(a.model,device='cpu',compute_type='int8')
segments,info=m.transcribe(a.input,language=a.language,word_timestamps=True,vad_filter=True)
words=[{'word':w.word.strip(),'start':round(w.start,3),'end':round(w.end,3)} for s in segments for w in (s.words or [])]
Path(a.out).parent.mkdir(parents=True,exist_ok=True);Path(a.out).write_text(json.dumps({'language':info.language,'words':words},ensure_ascii=False,indent=2))
print(f'{len(words)} words. Review Arabic recognition and exact word boundaries before timing visuals.')
