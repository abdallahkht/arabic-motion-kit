import fs from 'node:fs';
const scenes=[
 ['cutaway','Cutaway','ماذا وراء الريل؟','Use the built-in cutaway scene. Change the five Arabic labels to match my topic.'],
 ['campaign-map','Campaign Map','رحلة حول العالم','Render the featured campaign-map preset with my template pack. Adapt the stops and labels to my route.'],
 ['scale-reveal','Scale Reveal','مليون ورقة فوق بعض','Render the featured scale-reveal preset with my template pack. Check the units before changing the stack height.'],
 ['iceberg','Iceberg','خلف كواليس الريل','Render the featured iceberg preset with my template pack. Use my visible result at the tip and four hidden steps below.'],
 ['ranking-bars','Ranking Bars','سباق المشاهدات','Render the featured ranking-bars preset with my template pack. Use my categories and values.']
].map(([id,name,subtitle,prompt])=>({id,name,subtitle,prompt,kind:'animation'}));
scenes.push({id:'cloudflare-edit',name:'Cloudflare Security Audit',subtitle:'قصّ الخلفية حول الرأس',kind:'creator',description:'The opening shot uses a cutout to place the graphic behind the presenter’s head.'});
scenes.push(...JSON.parse(fs.readFileSync('examples/originals/catalog.json','utf8')));
fs.writeFileSync('gallery/catalog.json',JSON.stringify(scenes,null,2)+'\n');
