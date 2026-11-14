import fs from 'node:fs';
const root='https://abdallahkht.github.io/arabic-motion-kit/';
const all=JSON.parse(fs.readFileSync('gallery/catalog.json'));
const scenes=all.filter(x=>x.kind==='animation');
const card=x=>`<td align="center"><a href="${root}?clip=${x.id}"><img src="gallery/previews/${x.id}.webp" width="165" alt="${x.name}"></a><br><b>${x.name}</b><br>${x.subtitle}</td>`;
const originals=all.filter(x=>x.kind==='original');
const originalCard=x=>`<td align="center"><a href="${root}?clip=${x.id}"><img src="gallery/previews/${x.id}.webp" width="165" alt="${x.name}"></a><br><b>${x.name}</b><br><a href="examples/originals/blocks/${x.id}">Scene code</a></td>`;
const md=`# Arabic Motion Kit

Five featured motion graphics and six original animations with editable source for vertical video. Use Claude Code or Codex to adapt the words and timing to your reel.

[Open the gallery](${root}) · [Download the kit](https://github.com/abdallahkht/arabic-motion-kit/releases/latest/download/arabic-motion-kit.zip) · [دليل الإعداد بالعربي](docs/setup-ar.md)

<table><tr>${scenes.slice(0,3).map(card).join('')}</tr><tr>${scenes.slice(3).map(card).join('')}</tr></table>

### Original motion examples

<table><tr>${originals.slice(0,3).map(originalCard).join('')}</tr><tr>${originals.slice(3).map(originalCard).join('')}</tr></table>

[Files and render instructions](examples/originals)

### Reel example

<a href="${root}?clip=cloudflare-edit"><img src="gallery/previews/cloudflare-edit.webp" width="200" alt="Cloudflare reel opening with presenter cutout"></a>

**Cloudflare Security Audit** · The opening shot uses a cutout to place the graphic behind the presenter’s head.

### Make your own

Download and unzip the kit. Open the folder in Claude Code or Codex and say:

> اقرأ دليل الإعداد، جهّز المشروع، واعمل لي حركة Cutaway بالعربي عن فكرة الريل.

Install Node.js 22+ and FFmpeg, run \`npm install\` and \`npm run setup\`, then reopen your assistant session. The kit includes three skills: **animate** for a single motion graphic, **explain** for a narrated sequence, and **video-fx** for effects on footage.

**Cutaway** runs directly from this kit. Change the five labels in [its settings](catalog/cutaway/example.json). **Campaign Map, Scale Reveal, Iceberg and Ranking Bars** use the existing template engine with [our bilingual settings](examples/featured). To render these four yourself, point the assistant to your installed [template pack](https://github.com/ctskool/chase-animations). The finished MP4s play without installing either engine.

\`\`\`sh
npm run motion -- animate cutaway --out work/my-cutaway
npm run motion -- render work/my-cutaway --out renders/my-cutaway.mp4
node scripts/featured.mjs iceberg "/path/to/installed-template-pack" renders/my-iceberg.mp4
\`\`\`

[Commands](docs/commands-ar.md) · [Sources and media permissions](docs/credits.md) · [Reel Studio editor](https://github.com/abdallahkht/abdallah-reel-studio)
`;
fs.writeFileSync('README.md',md);
