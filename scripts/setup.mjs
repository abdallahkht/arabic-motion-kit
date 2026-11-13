import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../src/build.mjs';
const check=process.argv.includes('--check');
if(Number(process.versions.node.split('.')[0])<22)throw Error('Install Node.js 22 or newer.');
for(const command of ['ffmpeg','ffprobe']){const r=spawnSync(command,['-version'],{stdio:'ignore'});if(r.status!==0)throw Error(`Install ${command}; see docs/setup-ar.md`);}
if(!fs.existsSync(path.join(ROOT,'node_modules/gsap/dist/gsap.min.js')))throw Error('Run npm install first.');
if(check){console.log('Node.js, dependencies and FFmpeg are ready.');process.exit(0);}
const customRoot=process.argv.indexOf('--skills-root');
const homes=customRoot>=0?[path.resolve(process.argv[customRoot+1])]:[process.env.CODEX_HOME||path.join(os.homedir(),'.codex'),path.join(os.homedir(),'.claude')];
for(const home of homes){
 for(const name of ['animate','explain','video-fx']){
  const target=path.join(home,'skills',name),source=path.join(ROOT,'skills',name);
  if(fs.existsSync(target)||(()=>{try{return fs.lstatSync(target).isSymbolicLink()}catch{return false}})()){console.log(`Kept existing skill: ${target}. Open this repository and ask the assistant to read skills/${name}/SKILL.md if needed.`);continue;}
  fs.mkdirSync(path.dirname(target),{recursive:true});
  if(process.platform==='win32'){fs.cpSync(source,target,{recursive:true});fs.writeFileSync(path.join(target,'app-location.txt'),ROOT);}
  else fs.symlinkSync(source,target,'dir');
  console.log(`Installed ${name}`);
 }
}
if(process.argv.includes('--speech')){
 const pythonArg=process.argv.indexOf('--python');
 const candidates=pythonArg>=0?[process.argv[pythonArg+1]]:['python3.12','python3.11','python3.13',process.platform==='win32'?'python':'python3'];
 const py=candidates.find(p=>spawnSync(p,['-c','import sys;sys.exit(0 if (3,10)<=sys.version_info[:2]<=(3,13) else 1)'],{stdio:'ignore'}).status===0);
 if(!py)throw Error('Speech needs Python 3.10–3.13; Python 3.12 is recommended. Use npm run setup -- --speech --python python3.12.');
 let r=spawnSync(py,['-m','venv',path.join(ROOT,'.venv')],{stdio:'inherit'});if(r.status)process.exit(r.status);
 const venvPy=path.join(ROOT,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');
 r=spawnSync(venvPy,['-m','pip','install','-r',path.join(ROOT,'scripts/speech-requirements.txt')],{stdio:'inherit'});if(r.status)process.exit(r.status);
 console.log('Speech tools installed. The first transcription downloads the selected Whisper model.');
}
console.log('Ready. Restart your Claude Code or Codex session. Keep this folder in place.');
