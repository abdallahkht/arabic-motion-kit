import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,buildProject} from './build.mjs';
import {findEffect} from './catalog.mjs';
import {themes,escapeHTML as esc} from './visuals.mjs';
function run(args){const r=spawnSync('ffmpeg',args,{stdio:'inherit'});if(r.error)throw r.error;if(r.status)throw Error('FFmpeg could not prepare media.');}
export function buildEffect(options,destination){
 const e=findEffect(options.id),out=path.resolve(destination),duration=options.duration;
 if(!Number.isFinite(duration)||duration<1||duration>60||!Number.isFinite(options.start)||options.start<0)throw Error('Invalid effect timing.');
 if(e.cutout&&!options.cutout)throw Error('This effect needs a transparent subject. Run cutout on your shot first, then pass --cutout subject.mov.');
 if(e.kind==='media'&&!options.media)throw Error('broll-panel needs --media screenshot.png or recording.mp4');
 // Make a valid editable project and then add the footage layers.
 const project=buildProject({scenes:[{id:'focus-word',duration,title:'',items:[]}]},out);
 const src=path.resolve(options.input),clip='assets/shot.mp4';
 run(['-v','error','-n','-ss',String(options.start),'-i',src,'-t',String(duration),'-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',path.join(out,clip)]);
 if(options.cutout){const target=path.join(out,'assets/subject.mov');run(['-v','error','-n','-ss',String(options.start),'-i',path.resolve(options.cutout),'-t',String(duration),'-an','-c:v','prores_ks','-profile:v','4','-pix_fmt','yuva444p10le',target]);}
 let mediaPath='';if(options.media){mediaPath='assets/media'+path.extname(options.media);fs.copyFileSync(path.resolve(options.media),path.join(out,mediaPath));}
 const p=themes[options.theme]||themes.studio,words=options.config.items||['فكرة','تصميم','تنفيذ'],title=options.title||e.name;
 const id='fx',moves=[];let parts=[];
 const card=(s,x,y,w=310,h=150,i=0)=>{let n=`c${parts.length}`;parts.push(`<div id="${n}" class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${esc(s)}</div>`);moves.push(`tl.fromTo('#${n}',{y:-80,opacity:0},{y:0,opacity:1,duration:.6,ease:'power4.out'},${.2+i*.35});`);return n;};
 let layout='full';
 if(['tiers','chart','media'].includes(e.kind))layout='split';
 if(e.kind==='cover')layout='cover';
 switch(e.kind){
 case 'cards':case 'windows':words.slice(0,3).forEach((s,i)=>card(e.kind==='windows'?'◦ ◦ ◦  '+s:s,[60,390,720][i],[180,120,240][i],300,160,i));break;
 case 'orbit':words.slice(0,3).forEach((s,i)=>{let n=card(s,390,210,300,130,i);moves.pop();moves.push(`tl.fromTo('#${n}',{opacity:0},{opacity:1,duration:.3},${.1+i*.1});{const orbit={angle:${i*2.094}};tl.to(orbit,{angle:${i*2.094+Math.PI*2},duration:${duration-.2},ease:'none',onUpdate:()=>gsap.set('#${n}',{x:Math.cos(orbit.angle)*350,y:Math.sin(orbit.angle)*100})},.1);}`);});break;
 case 'tiers':words.slice(0,4).forEach((s,i)=>card(`${i+1}  ${s}`,90,120+i*175,900,140,i));break;
 case 'chart':words.slice(0,3).forEach((s,i)=>{card(s,80,150+i*210,290,150,i);let n=card(String((options.config.values||[35,65,90])[i]??0),400,150+i*210,((options.config.values||[35,65,90])[i]??0)*6,150,i);moves.push(`tl.fromTo('#${n}',{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:.9,ease:'power4.out'},${.3+i*.3});`);});break;
 case 'list':words.slice(0,3).forEach((s,i)=>card('✓ '+s,80,1180+i*160,920,130,i));break;
 case 'spotlight':parts.push(`<div class="dark"></div><div class="big">${esc(title)}</div>`);moves.push("tl.fromTo('.dark',{opacity:0},{opacity:.88,duration:.8},.1);tl.fromTo('.big',{opacity:0,scale:.8},{opacity:1,scale:1,duration:.6},.4);");break;
 case 'backdrop':parts.push(`<div class="backdrop"></div><svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1080 1920"><circle id="halo" cx="540" cy="700" r="430" fill="${p.accent}"/><circle cx="540" cy="700" r="340" fill="${p.bg}"/></svg>`);moves.push("tl.fromTo('#halo',{scale:0,svgOrigin:'540 700'},{scale:1,duration:1.1,ease:'expo.out'},.1);");card(title,160,170,760,150,0);break;
 case 'echo':parts.push(`<div class="big">${esc(title)}</div>`);moves.push("tl.fromTo('.big',{scale:.3,opacity:0},{scale:1,opacity:1,duration:.7,ease:'expo.out'},.1);");break;
 case 'correction':parts.push(`<div class="big"><span id="old">${esc(words[0])}</span><div id="new">${esc(words[1])}</div></div>`);moves.push("tl.fromTo('#old',{opacity:0},{opacity:1,duration:.3},.1);tl.to('#old',{textDecoration:'line-through',opacity:.5,duration:.3},1);tl.fromTo('#new',{y:-80,opacity:0},{y:0,opacity:1,duration:.5,ease:'expo.out'},1.3);");break;
 case 'comment':card(title,90,1330,900,230,0);break;
 case 'pings':words.slice(0,3).forEach((s,i)=>card(s,i%2?570:40,1200+i*150,460,130,i));break;
 case 'ring':parts.push('<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1080 1920"><path id="ring" d="M210 420Q90 1000 300 1500M870 420Q990 1000 780 1500" pathLength="1" fill="none" stroke="'+p.accent+'" stroke-width="12" stroke-linecap="round"/></svg>');moves.push("tl.fromTo('#ring',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1,ease:'power2.out'},.1);");break;
 case 'media':parts.push(/\.(mp4|webm|mov)$/i.test(mediaPath)?`<video id="broll" src="${esc(mediaPath)}" class="clip panel-media" data-start="0" data-duration="${duration}" muted playsinline></video>`:`<img src="${esc(mediaPath)}" class="panel-media"/>`);break;
 case 'cover':parts.push(`<div class="cover-bg"></div><div class="big" style="top:300px">${esc(title)}</div>`);words.slice(0,3).forEach((s,i)=>card(s,100,700+i*230,880,180,i));break;
 case 'tag':card(title,140,1390,800,180,0);break;
 }
 const scene=`<template><style>@font-face{font-family:Plex;src:url('assets/fonts/IBMPlexSansArabic-Bold.ttf');font-weight:700}#root{position:absolute;inset:0;overflow:hidden;font-family:Plex;color:${p.ink}}.card{position:absolute;background:${p.paper};border-radius:24px;display:flex;align-items:center;justify-content:center;padding:28px;box-sizing:border-box;font-size:43px;line-height:1.4;direction:rtl;text-align:center;box-shadow:0 12px 40px #0002}.big{position:absolute;top:100px;left:80px;width:920px;text-align:center;font-size:104px;font-weight:700;line-height:1.45;direction:rtl;color:${e.kind==='cover'?p.accent:'#f4f8ff'};text-shadow:${e.kind==='cover'?'none':'0 3px 14px #0008'}}.dark,.backdrop,.cover-bg{position:absolute;inset:0;background:${e.kind==='spotlight'?'#000':p.bg}}.panel-media{position:absolute;left:0;top:0;width:1080px;height:960px;object-fit:contain;background:${p.bg}}</style><div id="root" data-composition-id="fx" data-width="1080" data-height="1920">${layout==='split'?`<div style="position:absolute;inset:0 0 50%;background:${p.bg}"></div>`:''}${parts.join('')}</div><script>const tl=gsap.timeline({paused:true});${moves.join('\n')}window.__timelines.fx=tl;</script></template>`;
 fs.writeFileSync(path.join(out,'compositions/fx.html'),scene);
 const cameraStyle=layout==='split'?'left:0;top:960px;width:1080px;height:960px;object-fit:cover;object-position:center 32%':'inset:0;width:1080px;height:1920px;object-fit:cover';
 const layer=`<video id="camera" class="clip" src="${clip}" data-start="0" data-duration="${duration}" data-has-audio="true" playsinline style="position:absolute;${cameraStyle};z-index:0"></video><div id="fx" class="clip" data-composition-id="fx" data-composition-src="compositions/fx.html" data-start="0" data-duration="${duration}" data-width="1080" data-height="1920" data-track-kind="graphics" data-track-index="2" style="position:absolute;inset:0;z-index:1"></div>${e.cutout?`<video id="subject" class="clip" src="assets/subject.mov" data-start="0" data-duration="${duration}" muted playsinline style="position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;z-index:2"></video>`:''}`;
 let html=fs.readFileSync(path.join(out,'index.html'),'utf8');html=html.replace(/<div id="scene-1"[\s\S]*?<\/div>/,layer);fs.writeFileSync(path.join(out,'index.html'),html);fs.writeFileSync(path.join(out,'effect.json'),JSON.stringify({...options,input:path.basename(src)},null,2));
 return {...project,effect:e.id,cutout:e.cutout,note:'Inspect face clearance and cutout edges before delivery. No automatic face tracking.'};
}
