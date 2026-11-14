import fs from 'node:fs';
const root='https://abdallahkht.github.io/arabic-motion-kit/';
const all=JSON.parse(fs.readFileSync('gallery/catalog.json'));
const scenes=all.filter(x=>x.kind==='animation');
const card=x=>`<td align="center"><a href="${root}?clip=${x.id}"><img src="gallery/previews/${x.id}.webp" width="165" alt="${x.name}"></a><br><b>${x.name}</b><br>${x.subtitle}<br><a href="${x.sourceUrl}">Scene code</a> · <a href="${x.settingsUrl}">Settings</a></td>`;
const originals=all.filter(x=>x.kind==='original');
const originalCard=x=>`<td align="center"><a href="${root}?clip=${x.id}"><img src="gallery/previews/${x.id}.webp" width="165" alt="${x.name}"></a><br><b>${x.name}</b><br><a href="${x.sourceUrl}">Scene code</a></td>`;
const md=`# Arabic Motion Kit

Five featured motion graphics and six original animations with editable source for vertical video. Use Claude Code or Codex to adapt the words and timing to your reel.

[Start here after unzipping](START-HERE.md) · [Open the gallery](${root}) · [Download the kit](https://github.com/abdallahkht/arabic-motion-kit/releases/latest/download/arabic-motion-kit.zip) · [دليل الإعداد بالعربي](docs/setup-ar.md)

<table><tr>${scenes.slice(0,3).map(card).join('')}</tr><tr>${scenes.slice(3).map(card).join('')}</tr></table>

### Original motion examples

<table><tr>${originals.slice(0,3).map(originalCard).join('')}</tr><tr>${originals.slice(3).map(originalCard).join('')}</tr></table>

[Files and render instructions](examples/originals)

### Reel example

<a href="${root}?clip=cloudflare-edit"><img src="gallery/previews/cloudflare-edit.webp" width="200" alt="Cloudflare reel opening with presenter cutout"></a>

**Cloudflare Security Audit** · The opening shot uses a cutout to place the graphic behind the presenter’s head.

## Start here

**Just want the clips?** [Download the kit](https://github.com/abdallahkht/arabic-motion-kit/releases/latest/download/arabic-motion-kit.zip), unzip it, and drag an MP4 from [gallery/media](gallery/media) into your editor.

**Want to make your own?** Install Node.js 22 or newer and FFmpeg (including ffprobe). Open the unzipped folder in Claude Code or Codex. If you prefer Git, run:

\`\`\`sh
git clone https://github.com/abdallahkht/arabic-motion-kit.git
cd arabic-motion-kit
\`\`\`

From inside the kit folder, run:

\`\`\`sh
npm install
npm run setup
npm run setup -- --check
\`\`\`

Keep the folder in place and reopen your assistant session. Try this first:

> استخدم animate لعمل Cutaway بعنوان «شو اللي بخلّي الريل ينجح؟». خلّي آخر طبقة «الفكرة»، وصدّر الفيديو عمودي.

To try the same built-in scene from your terminal:

\`\`\`sh
npm run motion -- animate cutaway --out work/my-cutaway
npm run motion -- render work/my-cutaway --out renders/my-cutaway.mp4
\`\`\`

**For timing scenes to your voice**, install the optional speech tools with Python 3.10–3.13 available. The first transcription downloads the selected Whisper model.

\`\`\`sh
npm run setup -- --speech
\`\`\`

**For a graphic behind a person**, replace \`my-shot.mp4\` with your clip. The first command downloads the cutout model on first use. The second places the text behind the presenter.

\`\`\`sh
npm run motion -- cutout my-shot.mp4 --out work/subject.mov
npm run motion -- video-fx echo --input my-shot.mp4 --cutout work/subject.mov --title "الفكرة" --out work/behind-head
npm run motion -- render work/behind-head --out renders/behind-head.mp4
\`\`\`

[دليل الإعداد وحل المشاكل](docs/setup-ar.md) · [All commands](docs/commands-ar.md)

## How it’s built

\`\`\`mermaid
flowchart LR
    A["animate"] --> B["Your words, numbers and scene settings"]
    E["explain"] --> S["Script and scene plan"]
    S --> V["Time scenes to your recording"]
    F["video-fx"] --> L["Footage and effect layers"]
    B --> P["Editable project"]
    V --> P
    L --> P
    P --> R["HyperFrames preview and render"]
    R --> M["Finished video"]
\`\`\`

- **animate** makes one visual, such as an opening title, comparison, or 3D cutaway. Change the five labels in the [Cutaway settings](catalog/cutaway/example.json) to tell a different story.
- **explain** turns a topic into a script and a sequence of scenes. Preview the sequence silently or supply a recording to align the scenes and captions to your words. [Sample scene plan](examples/next-word.json).
- **video-fx** adds an effect to a shot. For effects behind the presenter, it layers the original footage, the graphic, and the isolated person. [Video effects guide](skills/video-fx/SKILL.md).

**Rebuild a gallery animation.** Cutaway uses the built-in command above. The other ten animations have [editable scene folders](examples/originals/blocks). For Campaign Map, Scale Reveal, Iceberg, and Ranking Bars, the renderer applies the [gallery settings](examples/featured). Run these commands from the kit folder to render Iceberg:

\`\`\`sh
npm ci --prefix examples/originals
node scripts/featured.mjs iceberg renders/my-iceberg.mp4
\`\`\`

| Folder | What you’ll find |
| --- | --- |
| [skills/](skills) | The instructions Claude Code or Codex follows for animation, explainers, and video effects |
| [catalog/](catalog) | Built-in animation presets with editable text, colors, and values |
| [src/](src) | The renderer commands, project builder, effects, and [3D Cutaway source](src/cutaway) |
| [examples/](examples) | Five explainer plans, a custom scene, sample footage, and the featured settings |
| [examples/originals/blocks/](examples/originals/blocks) | Ten scenes, each with its code, settings, and README |
| [assets/](assets) | Arabic fonts and eight sound effects |
| [gallery/media/](gallery/media) | Finished MP4s and poster images |
| [scripts/](scripts) | Setup, transcription, timing, and publishing tools |
| [docs/](docs) | Setup, commands, capabilities, validation, and credits |

## What works where

| System | Verification |
| --- | --- |
| macOS on Apple Silicon | Setup, local rendering, Arabic word timing, subject cutouts, and transparent exports tested. |
| Windows | Setup includes a Windows install path. End-to-end rendering is unverified on Windows hardware. |
| Linux | Automated repository checks run on Ubuntu. End-to-end rendering is unverified on Linux hardware. |

[Validation details](docs/testing.md) · [Automated checks](.github/workflows/checks.yml)

## Credits

Arabic Motion Kit uses HyperFrames for rendering, GSAP for animation, and IBM Plex Sans Arabic for type. Font, map data, and dependency notices are included with the scene files. See [credits and media permissions](docs/credits.md), [original scene credits](examples/originals/UPSTREAM-CREDITS.md), and the [kit license](LICENSE).

For frame-by-frame review and small cut corrections, open the finished reel in [Reel Studio](https://github.com/abdallahkht/abdallah-reel-studio).
`;
fs.writeFileSync('README.md',md);
