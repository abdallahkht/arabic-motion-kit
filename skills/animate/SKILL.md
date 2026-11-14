---
name: animate
description: "Create Arabic motion graphics, animated comparisons, charts, titles, product demonstrations, maps, code and agent diagrams from the Arabic Motion Kit. Use when the user wants one visual beat, an animation on a spoken word, a reusable overlay, or motion graphics inside an existing video."
---

# Animate

Turn the request into a finished visual and its editable project. This is a motion tool, not a replacement for the member's editing style or cut decisions.

## Featured gallery requests

When a user refers to the current gallery, use the exact featured workflow. Cutaway uses the built-in animate command. For campaign-map, scale-reveal, iceberg or ranking-bars, use the bundled scene in `examples/originals/blocks/<id>`. From the kit root run `npm ci --prefix examples/originals` once, then `node scripts/featured.mjs <id> renders/<new-name>.mp4 [settings.json]`. Omit the settings argument to reproduce the bilingual gallery preset. For direct use as B-roll, the completed silent MP4 is already in gallery/media. The Cloudflare reel is a creator edit.

For Isometric flow, Blue editorial, Ink Wash, Hours collapse, Agent fan-out and App launch in the Original motion examples gallery, use the bundled source and renderer in `examples/originals`. Run `npm ci` there once and follow its README. Use the original MP4 in `gallery/media` when a finished clip is requested.

## Locate the kit

Resolve this skill's real file location; the repository is two directories above it. On a copied Windows installation read `app-location.txt`. Work from that repository. Read `docs/commands-ar.md` and `catalog/animations.json`. Run `npm run setup -- --check`. If dependencies are missing, follow `docs/setup-ar.md` without overwriting existing skills.

If the user has a HyperFrames plugin, read its main skill and use its pinned launcher; set `HYPERFRAMES_PLUGIN_CLI` to that launcher for this kit's commands. Otherwise this repository uses its pinned local dependency. Do not update or mutate an installed plugin.

## Make the visual

1. Infer the purpose, language, format and style from the request and supplied footage. Default to Arabic 1080×1920/30fps only when nothing specifies otherwise. Ask only for content that cannot be inferred, such as missing factual numbers. Never invent a comparison, metric, quote or source.
2. Select the closest real catalog entry. Inspect its `catalog/<id>/example.json`. Copy the config into the member's project and replace the sample text/values. Sample data is illustrative; remove that label only after replacing it with sourced data. Choose studio, midnight or plum, or change the editable HTML for a custom style.
3. **Research and assets:** before building, decide what the viewer needs to see. For a named product use its official logo and actual UI. Search primary sources using available web tools; capture relevant public screenshots or record the needed interaction with available capture tools. Do not call a screenshot a screen recording. Prefer the user's provided assets. Keep each local asset's URL, retrieved date, intended use and reuse basis in `assets-ledger.json`. Never copy another creator's presenter, captions or finished edit into a new example. Do not publish private screens, tokens or account details. When a needed asset or capture capability is unavailable, say what is missing and use a clearly labelled diagram or request the material.
4. Build: `npm run motion -- animate <id> --config projects/my-config.json --out work/my-scene`. Choose a new output directory so existing edits survive. `--mode top` gives 1080×960; `--mode overlay` gives a transparent full canvas, exported as MOV/WebM. MP4 has no alpha. Real media can be placed in the generated HTML; use contain to show a whole screen and crop only deliberately. Maps are diagrams until actual route data/map imagery has been supplied; see `docs/commands-ar.md`.
5. Spoken-word timing: transcribe locally with `scripts/transcribe.py` if tools are installed, or import reviewed word timestamps. Use `scripts/sync.py words.json 'actual phrase'`. Resolve repeated phrases explicitly. Measure the chosen animation's landing time in its timeline; place it at `word_start - landing_time`, not merely the beginning of the sentence. Preserve the source audio and whole words. Integrate the clip using the member's edit pipeline. The animation command exports one scene; it does not silently edit the entire source video.
6. Use the original effects in `assets/sounds/` quietly on visible actions when sound is requested. Keep narration intelligible. Do not assume the silent gallery has a soundtrack. The kit includes no music or paid sound pack.
7. Run `npm run motion -- check work/my-scene`. Inspect snapshots at entrances, landings, exits and overlaps. Read every Arabic phrase at phone size. Check real values, labels, RTL/LTR mixing, clipping and contrast. Open the preview, then render when the user requested the file. Use `npm run motion -- render work/my-scene --out renders/my-scene.mp4`. Probe the output and inspect decoded frames; a passing lint alone is not a visual review.
8. Deliver the actual video and project folder. If Reel Studio is installed, use its review skill to import the complete edited video. Never claim this kit includes that editor or automatically preserves its cut map.

## Style and delivery rules

- Follow the member's own style or reference. These examples are starting points, not someone's private style profile.
- Preserve source color. No beauty filters, face zooms or fake product logos unless explicitly requested.
- No text over the face during motion or transitions. Cover downward script-reading beats with meaningful full-frame B-roll/motion, not just a top panel that leaves the face visible.
- Keep short Arabic text legible. English code stays LTR. Avoid all elements using the same fade-up entrance.
- The agent handles code, sources, timing and validation; the member should not have to fill technical JSON by hand.
- State actual limitations and checks. Never claim frame-by-frame review, listening, face tracking or narration that was not performed.
