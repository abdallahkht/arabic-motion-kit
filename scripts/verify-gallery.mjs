import fs from 'node:fs';import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('gallery/catalog.json'));
assert.equal(data.length,63);assert.equal(new Set(data.map(x=>x.id)).size,63);
for(const x of data)for(const ext of ['mp4','jpg'])assert.ok(fs.statSync(`gallery/media/${x.id}.${ext}`).size>100,`Missing ${x.id}.${ext}`);
console.log('63 gallery videos and posters present.');
