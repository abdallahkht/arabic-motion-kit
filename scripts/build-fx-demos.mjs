import fs from 'node:fs';import path from 'node:path';
import {effects} from '../src/catalog.mjs';import {buildProject} from '../src/build.mjs';import {buildEffect} from '../src/effects.mjs';
const dest=process.argv[2]||'work/effects-demo',p=buildProject({scenes:effects.map(()=>({id:'focus-word',duration:4,items:[]}))},dest);
fs.copyFileSync('examples/presenter.mp4',`${dest}/assets/shot.mp4`);fs.copyFileSync('work/presenter-cutout.mov',`${dest}/assets/subject.mov`);
// Original, product-neutral B-roll graphic.
fs.writeFileSync(`${dest}/assets/screen.svg`,'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="960"><rect width="1080" height="960" fill="#f0f4f8"/><rect x="120" y="150" width="840" height="660" rx="30" fill="#2463e8"/><path d="M280 550L450 380L570 470L800 260" stroke="white" stroke-width="20" fill="none"/><circle cx="800" cy="260" r="25" fill="#f26847"/></svg>');
let hosts=[];
for(let i=0;i<effects.length;i++){
 const e=effects[i],folder=`${dest}-parts/${e.id}`;
 buildEffect({id:e.id,input:'examples/presenter.mp4',cutout:e.cutout?'work/presenter-cutout.mov':undefined,media:e.id==='broll-panel'?`${dest}/assets/screen.svg`:undefined,title:e.id==='reading-cover'?'اعرض الفكرة كاملة':e.id==='echo'?'ابدأ بالفكرة':e.name,start:0,duration:4,theme:'studio',config:{items:['فكرة','تصميم','تنفيذ']}},folder);
 let s=fs.readFileSync(`${folder}/compositions/fx.html`,'utf8').replaceAll('data-composition-id="fx"',`data-composition-id="fx-${i}"`).replaceAll("__timelines.fx",`__timelines['fx-${i}']`).replaceAll('assets/media.svg','assets/screen.svg');
 // IDs must be unique across assembled composition files.
 s=s.replace(/id="(c\d+|old|new|ring|halo)"/g,`id="fx${i}-$1"`).replace(/'#(c\d+|old|new|ring|halo)'/g,`'#fx${i}-$1'`);
 fs.writeFileSync(`${dest}/compositions/fx-${i}.html`,s);
 let split=['tier-board','chart-panel','broll-panel'].includes(e.id),style=split?'left:0;top:960px;width:1080px;height:960px;object-fit:cover;object-position:center 32%':'inset:0;width:1080px;height:1920px;object-fit:cover';
 hosts.push(`<video id="camera-${i}" class="clip" src="assets/shot.mp4" data-start="${i*4}" data-duration="4" muted playsinline style="position:absolute;${style};z-index:0"></video><div id="fx-${i}" class="clip" data-composition-id="fx-${i}" data-composition-src="compositions/fx-${i}.html" data-start="${i*4}" data-duration="4" data-width="1080" data-height="1920" data-track-kind="graphics" data-track-index="2" style="position:absolute;inset:0;z-index:1"></div>${e.cutout?`<video id="subject-${i}" class="clip" src="assets/subject.mov" data-start="${i*4}" data-duration="4" muted playsinline style="position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;z-index:2"></video>`:''}`);
}
let html=fs.readFileSync(`${dest}/index.html`,'utf8');html=html.replace(/<div id="scene-1"[\s\S]*?(?=<\/div><script>window)/,hosts.join('\n'));fs.writeFileSync(`${dest}/index.html`,html);console.log(p);
