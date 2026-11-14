import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildProject,listBlocks,loadBlock,renderProject,resolveTiming,resolveVars} from './shared/build.mjs';

const [name,output,settings]=process.argv.slice(2);
if(!listBlocks().includes(name)||!output)throw Error('Usage: npm run render -- <scene> <output.mp4> [settings.json]. Scenes: '+listBlocks().join(', '));
const target=path.resolve(output);
if(fs.existsSync(target))throw Error('Choose a new output filename.');
const block=loadBlock(name);
const variant='full';
const project=buildProject({
  block,variant,vars:resolveVars(block,settings),timing:resolveTiming(block,variant),
  workDir:fs.mkdtempSync(path.join(os.tmpdir(),'motion-example-'))
});
renderProject(project,target,{quality:'looks',quiet:false});
console.log(target);
