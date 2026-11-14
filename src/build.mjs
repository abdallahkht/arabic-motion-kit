import fs from 'node:fs';
import {cutawayComposition} from './cutaway/composition.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {drawVisual,themes,escapeHTML as esc} from './visuals.mjs';
import {findAnimation,sceneTypes} from './catalog.mjs';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function validatePlan(plan){
 if(!plan||!Array.isArray(plan.scenes)||!plan.scenes.length)throw Error('A plan needs scenes.');
 const width=plan.width??1080,height=plan.height??1920,fps=plan.fps??30;
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<180||height<180||width>3840||height>3840||width%2||height%2)throw Error('Use even dimensions between 180 and 3840.');
 if(![24,25,30,50,60].includes(fps))throw Error('Unsupported fps.');
 for(const s of plan.scenes){if(!Number.isFinite(s.duration)||s.duration<1||s.duration>60)throw Error('Every scene needs duration: 1–60 seconds.');if(!s.id&&!s.type)throw Error('Scene needs animation id or explainer type.');if(s.items&&(!Array.isArray(s.items)||s.items.some(x=>typeof x!=='string')))throw Error('items must be strings.');if(s.values&&(!Array.isArray(s.values)||s.values.some(x=>!Number.isFinite(x)||x<0)))throw Error('values must be non-negative finite numbers.');}
 return {width,height,fps};
}
const typeMap={hero:'orbit-logo',tokens:'process-flow',probability:'ranked-bars',network:'agent-network',layers:'layer-stack',flow:'process-flow',bars:'ranked-bars',metric:'metric-counter',scan:'blueprint',solar:'process-flow',fiber:'signal',comparison:'comparison'};
export function sceneVisual(scene,id){
 if(scene.type==='custom')throw Error('Custom scenes use a local composition field and are copied as editable HTML.');
 const mapped=scene.id||typeMap[scene.type];if(!mapped)throw Error('Unknown scene type: '+scene.type);
 const c={...findAnimation(mapped),...scene,id:mapped};
 const v=drawVisual(c,id);
 if(['tokens','scan','solar','fiber'].includes(scene.type)){
  v.parts.length=0;v.moves.length=0;
  const {p,group,text,box,line,pathDraw}=v;
  if(scene.type==='tokens'){
   group(text('اكتب فكرة واضحة',440,220,68),0);
   ['اكتب','فكرة','واضحة'].forEach((s,i)=>group(box(50+i*270,390,240,160,i===1?p.accent:p.paper)+text(s,170+i*270,490,50,i===1?p.paper:p.ink),.3+i*.35,{y:-100,opacity:0},{y:0,opacity:1}));
   group(text('رسم توضيحي للتقسيم',440,720,30),1.4);
  }
  if(scene.type==='scan'){
   group(`<ellipse cx="440" cy="430" rx="190" ry="270" fill="${p.soft}"/><path d="M260 400Q440 190 620 400M270 520Q440 740 610 520" fill="none" stroke="${p.accent}" stroke-width="3"/>`,0);
   for(let row=0;row<9;row++)for(let col=0;col<7;col++){const x=300+col*46,y=240+row*46;if(((x-440)/190)**2+((y-430)/270)**2<.85)group(`<circle cx="${x}" cy="${y}" r="5" fill="${p.accent}"/>`,.3+row*.12,{opacity:0},{opacity:1},.15);}
   pathDraw('M220 160H150V250M660 160H730V250M150 610V700H220M660 700H730V610',.3,p.second,7);
   group(text('تمثيل توضيحي للعمق',440,830,34),1.5);
  }
  if(scene.type==='solar'){
   group(`<circle cx="150" cy="130" r="70" fill="${p.second}"/>`,0,{scale:0,svgOrigin:'150 130'},{scale:1});
   group(box(110,340,660,250,p.accent,18),.2);
   for(let j=0;j<3;j++)for(let i=0;i<6;i++)group(box(130+i*105,360+j*70,85,50,p.soft,4),.25+j*.12+i*.04);
   for(let i=0;i<3;i++)pathDraw(`M${200+i*110} 160L${300+i*110} 320`,.3+i*.2,p.second,8);
   pathDraw('M770 465H820V750H440',1,p.accent,8);
   group(`<circle cx="380" cy="750" r="60" fill="${p.second}"/>`+text('تيار',620,830,38),1.4);
  }
  if(scene.type==='fiber'){
   group(box(50,280,780,300,p.soft,100)+box(50,350,780,160,p.accent,65),0);
   pathDraw('M60 430L170 365L280 495L390 365L500 495L610 365L720 495L820 430',.2,p.paper,13);
   group(text('قلب الليف',440,240,48)+text('غلاف يوجّه الضوء',440,700,40),.6);
  }
 }
 return {config:c,...v};

}
export function buildProject(plan,destination,baseDir=process.cwd()){
 const {width,height,fps}=validatePlan(plan),out=path.resolve(destination);
 if(fs.existsSync(path.join(out,'index.html')))throw Error(`Project already exists: ${out}. Choose a new output folder to preserve edits.`);
 fs.mkdirSync(path.join(out,'compositions'),{recursive:true});fs.mkdirSync(path.join(out,'assets','fonts'),{recursive:true});
 for(const f of fs.readdirSync(path.join(ROOT,'assets/fonts')))fs.copyFileSync(path.join(ROOT,'assets/fonts',f),path.join(out,'assets/fonts',f));
 const gsapFile=path.join(ROOT,'node_modules/gsap/dist/gsap.min.js');if(!fs.existsSync(gsapFile))throw Error('Run npm install first.');fs.copyFileSync(gsapFile,path.join(out,'assets/gsap.min.js'));
 const copied=new Map();
 const asset=(source)=>{if(copied.has(source))return copied.get(source);const full=path.resolve(baseDir,source);if(!fs.statSync(full).isFile())throw Error('Not a file: '+source);const name=`asset-${copied.size}${path.extname(full).toLowerCase()}`;fs.copyFileSync(full,path.join(out,'assets',name));let relative=`assets/${name}`;copied.set(source,relative);return relative;};
 const fonts=`@font-face{font-family:Plex;src:url('assets/fonts/IBMPlexSansArabic-Bold.ttf');font-weight:700}@font-face{font-family:Plex;src:url('assets/fonts/IBMPlexSansArabic-Regular.ttf');font-weight:400}`;
 let time=0,hosts=[],audio=[],windows=[];
 plan.scenes.forEach((source,i)=>{
  let scene=structuredClone(source),id=`scene-${i+1}`,duration=scene.duration;
  if(scene.media)scene.media=asset(scene.media);if(scene.mapImage)scene.mapImage=asset(scene.mapImage);
  if(scene.type==='custom'){
   if(!scene.composition)throw Error('custom requires composition: local HTML path');
   let html=fs.readFileSync(path.resolve(baseDir,scene.composition),'utf8');if(!html.includes('<template>'))throw Error('Custom scene must be a HyperFrames <template>.');
   // Custom template must register __SCENE_ID__; replace at build time, never rewrite a finished project.
   if(!html.includes('__SCENE_ID__'))throw Error('Use __SCENE_ID__ for custom composition and timeline id.');
   fs.writeFileSync(path.join(out,`compositions/${id}.html`),html.replaceAll('__SCENE_ID__',id));
  }else if(scene.id==='cutaway'){
   const config={...findAnimation('cutaway'),...scene};
   fs.writeFileSync(path.join(out,`compositions/${id}.html`),cutawayComposition(config,id,width,height,plan.transparent,fonts));
  }else{
   let {config:c,parts,moves,p}=sceneVisual(scene,id),compact=height/width<1.2;
   const title=c.title||'',subtitle=c.subtitle||'',note=c.note||((c.values?.length||['route-map','campaign-map'].includes(c.id))?'مثال توضيحي':'');
   const media=c.media?`<img id="${id}-media" src="${esc(c.media)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"/>`:'';
   const caption=c.caption?`<div class="caption">${esc(c.caption)}</div>`:'';
   let markup=`<template><style>${fonts}#root{position:absolute;inset:0;font-family:Plex,sans-serif;color:${p.ink};overflow:hidden} .surface{position:absolute;inset:0;background:${plan.transparent?'transparent':p.bg}}.heading{position:absolute;top:${compact?'5':'9'}%;left:10%;width:80%;margin:0;text-align:center;font-size:${width*(compact?.053:.071)}px;line-height:1.45;font-weight:700}.visual{position:absolute;left:9%;top:${compact?'25':'28'}%;width:82%;height:${compact?'59':'53'}%}.sub{position:absolute;top:${compact?'18':'23'}%;left:10%;width:80%;text-align:center;font-size:${width*.026}px}.note{position:absolute;bottom:8%;left:12%;width:76%;text-align:center;font-size:${width*.026}px;opacity:.7}.caption{position:absolute;bottom:13%;left:13%;width:74%;font-size:${width*.043}px;line-height:1.5;text-align:center;background:${p.paper};padding:2%;box-sizing:border-box;border-radius:16px}</style><div id="root" data-composition-id="${id}" data-width="${width}" data-height="${height}"><div class="surface"></div><h1 id="${id}-heading" class="heading" dir="rtl">${esc(title)}</h1><div class="sub" dir="rtl">${esc(subtitle)}</div><svg class="visual" viewBox="0 0 880 900" aria-label="${esc(c.title)}">${parts.join('')}</svg>${media}<div class="note" dir="rtl">${esc(note)}</div>${caption}</div><script>const tl=gsap.timeline({paused:true});tl.fromTo('#${id}-heading',{opacity:0,y:18},{opacity:1,y:0,duration:.45,ease:'power3.out'},0);${moves.join('\n')}window.__timelines['${id}']=tl;</script></template>`;
   fs.writeFileSync(path.join(out,`compositions/${id}.html`),markup);
  }
  hosts.push(`<div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${time}" data-duration="${duration}" data-width="${width}" data-height="${height}" data-track-index="1" data-track-kind="graphics"></div>`);
  if(scene.sound){const sound=asset(path.join(ROOT,'assets/sounds',scene.sound+'.wav'));audio.push(`<audio id="sfx-${i}" class="clip" src="${sound}" data-start="${time+(scene.soundAt??.2)}" data-duration="${Math.min(.5,duration-.2)}" data-volume="0.2"></audio>`);}
  windows.push({scene:id,start:time,end:time+duration,type:scene.type||scene.id});time+=duration;
 });
 for(const [i,g] of (plan.captionGroups||[]).entries()){
  if(!Number.isFinite(g.start)||!Number.isFinite(g.end)||g.start<0||g.end<=g.start||g.end>time+.05)throw Error('Invalid caption timing');
  hosts.push(`<div id="caption-${i}" class="clip" data-start="${g.start}" data-duration="${g.end-g.start}" data-track-kind="captions" data-track-index="3" style="position:absolute;inset:0;z-index:10"><div dir="rtl" style="position:absolute;bottom:12%;left:14%;width:72%;box-sizing:border-box;padding:2%;font:700 ${width*.045}px/1.5 Plex;text-align:center;color:#102b46;background:white;border-radius:14px">${esc(g.text)}</div></div>`);
 }
 if(plan.narration)audio.push(`<audio id="narration" class="clip" src="${asset(plan.narration)}" data-start="0" data-duration="${time}" data-volume="1"></audio>`);
 fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="ar"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>${fonts}html,body{margin:0;background:${plan.transparent?'transparent':'#071e2d'}}#root{position:relative;width:${width}px;height:${height}px;overflow:hidden}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="${time}" data-width="${width}" data-height="${height}" data-fps="${fps}">${hosts.join('\n')}${audio.join('\n')}</div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
 fs.writeFileSync(path.join(out,'plan.json'),JSON.stringify(plan,null,2));fs.writeFileSync(path.join(out,'timeline.json'),JSON.stringify(windows,null,2));
 return {out,duration:time,width,height,fps,scenes:plan.scenes.length};
}
