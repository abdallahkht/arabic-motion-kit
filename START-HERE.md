# Your first animation

1. Unzip the kit and keep the whole folder together. To use a finished clip today, drag an MP4 from [gallery/media](gallery/media) into your editor. [Browse the gallery](https://abdallahkht.github.io/arabic-motion-kit/).
2. To make a new animation, install Node.js 22+ and FFmpeg. Open the kit folder in Claude Code or Codex and say **«جهّز هذا المجلد وثبّت مهاراته، ثم اعمل لي حركة Iceberg عن مراحل إنتاج الريل.»**
3. The assistant runs `npm install` and `npm run setup` from this folder. Reopen the assistant session to load the skills. For the ten bundled template scenes, install their renderer dependencies once with `npm ci --prefix examples/originals`.
4. Keep custom settings and editable projects in a new folder for each job under `work/`. Save finished videos to `renders/`. Keep your kit folder in place so installed skills can find the files.

| Ask for | Skill |
| --- | --- |
| One animation, e.g. a moving map or a chart with your numbers | [animate](skills/animate/SKILL.md) |
| An explainer from an idea, with a script, scene plan and optional recording | [explain](skills/explain/SKILL.md) |
| An effect on your own footage, e.g. text behind your head | [video-fx](skills/video-fx/SKILL.md) |

Find the [Cutaway source](src/cutaway), [ten scene folders](examples/originals/blocks) and [four bilingual gallery presets](examples/featured). The Cloudflare reel is a finished demonstration of a presenter cutout.

[Setup بالعربي](docs/setup-ar.md) · [Commands](docs/commands-ar.md)
