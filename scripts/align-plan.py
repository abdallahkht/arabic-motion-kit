"""Time scene anchors and short caption groups to a recorded narration."""
import argparse,json,subprocess
from pathlib import Path
from sync import matches
p=argparse.ArgumentParser(description=__doc__);p.add_argument('plan');p.add_argument('transcript');p.add_argument('narration');p.add_argument('--out',required=True);a=p.parse_args()
out=Path(a.out).resolve()
if out.exists():raise SystemExit('Output exists. Choose a new filename.')
plan=json.loads(Path(a.plan).read_text());words=json.loads(Path(a.transcript).read_text())['words'];total=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',a.narration]))
starts=[0.0]
for s in plan['scenes'][1:]:
 if not s.get('anchor'):raise SystemExit('Each scene after the first needs anchor: an actual phrase in your recording.')
 hits=[h for h in matches(words,s['anchor']) if h['start']>starts[-1]]
 if not hits:raise SystemExit('Anchor not found in order: '+s['anchor'])
 if len(hits)>1 and 'occurrence' not in s:raise SystemExit('Ambiguous anchor; add occurrence: '+s['anchor'])
 n=s.get('occurrence',1)
 if n<1 or n>len(hits):raise SystemExit('Anchor occurrence out of range.')
 starts.append(hits[n-1]['start'])
for i,s in enumerate(plan['scenes']):
 s['duration']=round((starts[i+1] if i+1<len(starts) else total)-starts[i],3);s.pop('caption',None)
 if not 1<=s['duration']<=60:raise SystemExit('Scene timing outside 1–60 seconds. Adjust the scene anchors.')
plan['captionGroups']=[{'start':words[i]['start'],'end':words[min(i+2,len(words)-1)]['end'],'text':' '.join(w['word'] for w in words[i:i+3])} for i in range(0,len(words),3)]
plan['narration']=str(Path(a.narration).resolve());plan['narrationStatus']='recorded; timing imported from reviewed transcript'
# Preserve assets when the aligned plan is written to another directory.
for s in plan['scenes']:
 for key in ['media','mapImage','composition']:
  if s.get(key):s[key]=str((Path(a.plan).resolve().parent/s[key]).resolve())
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(plan,ensure_ascii=False,indent=2));print(out)
