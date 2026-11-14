import fs from 'node:fs';
import {escapeHTML} from '../visuals.mjs';

const fragment = fs.readFileSync(new URL('./scene.frag',import.meta.url),'utf8');
const player = fs.readFileSync(new URL('./player.js',import.meta.url),'utf8');
export function cutawayComposition(config,id,width,height,transparent,fonts) {
  const compact=height/width<1.3;
  const items=config.items.slice(0,5);
  const accent=/^#[0-9a-f]{6}$/i.test(config.accent)?config.accent:'#ff993e';
  const rows=items.map((item,i)=>`<section data-layer><svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1"/><circle r="2.7" fill="${accent}"/></svg><div dir="rtl" style="color:${i===items.length-1?accent:'#e9edf0'}">${escapeHTML(item)}</div></section>`).join('');
  const selector='#'+id+'-cutaway';
  return `<template><style>${fonts}
${selector}{position:absolute;inset:0;overflow:hidden;font-family:Plex,sans-serif;color:#f7f2e7}
${selector} canvas,${selector} svg{position:absolute;inset:0;width:100%;height:100%}
${selector} path{fill:none;stroke:#cbd6d5;stroke-opacity:.78;stroke-width:1.15;stroke-dasharray:1;stroke-dashoffset:1}
${selector} section div{position:absolute;width:18%;font-weight:700;font-size:${width*(compact?.024:.041)}px;line-height:1.25;text-align:left;opacity:0}
${selector} h1,${selector} h2{position:absolute;left:5%;width:90%;text-align:center;line-height:1.32;margin:0}
${selector} h1{top:8%;font-size:${width*(compact?.052:.079)}px}
${selector} h2{bottom:8%;font-size:${width*(compact?.052:.081)}px;opacity:0}
</style><div id="${id}-cutaway" data-composition-id="${id}" data-width="${width}" data-height="${height}" data-duration="${config.duration}"><canvas width="${width}" height="${height}"></canvas><h1 dir="rtl" data-title>${escapeHTML(config.title)}</h1>${rows}<h2 data-final dir="rtl">${escapeHTML(config.finalLabel??'كلّه بيبدأ بفكرة.')}</h2></div>
<script>${player}
const renderFrame=mountCutaway(document.getElementById('${id}-cutaway'),${JSON.stringify(fragment)},${JSON.stringify({duration:config.duration,accent,transparent})});
const clock={seconds:0};renderFrame(0);
const tl=gsap.timeline({paused:true});tl.to(clock,{seconds:${config.duration},duration:${config.duration},ease:"none",onUpdate:()=>renderFrame(clock.seconds)},0);
window.__timelines['${id}']=tl;</script></template>`;
}
