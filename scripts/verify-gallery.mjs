import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('gallery/catalog.json'));
assert.equal(catalog.filter(x=>x.kind==='animation').length,5);
assert.equal(catalog.filter(x=>x.kind==='creator').length,1);
const ids=new Set(catalog.map(x=>x.id));
assert.equal(ids.size,12);
const originals=catalog.filter(x=>x.kind==='original');
assert.equal(originals.length,6);
for(const {id,sha256} of originals){
  assert.equal(createHash('sha256').update(fs.readFileSync(`gallery/media/${id}.mp4`)).digest('hex'),sha256);
  for(const file of ['block.html','block.css','block.js','block.json'])assert.ok(fs.statSync(`examples/originals/blocks/${id}/${file}`).isFile());
}
for(const id of ids){
  for(const file of [`media/${id}.mp4`,`media/${id}.jpg`,`previews/${id}.webp`]){
    assert.ok(fs.statSync('gallery/'+file).size>100,file);
  }
}
assert.equal(fs.readdirSync('gallery/media').filter(p=>p.endsWith('.mp4')).length,12);
console.log('Five featured animations, six original videos and source folders, and one reel verified.');
