"""Original synthesized UI effects. No samples or third-party recordings."""
import math, random, struct, wave
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'assets/sounds'
rate=48000
for index,name in enumerate(['tap','tick','pop','sweep','rise','confirm','soft-hit','spark']):
    rng=random.Random(100+index); length=[.1,.07,.18,.45,.5,.45,.3,.4][index]; samples=[]
    for n in range(int(rate*length)):
        t=n/rate;u=t/length;env=(1-u)**3*min(1,t/.006)
        f=[700,1500,400,180,320,660,110,1600][index]
        if name in ['sweep','rise']:value=(rng.random()*2-1)*.2+math.sin(2*math.pi*(f*t+1000*t*t))*.55
        elif name=='confirm':value=(math.sin(2*math.pi*660*t)+math.sin(2*math.pi*880*t))*.42
        else:value=math.sin(2*math.pi*(f*t-80*t*t))*.7
        samples.append(struct.pack('<h',int(max(-1,min(1,value*env*.35))*32767)))
    with wave.open(str(out/(name+'.wav')),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(samples))
print('Wrote 8 original synthesized effects.')
