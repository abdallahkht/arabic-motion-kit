import fs from 'node:fs';
import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('gallery/catalog.json'));
assert.equal(catalog.filter(x=>x.kind==='animation').length,5);
assert.equal(catalog.filter(x=>x.kind==='creator').length,1);
const ids=new Set(catalog.map(x=>x.id));
assert.equal(ids.size,6);
for(const id of ids){
  for(const file of [`media/${id}.mp4`,`media/${id}.jpg`,`previews/${id}.webp`]){
    assert.ok(fs.statSync('gallery/'+file).size>100,file);
  }
}
assert.equal(fs.readdirSync('gallery/media').filter(p=>p.endsWith('.mp4')).length,6);
console.log('Five motion graphics and one creator edit verified.');
