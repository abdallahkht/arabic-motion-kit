#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {animations,effects,sceneTypes,findAnimation} from './catalog.mjs';
import {buildProject,ROOT} from './build.mjs';
import {buildEffect} from './effects.mjs';
const {values:v,positionals:a}=parseArgs({allowPositionals:true,options:{out:{type:'string'},config:{type:'string'},title:{type:'string'},theme:{type:'string'},duration:{type:'string'},width:{type:'string'},height:{type:'string'},input:{type:'string'},cutout:{type:'string'},start:{type:'string'},media:{type:'string'},mode:{type:'string'},json:{type:'boolean'},help:{type:'boolean'}}});
export function hf(args,cwd=process.cwd()){
 const plugin=process.env.HYPERFRAMES_PLUGIN_CLI;
 const cli=plugin||path.join(ROOT,'node_modules/hyperframes/dist/cli.js');
 if(plugin&&!fs.existsSync(plugin))throw Error('HYPERFRAMES_PLUGIN_CLI does not exist.');
 let cmd,argv;
 if(plugin){cmd=process.execPath;argv=[plugin,...args];}
 else{const pkg=JSON.parse(fs.readFileSync(path.join(ROOT,'node_modules/hyperframes/package.json'),'utf8'));const bin=typeof pkg.bin==='string'?pkg.bin:Object.values(pkg.bin)[0];cmd=process.execPath;argv=[path.resolve(ROOT,'node_modules/hyperframes',bin),...args];}
 let r=spawnSync(cmd,argv,{cwd,stdio:'inherit',env:{...process.env,HYPERFRAMES_SKIP_SKILLS:'1',HYPERFRAMES_NO_UPDATE_CHECK:'1'}});if(r.error)throw r.error;if(r.status!==0)throw Error('HyperFrames exited '+r.status);
}
const read=f=>JSON.parse(fs.readFileSync(path.resolve(f),'utf8'));
try{
 switch(a[0]){
 case 'list':console.log(JSON.stringify({animations,effects,sceneTypes},null,v.json?0:2));break;
 case 'animate':{
  if(!v.out)throw Error('Use --out work/my-animation');
  let config={...findAnimation(a[1]),...(v.config?read(v.config):{})};if(v.title)config.title=v.title;if(v.theme)config.theme=v.theme;if(v.duration)config.duration=Number(v.duration);
  const plan={width:Number(v.width||1080),height:Number(v.height||(v.mode==='top'?960:1920)),transparent:v.mode==='overlay',scenes:[config]};console.log(buildProject(plan,v.out,v.config?path.dirname(path.resolve(v.config)):process.cwd()));break;}
 case 'build':case 'explain':{if(!a[1]||!v.out)throw Error('Use build plan.json --out work/project');console.log(buildProject(read(a[1]),v.out,path.dirname(path.resolve(a[1]))));break;}
 case 'video-fx':{if(!v.out||!v.input)throw Error('Use video-fx effect --input shot.mp4 --out work/effect');console.log(buildEffect({id:a[1],input:v.input,cutout:v.cutout,media:v.media,title:v.title,start:Number(v.start||0),duration:Number(v.duration||4),theme:v.theme||'studio',config:v.config?read(v.config):{}},v.out));break;}
 case 'check':hf(['check','--json'],path.resolve(a[1]||'.'));break;
 case 'preview':hf(['preview','--no-open'],path.resolve(a[1]||'.'));break;
 case 'render':{if(!v.out)throw Error('Use render work/project --out renders/video.mp4');let output=path.resolve(v.out);fs.mkdirSync(path.dirname(output),{recursive:true});const format=path.extname(output).slice(1);hf(['render','--quality','delivery','--format',format,'-o',output],path.resolve(a[1]||'.'));break;}
 case 'cutout':{if(!a[1]||!v.out)throw Error('Use cutout shot.mp4 --out subject.mov');hf(['remove-background',path.resolve(a[1]),'-o',path.resolve(v.out)]);break;}
 default:console.log(`Arabic Motion Kit\n\n  npm run motion -- list\n  npm run motion -- animate comparison --out work/comparison\n  npm run motion -- explain examples/next-word.json --out work/explainer\n  npm run motion -- video-fx checklist --input shot.mp4 --out work/fx\n  npm run motion -- cutout shot.mp4 --out subject.mov\n  npm run motion -- check work/comparison\n  npm run motion -- preview work/comparison\n  npm run motion -- render work/comparison --out renders/comparison.mp4\n\nOptional: --config file.json --title 'عنوانك' --theme studio|midnight|plum\nFull commands: docs/commands-ar.md`);
 }
}catch(e){console.error(e.message);process.exitCode=1;}
